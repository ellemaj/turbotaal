import CanvasRenderer from '../CanvasRenderer.js';
import PlayerData from './PlayerData.js';
import { CarSkin } from './CarSkin.js';

const carSkins: CarSkin[] = [
  {
    id: 0,
    name: 'Default - Red Racer',
    unlocked: true,
    price: 0,
    straight: CanvasRenderer.loadNewImage('../assets/cars/car1_straight.png'),
    left: CanvasRenderer.loadNewImage('../assets/cars/car1_left.png'),
    right: CanvasRenderer.loadNewImage('../assets/cars/car1_right.png'),
  },
  {
    id: 1,
    name: 'Green Gobliner',
    unlocked: false,
    price: 10,
    straight: CanvasRenderer.loadNewImage('../assets/cars/car2_straight.png'),
    left: CanvasRenderer.loadNewImage('../assets/cars/car2_left.png'),
    right: CanvasRenderer.loadNewImage('../assets/cars/car2_right.png'),
  },
  {
    id: 2,
    name: 'Snel & Fel - 67 raket',
    unlocked: false,
    price: 67,
    straight: CanvasRenderer.loadNewImage('../assets/cars/car3_straight.png'),
    left: CanvasRenderer.loadNewImage('../assets/cars/car3_left.png'),
    right: CanvasRenderer.loadNewImage('../assets/cars/car3_right.png'),
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

export function tryBuySkin(index: number): boolean {
  const skin: CarSkin = getCarSkin(index);

  if (skin.unlocked) {
    return true;
  }

  if (PlayerData.getCoins() >= skin.price) {
    PlayerData.addCoins(-skin.price);
    skin.unlocked = true;
    return true;
  }

  return false;
}

export default carSkins;
