export default class Stopwatch {
  private elapsed: number = 0;

  private running: boolean = false;

  private penalty: boolean = false; // Only for the demo!

  /**
   * Starts the timer
   */
  public start(): void {
    this.running = true;
  }

  /**
   * Stops the timer
   */
  public stop(): void {
    this.running = false;
  }

  // Only for the demo!
  public getPenalty(): void {
    this.penalty = true;
  }

  /**
   * Updates the timer
   *
   * @param delta time elapsed
   */
  public update(delta: number): void {
    if (this.running) {
      this.elapsed += delta;
    }
    if (this.penalty) { // Only for the demo!
      this.elapsed += 10000;
      this.penalty = false;
    }
  }

  public getFormatted(): string {
    const totalSeconds: number = this.elapsed / 1000;
    const minutes: number = Math.floor(totalSeconds / 60);
    const seconds: number = Math.floor(totalSeconds % 60);
    const ms: number = Math.floor(this.elapsed % 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms
      .toString()
      .padStart(3, '0')}`;
  }
}
