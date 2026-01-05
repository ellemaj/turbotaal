import CanvasRenderer from '../CanvasRenderer.js';
import { CarSkin } from './CarSkin.js';

const CarSkins: CarSkin[] = [
  {
    id: 0,
    name: 'Default',
    unlocked: true,
    straight: CanvasRenderer.loadNewImage('../assets/cars/car1_straight.png'),
    left: CanvasRenderer.loadNewImage('../assets/cars/car1_left.png'),
    right: CanvasRenderer.loadNewImage('../assets/cars/car1_right.png'),
  },
  {
    id: 1,
    name: 'Orange Racer',
    unlocked: false,
    straight: CanvasRenderer.loadNewImage('../assets/cars/car1_straight.png'),
    left: CanvasRenderer.loadNewImage('../assets/cars/car1_left.png'),
    right: CanvasRenderer.loadNewImage('../assets/cars/car1_right.png'),
  },
  {
    id: 2,
    name: 'Red Racer',
    unlocked: false,
    straight: CanvasRenderer.loadNewImage('../assets/cars/car1_straight.png'),
    left: CanvasRenderer.loadNewImage('../assets/cars/car1_left.png'),
    right: CanvasRenderer.loadNewImage('../assets/cars/car1_right.png'),
  },
];

export function getCarSkin(index: number): CarSkin {
  const skin: CarSkin | undefined = CarSkins[index];
  if (skin) {
    return skin;
  }

  return CarSkins[0]!;
}

export default CarSkins;
