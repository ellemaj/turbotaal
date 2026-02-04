import CanvasRenderer from '../CanvasRenderer.js';
import PlayerData from './PlayerData.js';
import { CarSkin } from './CarSkin.js';

const carSkins: CarSkin[] = [
  {
    id: 0,
    name: 'Default - Red Racer',
    unlocked: true,
    price: 0,
    straight: CanvasRenderer.loadNewImage('./assets/cars/car1_straight.png'),
    left: CanvasRenderer.loadNewImage('./assets/cars/car1_left.png'),
    right: CanvasRenderer.loadNewImage('./assets/cars/car1_right.png'),
  },
  {
    id: 1,
    name: 'Green Gobliner',
    unlocked: false,
    price: 30,
    straight: CanvasRenderer.loadNewImage('./assets/cars/car2_straight.png'),
    left: CanvasRenderer.loadNewImage('./assets/cars/car2_left.png'),
    right: CanvasRenderer.loadNewImage('./assets/cars/car2_right.png'),
  },
  {
    id: 2,
    name: 'Snel & Fel - 67 raket',
    unlocked: false,
    price: 67,
    straight: CanvasRenderer.loadNewImage('./assets/cars/car3_straight.png'),
    left: CanvasRenderer.loadNewImage('./assets/cars/car3_left.png'),
    right: CanvasRenderer.loadNewImage('./assets/cars/car3_right.png'),
  },
  {
    id: 3,
    name: '67 raket - DOUBLE 67!!!',
    unlocked: false,
    price: 67,
    straight: CanvasRenderer.loadNewImage('./assets/cars/car4_straight.png'),
    left: CanvasRenderer.loadNewImage('./assets/cars/car4_straight.png'),
    right: CanvasRenderer.loadNewImage('./assets/cars/car4_straight.png'),
  },
];

/**
 * What skin is selected?
 *
 * @param index number of the skin
 * @returns the skin that is selected
 */
export function getCarSkin(index: number): CarSkin {
  const skin: CarSkin | undefined = carSkins[index];
  if (skin) {
    return skin;
  }

  return carSkins[0]!;
}

/**
 * Checks if you can buy the skin
 *
 * @param index number of the skin
 * @returns true or false
 */
export function tryBuySkin(index: number): boolean {
  const skin: CarSkin | undefined = carSkins[index];

  if (!skin) {
    return false;
  }

  if (skin.unlocked) {
    return true;
  }

  if (PlayerData.getTurboTokens() < skin.price) {
    return false;
  }

  PlayerData.addTurboTokens(-skin.price);
  skin.unlocked = true;
  return true;
}

/**
 * Checks if the skin is unlocked
 *
 * @param index index of the skin
 * @returns true or false
 */
export function isSkinUnlocked(index: number): boolean {
  return carSkins[index]?.unlocked ?? false;
}

export default carSkins;
