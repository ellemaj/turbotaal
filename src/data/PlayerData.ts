import CarSkins from './CarSkins.js';

type PlayerSaveData = {
  maxLaps: number,
  skinIndex: number,
  selectedSkinIndex: number,
  turboTokens: number,
  turboCups: number,
  bestTimeMs: number | null,
  skinsUnlocked: boolean[],
};

type CarSkin = {
  unlocked: boolean;
};

export default class PlayerData {
  private static maxLaps: number = 5;

  private static skinIndex: number = 0;

  private static selectedSkinIndex: number = 0;

  private static turboTokens: number = 0;

  private static turboCups: number = 0;

  private static bestTimeMs: number | null = null;

  private static readonly STORAGE_KEY: string = 'playerData';

  private static save(): void {
    const data: {
      maxLaps: number,
      skinIndex: number,
      selectedSkinIndex: number,
      turboTokens: number,
      turboCups: number,
      bestTimeMs: number | null,
      skinsUnlocked: boolean[],
    } = {
      maxLaps: this.maxLaps,
      skinIndex: this.skinIndex,
      selectedSkinIndex: this.selectedSkinIndex,
      turboTokens: this.turboTokens,
      turboCups: this.turboCups,
      bestTimeMs: this.bestTimeMs,
      skinsUnlocked: CarSkins.map((s: CarSkin) => s.unlocked),
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  public static setMaxLaps(laps: number): void {
    this.maxLaps = Math.max(1, laps);
  }

  public static getMaxLaps(): number {
    return this.maxLaps;
  }

  public static getSkinIndex(): number {
    return this.skinIndex;
  }

  public static setSkinIndex(index: number): void {
    this.skinIndex = Math.max(0, Math.min(index, CarSkins.length - 1));
  }

  /**
   * Go to the next skin
   */
  public static nextSkin(): void {
    if (this.skinIndex < CarSkins.length - 1) {
      this.skinIndex = this.skinIndex + 1;
    }
  }

  /**
   * Go to the previous skin
   */
  public static previousSkin(): void {
    if (this.skinIndex > 0) {
      this.skinIndex = this.skinIndex - 1;
    }
  }

  public static getCurrentSkinUnlocked(): boolean {
    return CarSkins[this.skinIndex]?.unlocked ?? false;
  }

  public static getTurboTokens(): number {
    return this.turboTokens;
  }

  public static getTurboCups(): number {
    return this.turboCups;
  }

  /**
   * Add the TurboTokens to the playerdata
   *
   * @param amount amount of tokens
   */
  public static addTurboTokens(amount: number): void {
    this.turboTokens += amount;
    if (this.turboTokens < 0) {
      this.turboTokens = 0;
    }
    this.save();
  }

  /**
   * Add the Turbocups to the playerdata
   *
   * @param amount amount of cups
   */
  public static addTurboCups(amount: number): void {
    this.turboCups += amount;
    if (this.turboCups < 0) {
      this.turboCups = 0;
    }
    this.save();
  }

  public static getSelectedSkin(): number {
    return this.selectedSkinIndex;
  }

  /**
   * Index of the selected skin
   *
   * @param index the index of the skin
   */
  public static selectSkin(index: number): void {
    this.selectedSkinIndex = index;
  }

  public static getBestTime(): number | null {
    return this.bestTimeMs;
  }

  /**
   * If there's a new highscore, set the besttime to it
   *
   * @param timeMs racetime in ms
   */
  public static submitTime(timeMs: number): void {
    if (this.bestTimeMs === null || timeMs < this.bestTimeMs) {
      this.bestTimeMs = timeMs;
      this.save();
    }
  }

  /**
   * Load
   *
   * @returns /
   */
  public static load(): void {
    const raw: string | null = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const data: PlayerSaveData = JSON.parse(raw) as PlayerSaveData;

      this.maxLaps = data.maxLaps ?? this.maxLaps;
      this.skinIndex = data.skinIndex ?? this.skinIndex;
      this.selectedSkinIndex = data.selectedSkinIndex ?? this.selectedSkinIndex;
      this.turboTokens = data.turboTokens ?? this.turboTokens;
      this.turboCups = data.turboCups ?? this.turboCups;
      this.bestTimeMs = data.bestTimeMs ?? this.bestTimeMs;

      if (Array.isArray(data.skinsUnlocked)) {
        data.skinsUnlocked.forEach((unlocked: boolean, i: number) => {
          if (CarSkins[i]) {
            CarSkins[i].unlocked = unlocked;
          }
        });
      }
    } catch {
      console.warn('PlayerData load failed');
    }
  }
}
