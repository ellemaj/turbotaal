import CanvasRenderer from '../CanvasRenderer.js';
import { CarSkin } from './CarSkin.js';

const CarSkins: CarSkin[] = [
  {
    id: 0,
    name: 'Default - Red Racer',
    unlocked: true,
    straight: CanvasRenderer.loadNewImage('../assets/cars/car1_straight.png'),
    left: CanvasRenderer.loadNewImage('../assets/cars/car1_left.png'),
    right: CanvasRenderer.loadNewImage('../assets/cars/car1_right.png'),
  },
  {
    id: 1,
    name: 'Green Gobliner',
    unlocked: false,
    straight: CanvasRenderer.loadNewImage('../assets/cars/car2_straight.png'),
    left: CanvasRenderer.loadNewImage('../assets/cars/car2_left.png'),
    right: CanvasRenderer.loadNewImage('../assets/cars/car2_right.png'),
  },
  {
    id: 2,
    name: 'Snel & Fel - 67 raket',
    unlocked: false,
    straight: CanvasRenderer.loadNewImage('../assets/cars/car3_straight.png'),
    left: CanvasRenderer.loadNewImage('../assets/cars/car3_left.png'),
    right: CanvasRenderer.loadNewImage('../assets/cars/car3_right.png'),
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
