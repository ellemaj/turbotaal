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

  private state: 'welcome' | 'menu' | 'racing' | 'pitstop' | 'preshop' | 'shop' | 'postshop' | 'finished' = 'welcome';

  private sections: Record<
    'welcome' | 'menu' | 'racing' | 'pitstop' | 'preshop' | 'shop' | 'postshop' | 'finished',
    TutorialSection
  >;

  public constructor(boardSize: Vector2, canvas: HTMLCanvasElement,) {
    super(boardSize, canvas);

    // All the dialogs for the game, per state of the tutorial
    // The background and sprite also can be changed for every state
    this.sections = {
      welcome: {
        dialog: [
          'Hoi! Ik ben Cheeta de cheeta!',
          'Welkom bij TurboTaal! Ik ga je stap voor stap uitleggen hoe TurboTaal werkt.',
        ],
        background: CanvasRenderer.loadNewImage('./assets/backgrounds/tutorial.png'),
        sprite: CanvasRenderer.loadNewImage('./assets/sprites/cheetah1.png'),
      },

      menu: {
        dialog: [
          'In het beginmenu kun je kiezen voor shop, en voor start.',
          'Als je wilt racen, dan klik je op start.',
          'Je komt dan in het keuzemenu van de racebanen! Hier kun je kiezen op welke racebaan je wilt racen.',
          'Als je dit voor het eerst speelt, kan je alleen de eerste racebaan kiezen. De andere racebanen met je ontgrendelen met TurboCups!',
          'TurboCups kun je verdienen door zo snel mogelijk te racen!',
          'Maar, hoe werkt het racen dan? Dat ga ik je nu uitleggen!'
        ],
        background: CanvasRenderer.loadNewImage('./assets/backgrounds/tutorial.png'),
        sprite: CanvasRenderer.loadNewImage('./assets/sprites/cheetah1.png'),
      },

      racing: {
        dialog: [
          'Achter mij zie je nu de eerste racebaan.',
          'Linksboven zie je de rondeteller: deze telt hoeveel rondes je al hebt gereden!',
          'Rechtsboven in beeld zie je de stopwatch, deze houd bij hoe snel je rijdt.',
          'Het is de bedoeling om zo snel mogelijk 3 rondes te rijden. Als je op ESC drukt, gaat TurboTaal even op pauze, en loopt de tijd niet meer.',
          'Je kunt met de auto rijden door de WASD, of de pijltjestoetsen te gebruiken.',
          'Tijdens het rijden komt er een vraag boven in beeld, en komen er antwoorden op de racebaan te staan.',
          'Als je door het goede antwoord heen rijdt ga je sneller!',
          'Maar, als je door het foute antwoord heen rijdt ga je langzamer, en gaan er punten van je auto af...',
          'Ga je te vaak door een fout antwoord heen, en zijn de punten van je auto te laag, dan moet je naar de pitstop.',
          'Mijn vriend Walter gaat je daar meer over uitleggen!',
        ],
        background: CanvasRenderer.loadNewImage('./assets/tutorial/race1.png'),
        sprite: CanvasRenderer.loadNewImage('./assets/sprites/cheetah1.png'),
      },

      pitstop: {
        dialog: [
          'Hoi! Ik ben Walter de Wasbeer, de baas van de pitstop!',
          'Als je auto niet genoeg punten meer heeft, kun je naar de pitstop komen om je punten daar weer aan te vullen!',
          'Je krijgt hier een paar korte vragen en als je die goed beantwoord krijg je weer volle punten.',
          'Maar, let op! De stopwatch loopt nog steeds door!',
          'Je moet dus zo snel mogelijk de vragen goed beantwoorden, anders gaat het van je tijd af voor het racen!',
          'Ook hier kun je de game weer op pauze zetten.',
        ],
        background: CanvasRenderer.loadNewImage('./assets/backgrounds/pitstop.png'),
        sprite: CanvasRenderer.loadNewImage('./assets/sprites/wasbeer1.png'),
      },

      preshop: {
        dialog: [
          'Zo, nu weet je hoe het spel werkt! Maar, hoe zit het nou met de shop?',
          'Dat gaan Walter en ik je ook uitleggen!',
          'Als je in het beginmenu op shop klikt, kom je in de shop terecht. Hier kun je skins kopen, en powerups.'
        ],
        background: CanvasRenderer.loadNewImage('./assets/backgrounds/tutorial.png'),
        sprite: CanvasRenderer.loadNewImage('./assets/sprites/cheetah1.png'),
      },

      shop: {
        dialog: [
          'Maar wat zijn dat eigenlijk?',
          'Skins laten je auto er mooier uitzien! Je hebt keuze uit verschillende skins, maar de ene is duurder dan de andere.',
          'Als je geen skin wilt kopen, maar wel een powerup, kan dat ook hier!',
          'Powerups zorgen ervoor dat je auto beter of sneller rijdt, of ze zorgen ervoor dat je auto minder snel kapotgaat!',
          'Super handig dus, maar.. hoe koop je skins of powerups dan?'
        ],
        background: CanvasRenderer.loadNewImage('./assets/backgrounds/tutorial.png'),
        sprite: CanvasRenderer.loadNewImage('./assets/sprites/wasbeer1.png'),
      },

      postshop: {
        dialog: [
          'Om dingen te kopen in de shop, moet je TurboMedals verdienen. Die verdien je... door te racen!',
          'TurboCups behaal je door binnen een bepaalde tijd te racen, en kun je gebruiken om andere racebanen te ontgrendelen.',
          'TurboMedals verdien je door zo snel mogelijk te racen! Hoe sneller, hoe meer medals.',
          'De medals gebruik je om skins of powerups te kopen in de shop!'
        ],
        background: CanvasRenderer.loadNewImage('./assets/backgrounds/tutorial.png'),
        sprite: CanvasRenderer.loadNewImage('./assets/sprites/cheetah1.png'),
      },

      finished: {
        dialog: [
          'Dat was de uitleg! Nu weet je hoe alles werkt.',
          'Ben je het even vergeten of snap je het nog steeds niet? Je kunt deze tutorial altijd opnieuw bekijken via het vraagteken-knopje in het startmenu.',
          'Veel plezier met het spelen van TurboTaal!',
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

      // Go to the next state when there arent any dialogs in the current state
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
    // Nothing to update
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

    // Switch to the right state when nextState() is called
    switch (this.state) {
      case 'welcome':
        this.state = 'menu';
        break;
      case 'menu':
        this.state = 'racing';
        break;
      case 'racing':
        this.state = 'pitstop';
        break;
      case 'pitstop':
        this.state = 'preshop';
        break;
      case 'preshop':
        this.state = 'shop';
        break;
      case 'shop':
        this.state = 'postshop';
        break;
      case 'postshop':
        this.state = 'finished';
        break;
      case 'finished':
        this.goToStart = true;
        break;
    }

    // Switch to the right background
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

    // Render the background
    ctx.drawImage(section.background, 0, 0, canvas.width, canvas.height);

    // Render the sprite (only draw when the image has loaded)
    if (section.sprite && section.sprite.naturalHeight > 0) {
      ctx.drawImage(
        section.sprite,
        50,
        canvas.height - section.sprite.naturalHeight,
      );
    }

    // Render the dialog
    const text: string = section.dialog[this.currentDialogIndex] ?? '';

    CanvasRenderer.writeText(canvas, text, this.boardSize.x / 2, this.boardSize.y / 2 - 350, 'center', 'Arial', 24, 'black');
    CanvasRenderer.writeText(canvas, 'Druk op SPATIE om verder te gaan...', this.boardSize.x / 2, this.boardSize.y / 2 - 300, 'center', 'Arial', 24, 'grey');
  }
}
