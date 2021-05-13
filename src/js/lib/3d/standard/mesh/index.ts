import { mat4, vec3 } from 'gl-matrix';
import GameObject from '../../../utils/game-object';
import Material from '../../../utils/material';
import VAO from '../../../utils/vao';
import DirectionalLight from '../light/directional';
import PointLight from '../light/point';
import DefaultMaterial3D from '../materials/default';
import { MeshConfig } from './types';

export default class Mesh {
	gl: WebGL2RenderingContext;
	attribLocations: {
		[key: string]: number;
	};

	materials: {
		[key: string]: any;
	};

	vao: VAO;
	gameObject: GameObject;
	texture: WebGLTexture;

	constructor(
		gl: WebGL2RenderingContext,
		gameObject: GameObject,
		{
			enableLighting = true,
			enableSpecular = false,
			specularStrength = 80,
			shadeColor,
		}: MeshConfig
	) {
		/** @type {WebGL2RenderingContext} */
		this.gl = gl;

		this.attribLocations = {
			aPosition: 0,
			aNormal: 1,
			aTextureCoord: 2,
		};

		this.materials = {
			default: new DefaultMaterial3D(this.gl, this.attribLocations, {
				enableLighting,
				enableSpecular,
				specularStrength,
				shadeColor,
			}),
		};
		this.vao = new VAO(this.gl, this.attribLocations);
		this.gameObject = gameObject;

		this.setupAttributes();
	}

	setupAttributes() {
		this.vao.setAttribute('aPosition', 3, this.gl.FLOAT);
		this.vao.setAttribute('aNormal', 3, this.gl.FLOAT);
		this.vao.setAttribute('aTextureCoord', 2, this.gl.FLOAT);
	}

	setPositions(positions: number[]) {
		this.vao.setBufferData('aPosition', positions);
	}

	setNormals(normals: number[]) {
		this.vao.setBufferData('aNormal', normals);
	}

	setTextureCoords(textureCoords: number[]) {
		this.vao.setBufferData('aTextureCoord', textureCoords);
	}

	setupColor(color: number[]) {
		this.texture = this.gl.createTexture();
		this.gl.activeTexture(this.gl.TEXTURE0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

		const level = 0;
		const width = 1;
		const height = 1;
		const border = 0;
		const format = this.gl.RGBA;
		const type = this.gl.UNSIGNED_BYTE;
		const data = new Uint8Array(color);
		this.gl.texImage2D(
			this.gl.TEXTURE_2D,
			level,
			format,
			width,
			height,
			border,
			format,
			type,
			data
		);

		this.gl.texParameteri(
			this.gl.TEXTURE_2D,
			this.gl.TEXTURE_MIN_FILTER,
			this.gl.NEAREST
		);
		this.gl.texParameteri(
			this.gl.TEXTURE_2D,
			this.gl.TEXTURE_MAG_FILTER,
			this.gl.NEAREST
		);
		this.gl.texParameteri(
			this.gl.TEXTURE_2D,
			this.gl.TEXTURE_WRAP_S,
			this.gl.CLAMP_TO_EDGE
		);
		this.gl.texParameteri(
			this.gl.TEXTURE_2D,
			this.gl.TEXTURE_WRAP_T,
			this.gl.CLAMP_TO_EDGE
		);

		this.materials.default.setTexture(0);
	}

	setupDirectionalLight(lightSources: DirectionalLight[]) {
		this.materials.default.setDirectionalLights(lightSources);
	}

	setupPointLight(lightSources: PointLight[]) {
		this.materials.default.setPointLights(lightSources);
	}

	updateMatrix(mProjection: mat4, viewWorldPosition: vec3, pov: mat4) {
		const world = this.updateWorldMatrix(viewWorldPosition);

		const worldViewProjection = this.gameObject.transform.getWorldViewProjection(
			world,
			mProjection,
			pov
		);

		this.materials.default.setWorldViewProjection(worldViewProjection);

		return worldViewProjection;
	}

	updateWorldMatrix(viewWorldPosition: vec3) {
		const world = this.gameObject.transform.getWorld();

		const worldInverseTranspose = mat4.create();

		mat4.transpose(
			worldInverseTranspose,
			mat4.invert(worldInverseTranspose, world)
		);

		this.materials.default.setWorld(world);
		this.materials.default.setWorldInverseTranspose(worldInverseTranspose);
		this.materials.default.setViewWorldPosition(viewWorldPosition);

		return world;
	}

	draw(mProjection: mat4, viewWorldPosition: vec3, pov: mat4) {
		this.vao.bind();
		this.gl.activeTexture(this.gl.TEXTURE0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

		this.updateMatrix(mProjection, viewWorldPosition, pov);
	}
}
