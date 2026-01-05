
export default class Health {
  private carHealth: number = 100;

  private isColliding: boolean = false;


  public setColliding(collision: boolean): void {
    this.isColliding = collision;
  }

  /**
   *checks if carhealth should change */
  public updateHealth(): void {
    if (this.isColliding) {
      this.carHealth = (this.carHealth - 0.1);
      console.log(this.carHealth);
    }
  }

  public getHealth(): number{
    return this.carHealth;
  }

  /**
   *heals the car
   */
  public Heal(healing: number): void {
    this.carHealth += healing;
    if (this.carHealth > 100) {
      this.carHealth = 100;
    }
  }

  /** if car is below 20 pitstop will become true
   *@returns if car is low
   */
  public carIsLow(): boolean{
    if (this.carHealth < 20) {
      return true;
    }
    return false;
  }
}
