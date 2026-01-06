import CarSkins from './CarSkins.js';

export default class PlayerData {
  private static skinIndex: number = 0;

  private static selectedSkinIndex: number = 0;

  private static coins: number = 500; // Only for testing!!!! Default = 0

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

  public static getCoins(): number {
    return this.coins;
  }

  /**
   * Add the coins to the playerdata
   *
   * @param amount amount of coins
   */
  public static addCoins(amount: number): void {
    this.coins += amount;
    if (this.coins < 0) {
      this.coins = 0;
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
