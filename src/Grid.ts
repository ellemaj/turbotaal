import CanvasRenderer from './CanvasRenderer.js';

export default class Grid {
  private tileSize: number = 64; // Size of 1 square cell in pixels

  private columns: number;

  private rows: number;

  private width: number;

  private height: number;

  private collision: number[];

  public constructor(columns: number, rows: number, collision: number[]) {
    this.columns = columns;
    this.rows = rows;
    this.collision = collision;

    this.width = this.tileSize * columns;
    this.height = this.tileSize * rows;
  }

  public getTileSize(): number {
    return this.tileSize;
  }

  public getColumns(): number {
    return this.columns;
  }

  public getRows(): number {
    return this.rows;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  /**
   * Check if the given X/Y coordinate would result in a collision for grass.
   *
   * @param col Column (or: X-coordinate)
   * @param row Row (or: Y-coordinate)
   * @returns true if cell is solid, false if passable
   */
  public getCollision(col: number, row: number): boolean {
    if (this.collision[this.columns * row + col] == 1) {
      return true;
    }
    return false;
  }

  /**
   * Check if the given X/Y coordinate would result in a collision for pitstop.
   *
   * @param col Column (or: X-coordinate)
   * @param row Row (or: Y-coordinate)
   * @returns true if cell is solid, false if passable
   */
  public getCollisionPitStop(col: number, row: number): boolean {
    if (this.collision[this.columns * row + col] == 2) {
      return true;
    }
    return false;
  }

  /**
   * Check if the given X/Y coordinate would result in a collision for mariokart checkpoint system.
   *
   * @param col Column (or: X-coordinate)
   * @param row Row (or: Y-coordinate)
   * @returns true if cell is solid, false if passable
   */
  public getCollisionCheckpoint(col: number, row: number): boolean {
    if (this.collision[this.columns * row + col] == 3) {
      return true;
    }
    return false;
  }

  /**
   * Draw the grid onto the screen. Meant as a debug function, called by BaseGame.ts.
   */
  public render(canvas: HTMLCanvasElement): void {
    for (let rows: number = 0; rows < this.rows; rows++) {
      for (let columns: number = 0; columns < this.columns; columns++) {
        CanvasRenderer.drawRectangle(
          canvas,
          columns * this.tileSize,
          rows * this.tileSize,
          this.tileSize,
          this.tileSize,
          'black');
      }
    }

    // Also render collision mapping
    for (let rows: number = 0; rows < this.rows; rows++) {
      for (let columns: number = 0; columns < this.columns; columns++) {
        if (this.getCollision(columns, rows) === true) {
          CanvasRenderer.fillRectangle(
            canvas,
            columns * this.tileSize,
            rows * this.tileSize,
            this.tileSize,
            this.tileSize,
            'orange');
        }
      }
    }
  }
}
