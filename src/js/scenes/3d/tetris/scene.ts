import CollisionDetector from '../../../lib/3d/physics/collision-detector';
import Plane from '../../../lib/3d/primitives/plane';
import Color from '../../../lib/utils/color';
import Scene from '../../../lib/3d/standard/scene';
import CubeShape from './shapes/cube-shape';
import LShape from './shapes/l-shape';
import StairsShape from './shapes/stairs-shape';
import StickShape from './shapes/stick-shape';
import TShape from './shapes/t-shape';
import GameObject from '../../../lib/utils/game-object';
import Shape from './shapes';
import Script from '../../../lib/utils/script';
import { LightType } from '../../../lib/3d/standard/light/types';
import { IPlaneConfig } from '../../../lib/3d/primitives/plane/types';

export default class Tetris extends Scene {
	collisionDetector: CollisionDetector;

	shapes: any[];

	randomShape: Shape;

	constructor(config: any) {
		super({
			...config,
			cameraPosition: [0, 0, -5],
			backgroundColor: new Color('#2980b9'),
		});

		this.collisionDetector = new CollisionDetector(this.hierarchy);
		const pointLight = new GameObject();
		pointLight.addLight({
			position: [0, -1, 1],
			type: LightType.Point,
			intensity: 1,
			color: new Color('#ffffff'),
		});

		this.hierarchy.addObject(pointLight, 'pointLight');

		this.shapes = [TShape, LShape, StairsShape, StickShape, CubeShape];
		this.setup();
	}

	getRandomShape() {
		const shape = new this.shapes[
			Math.floor(Math.random() * this.shapes.length)
		](1, 0, Math.floor(Math.random() * 2));

		return shape;
	}

	setup() {
		const ground = new GameObject();
		ground.addMesh(Plane, {
			width: 500,
			length: 500,
			widthSegments: 1,
			lengthSegments: 1,
		} as IPlaneConfig);

		ground.addMaterial();

		ground.transform.translate([0, -20, 0]);

		this.hierarchy.addObject(ground, 'ground');

		this.randomShape = this.getRandomShape();
		this.randomShape.parent.transform.translate([0, 3, 0]);
		const randomShapeScript = new Script('movement');
		this.randomShape.parent.addScript(randomShapeScript);
		randomShapeScript.assign(this.randomShape.parent);

		this.hierarchy.addObject(this.randomShape.parent, 'shape');

		this.setupLight();

		document.addEventListener('keydown', (event) => {
			if (event.code === 'Space') {
				this.randomShape.parent.transform.rotate(Math.PI / 2, [0, 0, 1]);
			} else if (event.code === 'ArrowRight') {
				this.randomShape.setVelocity([100, 0, 0]);
			} else if (event.code === 'ArrowLeft') {
				this.randomShape.setVelocity([-100, 0, 0]);
			}
		});

		document.addEventListener('keyup', (event) => {
			if (event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
				this.randomShape.setVelocity([0, 0, 0]);
			}
		});
	}
}
