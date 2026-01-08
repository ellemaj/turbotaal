export default class Stopwatch {
  private running: boolean = false;

  private elapsed: number = 0;

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

  /**
   * Pauses the timer
   */
  public pause(): void {
    this.running = false;
  }

  /**
   * Resumes the timer
   */
  public resume(): void {
    this.running = true;
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

  /**
   * Returns the elapsed time in ms
   *
   * @returns the elapsed time in ms
   */
  public getTime(): number {
    return this.elapsed;
  }

  public reset(): void {
    this.elapsed = 0;
    this.running = false;
  }
}
