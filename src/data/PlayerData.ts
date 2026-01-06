import CarSkins from './CarSkins.js';

export default class PlayerData {
  private static skinIndex: number = 0;

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
      this.skinIndex++;
    }
  }

  /**
   * Go to the previous skin
   */
  public static previousSkin(): void {
    if (this.skinIndex > 0) {
      this.skinIndex--;
    }
  }

  public static getCurrentSkinUnlocked(): boolean {
    return CarSkins[this.skinIndex]?.unlocked ?? false;
  }
}
