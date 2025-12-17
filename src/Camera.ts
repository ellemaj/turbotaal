export default class Camera {
  public x: number = 0;

  public y: number = 0;

  public follow(targetX: number, targetY: number, canvas: HTMLCanvasElement): void {
    this.x = targetX - canvas.width / 2;
    this.y = targetY - canvas.height / 2;
  }
}
