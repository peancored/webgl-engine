import Box from 'engine/primitives/box';
import { IBoxConfig } from 'engine/primitives/box/types';
import GameObject from 'engine/utils/game-object';
import { vec3 } from 'gl-matrix';
import Material from '../../../engine/utils/material';

export default class Shape {
	velocity: vec3;
	parent: GameObject;
	b1: GameObject;
	b2: GameObject;
	b3: GameObject;
	b4: GameObject;

	constructor(size = 1) {
		this.setupStructure(size);

		this.velocity = [0, 0, 0];
	}

	setupStructure(size: number) {
		this.parent = new GameObject();

		this.b1 = new GameObject();
		this.b2 = new GameObject();
		this.b3 = new GameObject();
		this.b4 = new GameObject();
		this.b1.addMesh(
			new Box({
				size: [size, size, size],
			})
		);
		this.b2.addMesh(
			new Box({
				size: [size, size, size],
			})
		);
		this.b3.addMesh(
			new Box({
				size: [size, size, size],
			})
		);
		this.b4.addMesh(
			new Box({
				size: [size, size, size],
			})
		);

		this.b1.addMaterial(new Material());
		this.b2.addMaterial(new Material());
		this.b3.addMaterial(new Material());
		this.b4.addMaterial(new Material());

		this.b1.setParent(this.parent);
		this.b2.setParent(this.parent);
		this.b3.setParent(this.parent);
		this.b4.setParent(this.parent);

		// this.parent.addRigidBody();
	}

	setVelocity(velocity: vec3) {
		this.velocity = velocity;
	}

	move() {
		this.parent.rigidBody.addForce(this.velocity);
	}
}
