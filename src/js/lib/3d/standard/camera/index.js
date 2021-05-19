import { vec3 } from 'gl-matrix';
import Transform from '../transform';

export default class Camera {
	constructor(gl, movementSpeed, initialPosition = [0, 0, 0]) {
		this.gl = gl;

		this.sensor = {
			width: 36,
			height: 24,
		};
		this.sensor.diagonal = Math.sqrt(
			this.sensor.width ** 2 + this.sensor.height ** 2
		);
		this.focalLength = 35;
		this.zoomStep = 5;

		this.transform = new Transform();

		this.speed = movementSpeed;
		this.isMoving = false;
		this.direction = vec3.create();

		this.transform.translate([
			initialPosition[0],
			initialPosition[1],
			-initialPosition[2],
		]);
	}

	get fieldOfView() {
		return 2 * Math.atan(this.sensor.diagonal / (2 * this.focalLength));
	}

	zoom(direction) {
		if (this.focalLength + direction * this.zoomStep > 1 || direction > 0) {
			this.focalLength += direction * this.zoomStep;
		}
	}

	setMoving(direction) {
		this.direction = direction;
		this.isMoving = true;
	}

	stop() {
		this.direction = vec3.create();
		this.isMoving = false;
	}

	update() {
		if (this.isMoving) {
			this.transform.translate(
				vec3.scale(
					vec3.create(),
					vec3.normalize(
						vec3.create(),
						vec3.transformMat4(
							vec3.create(),
							this.direction,
							this.transform.mRotation
						)
					),
					this.speed
				)
			);
		}
	}
}
