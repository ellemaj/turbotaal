import CarSkins from './CarSkins.js';

export default class PlayerData {
  private static maxLaps: number = 5;

  private static skinIndex: number = 0;

  private static selectedSkinIndex: number = 0;

  private static turboTokens: number = 0;

  private static turboCups: number = 0;

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
}
