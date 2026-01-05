import CarSkins from './CarSkins.js';

export default class PlayerData {
  private static skinIndex: number = 0;

  public static getSkinIndex(): number {
    return this.skinIndex;
  }

  public static setSkinIndex(index: number): void {
    this.skinIndex = Math.max(0, Math.min(index, CarSkins.length - 1));
  }

  public static nextSkin(): void {
    this.skinIndex = (this.skinIndex +1) % CarSkins.length;
  }

  public static previousSkin(): void {
    this.skinIndex =
    (this.skinIndex - 1 + CarSkins.length) % CarSkins.length;
  }
}
