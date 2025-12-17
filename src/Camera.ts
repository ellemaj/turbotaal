export default class Camera {
  public x: number = 0;

  public y: number = 0;

  /**
   * Follows the target (car)
   *
   * @param targetX the X of the car
   * @param targetY the Y of the car
   * @param canvas canvas it needs to be on
   */
  public follow(targetX: number, targetY: number, canvas: HTMLCanvasElement): void {
    this.x = targetX - canvas.width / 2;
    this.y = targetY - canvas.height / 2;
  }
}
