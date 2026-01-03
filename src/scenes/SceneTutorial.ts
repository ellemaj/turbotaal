import Scene from './Scene.js';
import KeyListener from '../KeyListener.js';
import MouseListener from '../MouseListener.js';
import Vector2 from '../Vector2.js';
import CanvasRenderer from '../CanvasRenderer.js';
import ScenePause from './ScenePause.js';
import SceneStart from './SceneStart.js';

/**
 * A tutorial section with an own dialog, background and sprite
 */
type TutorialSection = {
  dialog: string[];
  background: HTMLImageElement;
  sprite: HTMLImageElement;
};

export default class SceneTutorial extends Scene {
  private pause: boolean = false;

  private currentDialogIndex: number = 0;

  private goToStart: boolean = false;

  private state: 'welcome' | 'racing' | 'pitstop' | 'shop' | 'finished' = 'welcome';

  private sections: Record<
    'welcome' | 'racing' | 'pitstop' | 'shop' | 'finished',
    TutorialSection
  >;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement,) {
    super(boardSize, canvas);

    this.sections = {
      welcome: {
        dialog: [
          'Hoi! Ik ben Cheeta de cheeta!',
          'Welkom bij TurboTaal! Ik ga je stap voor stap uitleggen hoe TurboTaal werkt.',
          'Wout is een schatje',
        ],
        background: CanvasRenderer.loadNewImage('./assets/backgrounds/tutorial.png'),
        sprite: CanvasRenderer.loadNewImage('./assets/sprites/cheetah1.png'),
      },

      racing: {
        dialog: [
          'Je kunt met de auto rijden door de WASD, of de pijltjestoetsen te gebruiken.',
          'Tijdens het rijden komt er een vraag boven in beeld, en komen er antwoorden op de racebaan te staan.',
          'Als je door het goede antwoord heen rijdt ga je sneller!',
          'Maar, als je door het foute antwoord heen rijdt ga je langzamer, en gaan er punten van je auto af...',
          'Ga je te vaak door een fout antwoord heen, en zijn de punten van je auto te laag, dan moet je naar de pitstop.',
          'Mijn vriend Walter gaat je daar meer over uitleggen!',
        ],
        background: CanvasRenderer.loadNewImage('./assets/backgrounds/tutorial.png'),
        sprite: CanvasRenderer.loadNewImage('./assets/sprites/cheetah1.png'),
      },

      pitstop: {
        dialog: [
          'Hoi! Ik ben Walter de Wasbeer, de baas van de pitstop!',
          'Als je auto niet genoeg punten meer heeft, kun je naar de pitstop komen om je punten daar weer aan te vullen!',
          'Je krijgt hier een paar korte vragen en als je die goed beantwoord krijg je weer volle punten.',
          'Maar, let op! De stopwatch loopt nog steeds door!',
          'Je moet dus zo snel mogelijk de vragen goed beantwoorden, anders gaat het van je tijd af voor het racen!',
        ],
        background: CanvasRenderer.loadNewImage('./assets/backgrounds/pitstop.png'),
        sprite: CanvasRenderer.loadNewImage('./assets/sprites/wasbeer1.png'),
      },

      shop: {
        dialog: [
          'In de shop kun je verschillende dingen kopen voor je auto.',
          'Je kunt bijvoorbeeld powerups kopen of skins!',
          'Bluh bluh bluh',
        ],
        background: CanvasRenderer.loadNewImage('./assets/backgrounds/tutorial.png'),
        sprite: CanvasRenderer.loadNewImage('./assets/sprites/wasbeer1.png'),
      },

      finished: {
        dialog: [
          'Dat was de uitleg!',
          'Veel plezier met TurboTaal!',
        ],
        background: CanvasRenderer.loadNewImage('./assets/backgrounds/tutorial.png'),
        sprite: CanvasRenderer.loadNewImage('./assets/sprites/cheetah1.png'),
      },
    };

    // Initial background
    this.background = this.sections.welcome.background;
  }

  /**
   * Processes the input
   *
   * @param keyListener keylistener that is being used
   * @param mouseListener mouselistener that is being used
   */
  public override processInput(keyListener: KeyListener, mouseListener: MouseListener): void {
    // Pause when ESC is pressed
    if (keyListener.keyPressed(KeyListener.KEY_ESC)) {
      this.pause = true;
    }

    // Go to the next dialog when SPACE is pressed
    if (keyListener.keyPressed(KeyListener.KEY_SPACE)) {
      this.currentDialogIndex += 1;

      const section: TutorialSection = this.sections[this.state];
      if (this.currentDialogIndex >= section.dialog.length) {
        this.nextState();
      }
    }
  }

  /**
   * Updates the game
   *
   * @param delta time elapsed
   */
  public override update(delta: number): void {
    //
  }

  public override getNextScene(): Scene | null {
    if (this.pause) {
      this.pause = false;
      return new ScenePause(this.boardSize, this.canvas, this);
    } else if (this.goToStart) {
      this.goToStart = false;
      return new SceneStart(this.boardSize, this.canvas);
    }

    return null;
  }

  private nextState(): void {
    this.currentDialogIndex = 0;

    switch (this.state) {
      case 'welcome':
        this.state = 'racing';
        break;
      case 'racing':
        this.state = 'pitstop';
        break;
      case 'pitstop':
        this.state = 'shop';
        break;
      case 'shop':
        this.state = 'finished';
        break;
      case 'finished':
        this.goToStart = true;
        break;
    }

    this.background = this.sections[this.state].background;
  }

  /**
   * Renders all the things in scenepitstop
   *
   * @param canvas the canvas it needs to be rendered on
   * @returns yes
   */
  public render(canvas: HTMLCanvasElement): void {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const section: TutorialSection = this.sections[this.state];

    // Background
    ctx.drawImage(section.background, 0, 0, canvas.width, canvas.height);

    // Sprite (only draw when the image has loaded)
    if (section.sprite && section.sprite.naturalHeight > 0) {
      ctx.drawImage(
        section.sprite,
        50,
        canvas.height - section.sprite.naturalHeight,
      );
    }

    // Dialog
    const text: string = section.dialog[this.currentDialogIndex] ?? '';

    CanvasRenderer.writeText(canvas, text, this.boardSize.x / 2, this.boardSize.y / 2 - 350, 'center', 'Arial', 24, 'black');
    CanvasRenderer.writeText(canvas, 'Druk op SPATIE om verder te gaan...', this.boardSize.x / 2, this.boardSize.y / 2 - 300, 'center', 'Arial', 24, 'grey');
  }
}
