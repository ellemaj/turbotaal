// import CanvasRenderer from '../CanvasRenderer.js';
// import KeyListener from '../KeyListener.js';
// import Vector2 from '../Vector2.js';
// import SceneShop from './SceneShop.js';
// import SceneGarage from './SceneGarage.js';
// import Scene from './Scene.js';

// export default class ScenePowerups extends Scene {
//   private shopSkins: boolean;

//   public constructor(boardSize: Vector2, canvas: HTMLCanvasElement) {
//     super(boardSize, canvas);
//     this.shopSkins = true; // go to garage
//   }

//   /**
//    * Starts the game when space is pressed
//    *
//    * @param keyListener Looks is the space key is being pressed
//    */
//   public override processInput(keyListener: KeyListener): void {
//     if (keyListener.keyPressed(KeyListener.KEY_SPACE)) {
//       this.shopSkins = false;
//     }
//   }

//   /**
//    * /
//    * @param delta /
//    * @returns /
//    */
//   public override update(delta: number): void {
//     return;
//   }

//   public override getNextScene(): Scene | null {
//     if(this.shopSkins){
//       return new SceneGarage(this.boardSize, this.canvas);
//     }
//     return null;
//   }

//   /**
//    * //
//    *
//    * @param canvas the canvas it needs to be rendered on
//    */
//   public override render(canvas: HTMLCanvasElement): void {
//     CanvasRenderer.writeText(
//       canvas,
//       'Skins. Press space to go back to the shop menu.',
//       this.boardSize.x / 2,
//       this.boardSize.y / 2);
//   }
// }
