import { mat4 } from 'gl-matrix';
import EngineGlobals from '../../../../globals';
import GameObject from '../../../utils/game-object';
import { ProjectionType, ISensor } from './types';

export default class Camera {
	gameObject: GameObject;
	sensor: ISensor;
	focalLength: number;
	projectionType: ProjectionType;
	mProjection: mat4;

	constructor(
		gameObject: GameObject,
		projectionType: ProjectionType = ProjectionType.Perspective
	) {
		this.sensor = {
			width: 36,
			height: 24,
		};
		this.gameObject = gameObject;

		this.sensor.diagonal = Math.sqrt(
			this.sensor.width ** 2 + this.sensor.height ** 2
		);
		this.focalLength = 35;

		this.projectionType = projectionType;

		this.setProjectionMatrix();
	}

	get fieldOfView() {
		return 2 * Math.atan(this.sensor.diagonal / (2 * this.focalLength));
	}

	setProjectionMatrix() {
		this.mProjection = mat4.create();
		switch (this.projectionType) {
			case ProjectionType.Ortho:
				mat4.ortho(
					this.mProjection,
					-EngineGlobals.canvas.clientWidth / 2,
					EngineGlobals.canvas.clientWidth / 2,
					-EngineGlobals.canvas.clientHeight / 2,
					EngineGlobals.canvas.clientHeight / 2,
					-10000,
					10000
				);
				break;
			default:
				mat4.perspective(
					this.mProjection,
					this.fieldOfView,
					EngineGlobals.canvas.clientWidth / EngineGlobals.canvas.clientHeight,
					1,
					undefined
				);
				break;
		}
	}
}
