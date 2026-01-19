
export default class Health {
  private carHealth: number = 100;

  private isColliding: boolean = false;


  public setColliding(collision: boolean): void {
    this.isColliding = collision;
  }

  /**
   *checks if carhealth should change
   */
  public updateHealth(): void {
    if (this.isColliding) {
      this.carHealth = (this.carHealth - 0.1);
    }
  }

  public getHealth(): number{
    return this.carHealth;
  }

  /**
   * Heals the car to full HP
   */
  public heal(healing: number): void {
    this.carHealth += healing;
    if (this.carHealth > 100) {
      this.carHealth = 100;
    }
  }

  public getSpeedMultiplier(): number {
    if (this.carHealth <= 40) {
      return 0.5;
    }
    if (this.carHealth <= 60) {
      return 0.7;
    }
    return 1;
  }


  /** if car is below 20 pitstop will become true
   *@returns true when HP<20, sending you to the pitstop. otherwise false
   */
  public carIsLow(): boolean{
    if (this.carHealth < 20) {
      return true;
    }
    return false;
  }
}
