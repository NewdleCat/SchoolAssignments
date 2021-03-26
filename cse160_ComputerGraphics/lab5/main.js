import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/OBJLoader2.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/MTLLoader.js';
import {MtlObjBridge} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';


let scene, renderer, camera, time;
time = 0;
let totalTime = 0;
let testTexture, skyTexture, floorTexture;
let objLoader, mtlLoader;
let gui;
let AnimationState = false;

function init()
{
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		75, 
		window.innerWidth / window.innerHeight,
		0.1,
		1000,
	);

	const canvas = document.querySelector('#c');

	renderer = new THREE.WebGLRenderer({ 
		canvas,
		antialias: true,
		logarithmicDepthBuffer: true,
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	const controls = new OrbitControls(camera, renderer.domElement);

	const textureLoader = new THREE.TextureLoader();
	testTexture = new THREE.MeshPhongMaterial({map: textureLoader.load('./images/brick.jpg')});
	skyTexture = new THREE.MeshPhongMaterial({map: textureLoader.load('./images/skyImage2.jpg')});
	floorTexture = new THREE.MeshPhongMaterial({map: textureLoader.load('./images/floor.jpg')});

	objLoader = new OBJLoader2();
	mtlLoader = new MTLLoader();

	gui = new GUI();

	const cameraFolder = gui.addFolder("Camera");

	cameraFolder.add(camera, 'fov', 1, 180).onChange(updateCamera);
	const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
	cameraFolder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
	cameraFolder.add(minMaxGUIHelper, 'max', 0.1, 1000, 0.1).name('far').onChange(updateCamera);

}


let llamaList = [];
function main()
{
	init();


	var bruh = new Llama(40, 0, 0);
	bruh.render();
	llamaList.push(bruh);

	var lmao = new Llama(-4, 0, 0);
	lmao.render();
	llamaList.push(lmao);

	{
	    const near = 1;
	    const far = 300;
	    const color = 'lightblue';
	    scene.fog = new THREE.Fog(color, near, far);
	    scene.background = new THREE.Color(color);

	    const fogFolder = gui.addFolder("Fog")
	    const fogGUIHelper = new FogGUIHelper(scene.fog);
  		fogFolder.add(fogGUIHelper, 'near', near, far).listen();
  		fogFolder.add(fogGUIHelper, 'far', near, far).listen();
  	}

	// for(var i = -5; i < 5; i++)
	// {
	// 	for(var j = -5; j < 5; j++)
	// 	{
	// 		var floorPlane = createTexturedCube([20, 0.1, 20], floorTexture);
	// 		floorPlane.position.set(i * 20, -1.5, j * 20)
	// 		scene.add(floorPlane);

	// 		var boi = new Llama(i * 20, 0, j * 20);
	// 		boi.render();
	// 		llamaList.push(boi);

	// 	}
	// }

	var testCube = createTexturedCube([2, 2, 2], testTexture);
	testCube.position.set(0, 7, 0);
	scene.add(testCube);

	const geometry = new THREE.SphereGeometry( 200, 150, 32 );
	const sphere = new THREE.Mesh( geometry, skyTexture );
	sphere.geometry.scale(-1,-1,-1)
	scene.add( sphere );

	// BIG CAN
	{
		mtlLoader.load('./images/soda/Soda_Can.mtl', (mtlParseResult) => {
			const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
			const bigCanLoader = new OBJLoader2();
			bigCanLoader.addMaterials(materials)
			bigCanLoader.load('./images/soda/Soda_Can.obj', (root) => {
				root.scale.set(8, 8, 8);
				root.position.set(0, 35 ,0);

				const labelCanvas = makeLabelCanvas(200, 32, "Want a sprite cranberry?");
			  	const labelTexture = new THREE.CanvasTexture(labelCanvas);

			  	labelTexture.minFilter = THREE.LinearFilter;
			  	labelTexture.wrapS = THREE.ClampToEdgeWrapping;
			  	labelTexture.wrapT = THREE.ClampToEdgeWrapping;
			  	const labelGeometry = new THREE.PlaneBufferGeometry(1, 1);

			  	const labelMaterial = new THREE.SpriteMaterial({
			    	map: labelTexture,
			    	// side: THREE.DoubleSide,
			    	transparent: true,
			  	});

  				// const label = new THREE.Mesh(labelGeometry, labelMaterial);
  				const label = new THREE.Sprite(labelMaterial);
  				label.position.set(0,6,0)
  				label.scale.set(6,1,1)

				root.add(label)

				scene.add(root);
				// console.log(root);
			});
		});
	}
 
	// LIGHTS
	{
		const color = 0xffffff;
	    const intensity = 0.7;

	    const light = new THREE.DirectionalLight(color, intensity);
	    light.position.set(-1, 2, 4);
	    scene.add(light);

	    const ambientLight = new THREE.AmbientLight(color, intensity/2);
	    ambientLight.position.set(1, -2, -4);
	    scene.add(ambientLight);

	    const spotLight = new THREE.SpotLight(color, intensity/2);
	    spotLight.position.set(100, 1000, 100);

	    spotLight.castShadow = true;

		spotLight.shadow.mapSize.width = 1024;
		spotLight.shadow.mapSize.height = 1024;

		spotLight.shadow.camera.near = 500;
		spotLight.shadow.camera.far = 4000;
		spotLight.shadow.camera.fov = 30;

	    scene.add(spotLight);


	}

	camera.position.z = 10;

	update();
}

function toggleSpriteTime() 
{
	console.log("fuck");
}

function makeLabelCanvas(labelWidth, size, name) {
  const borderSize = 2;
  const ctx = document.createElement('canvas').getContext('2d');
  const font =  `${size}px bold sans-serif`;
  ctx.font = font;
  const textWidth = ctx.measureText(name).width;
  // measure how long the name will be
  const doubleBorderSize = borderSize * 2;
  // const width = ctx.measureText(name).width + doubleBorderSize;
  const width = labelWidth + doubleBorderSize;
  const height = size + doubleBorderSize;
  ctx.canvas.width = width;
  ctx.canvas.height = height;
 
  // need to set font again after resizing canvas
  ctx.font = font;
  // ctx.textBaseline = 'top';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, width, height);

  const scaleFactor = Math.min(1, labelWidth / textWidth);
  ctx.translate(width / 2, height / 2);
  ctx.scale(scaleFactor, 1);

  ctx.fillStyle = 'white';
  ctx.fillText(name, borderSize, borderSize);
 
  return ctx.canvas;
}

function onWindowResize()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);


function update()
{
	time += 0.001;

	for (var i = 0; i < llamaList.length; i++)
	{
		llamaList[i].updateAnimation(time);
	}

	// cubee.position.x = Math.cos(time *(speed));

	totalTime = time;

	renderer.render(scene, camera);
	requestAnimationFrame(update);
}

function createCube(sizes, color)
{
	var geometry = new THREE.BoxGeometry( sizes[0], sizes[1], sizes[2] );
	// var material = new THREE.MeshBasicMaterial( {color: color} );
	var material = new THREE.MeshPhongMaterial( {color: color} );
	var cube = new THREE.Mesh( geometry, material );

	return cube;
}

function createTexturedCube(sizes, material)
{
	var geometry = new THREE.BoxGeometry( sizes[0], sizes[1], sizes[2] );
	var cube = new THREE.Mesh( geometry, material );

	return cube;
}
function updateCamera()
{
	camera.updateProjectionMatrix();
}

class Llama
{
	constructor(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
		this.speed = 50;
		this.size = 1;
		this.bodyColor = 0xf0efed;
		this.eyeColor = 0x1c1c1c;
		this.otherColor = 0x595959;
		this.objLoader = new OBJLoader2();
		this.objLoader2 = new OBJLoader2();
		this.mtlLoader = new MTLLoader();
	}

	render()
	{
		this.hip = createCube([1.6, 1, 1.3], this.bodyColor);
		this.hip.position.set(this.x, this.y, this.z);
		this.hip.geometry.scale(this.size, this.size, this.size);
		scene.add(this.hip);

		this.torso = createCube([1.45, 2, 1.2], this.bodyColor);
		this.torso.geometry.translate(0, 1, 0);
		this.hip.add(this.torso)

		// ARMS
		{
			this.arm1 = createCube([1.6, 0.7, 0.7], this.bodyColor);
			this.arm1.position.set(0.7, 1.4, 0);
			this.arm1.geometry.translate(0.5, 0, 0);
			this.torso.add(this.arm1)

			this.arm2 = createCube([1.6, 0.7, 0.7], this.bodyColor);
			this.arm2.position.set(-0.7, 1.4, 0);
			this.arm2.geometry.translate(-0.5, 0, 0);
			this.torso.add(this.arm2);

			this.hand1 = createCube([0.9, 0.6, 0.6], this.bodyColor);
			this.hand1.position.set(1, 0, 0);
			this.hand1.geometry.translate(0.6, 0, 0);
			this.arm1.add(this.hand1);

			this.hand2 = createCube([0.9, 0.6, 0.6], this.bodyColor);
			this.hand2.position.set(-1.0, 0, 0);
			this.hand2.geometry.translate(-0.6, 0, 0);
			this.arm2.add(this.hand2);

			this.hoof1 = createCube([0.1, 0.59, 0.59], this.eyeColor);
			this.hoof1.geometry.translate(1.1, 0, 0)
			this.hand1.add(this.hoof1);

			this.hoof2 = createCube([0.1, 0.59, 0.59], this.eyeColor);
			this.hoof2.geometry.translate(-1.1, 0, 0)
			this.hand2.add(this.hoof2);

			this.can1;

			this.mtlLoader.load('./images/soda/Soda_Can.mtl', (mtlParseResult) => {
				const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
				this.objLoader.addMaterials(materials)
				this.objLoader2.addMaterials(materials)
				this.objLoader.load('./images/soda/Soda_Can.obj', (root) => {
					root.scale.set(0.2, 0.2, 0.2);
					root.position.set(1.5, 0 ,0);
					this.hoof1.add(root);
					// console.log(root);
				});
				this.objLoader2.load('./images/soda/Soda_Can.obj', (root) => {
					root.scale.set(0.2, 0.2, 0.2);
					root.position.set(-1.5, 0 ,0);
					this.hoof2.add(root);
				});

			});			
		}

		// NECK & HEAD
		{
			this.neck = createCube([0.9, 1.5, 0.9], this.bodyColor);
			this.neck.geometry.translate(0, 2.5, 0);
			this.torso.add(this.neck);

			this.head = createCube([0.8, 1.2, 0.8], this.bodyColor);
			this.head.geometry.translate(0, 3.7, 0);
			this.neck.add(this.head);

			this.mouth = createCube([0.7, 0.5, 0.6], this.bodyColor);
			this.mouth.geometry.translate(0, 3.5, 0.5)
			this.head.add(this.mouth);

			this.lips = createCube([0.75, 0.1, 0.2], this.otherColor);
			this.lips.geometry.translate(0, 3.4, 0.71)
			this.mouth.add(this.lips);

			this.nostril1 = createCube([0.15, 0.15, 0.2], this.otherColor);
			this.nostril1.geometry.translate(-0.15, 3.6, 0.71)
			this.mouth.add(this.nostril1);

			this.nostril2 = createCube([0.15, 0.15, 0.2], this.otherColor);
			this.nostril2.geometry.translate(0.15, 3.6, 0.71)
			this.mouth.add(this.nostril2);

			this.eye1 = createCube([0.2, 0.25, 0.1], this.eyeColor);
			this.eye1.geometry.translate(-0.2, 4, 0.4)
			this.head.add(this.eye1);

			this.eye2 = createCube([0.2, 0.25, 0.1], this.eyeColor);
			this.eye2.geometry.translate(0.2, 4, 0.4)
			this.head.add(this.eye2);

			this.ear1 = createCube([0.2, 0.45, 0.15], this.bodyColor);
			this.ear1.geometry.translate(0.2, 4.5, 0)
			this.head.add(this.ear1);

			this.ear2 = createCube([0.2, 0.45, 0.15], this.bodyColor);
			this.ear2.geometry.translate(-0.2, 4.5, 0)
			this.head.add(this.ear2);
		}

		// LEGS
		{
			this.leg1 = createCube([0.65, 1.5, 0.65], this.bodyColor);
			this.leg1.geometry.translate(-.45, -1, 0);
			this.leg1.geometry.scale(this.size, this.size, this.size);
			this.hip.add(this.leg1);

			this.leg2 = createCube([0.65, 1.5, 0.65], this.bodyColor);
			this.leg2.geometry.translate(.45, -1, 0);
			this.leg2.geometry.scale(this.size, this.size, this.size);
			this.hip.add(this.leg2);
		}
	}

	updateAnimation(t)
	{
		var dt = t - totalTime;

		this.hip.rotation.y += dt * this.speed/2
		// this.hip.rotation.z = Math.sin(t * this.speed)/5;
		this.torso.rotation.z = Math.sin(t * this.speed)/10;
		this.neck.rotation.z = Math.sin(t * this.speed)/20;
		this.head.rotation.z = Math.sin(t * this.speed)/60;

		this.arm1.rotation.z =  0.3 + Math.sin(t * this.speed)/1.5;
		this.arm2.rotation.z =  -0.3 + Math.sin(t * this.speed)/1.5;

		this.hand1.rotation.z = 0.3 + Math.sin(t * this.speed)/2
		this.hand2.rotation.z = -0.3 + Math.sin(t * this.speed)/2

		// this.leg1.rotation.z = Math.cos(t * this.speed)/10;
		// this.leg2.rotation.z = Math.cos(t * this.speed)/10;
		
	}
}

class MinMaxGUIHelper 
{
	constructor(obj, minProp, maxProp, minDif) 
	{
		this.obj = obj;
		this.minProp = minProp;
		this.maxProp = maxProp;
		this.minDif = minDif;
	}

	get min() 
	{
		return this.obj[this.minProp];
	}

	set min(v) 
	{
		this.obj[this.minProp] = v;
		this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
	}

	get max() 
	{
		return this.obj[this.maxProp];
	}

	set max(v)
	{
		this.obj[this.maxProp] = v;
		this.min = this.min;  // this will call the min setter
	}
}

class FogGUIHelper {
  constructor(fog, backgroundColor) {
    this.fog = fog;
    this.backgroundColor = backgroundColor;
  }
  get near() {
    return this.fog.near;
  }
  set near(v) {
    this.fog.near = v;
    this.fog.far = Math.max(this.fog.far, v);
  }
  get far() {
    return this.fog.far;
  }
  set far(v) {
    this.fog.far = v;
    this.fog.near = Math.min(this.fog.near, v);
  }
  get color() {
    return `#${this.fog.color.getHexString()}`;
  }
  set color(hexString) {
    this.fog.color.set(hexString);
    this.backgroundColor.set(hexString);
  }
}

main();


