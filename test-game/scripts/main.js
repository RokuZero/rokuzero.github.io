PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const RENDER_WIDTH = 512;
const RENDER_HEIGHT = 528;

let application = false;
let texture = false;
let sprite = false;
let container =  new PIXI.Container();
let loader = new PIXI.Loader();
let objects = {};
let keyboard = {
	left : false,
	right : false
};

// create viewport

application = new PIXI.Application({
	width : 0,
	height : 0,
	antialias : true,
	roundPixels : true,
	backgroundColor : 0xF4F4F2
});

texture = new PIXI.BaseRenderTexture(RENDER_WIDTH, RENDER_HEIGHT, PIXI.SCALE_MODES.NEAREST, 1);
texture = new PIXI.RenderTexture(texture);

sprite = new PIXI.Sprite(texture);
application.stage.addChild(sprite);

document.body.appendChild(application.view);

document.addEventListener('keydown', control);
document.addEventListener('keyup', control);

window.addEventListener('resize', resize);
resize();

// resize

function resize() {
	let windowWidth = window.innerWidth;
	let windowHeight = window.innerHeight;

	let ratio = Math.min(windowWidth / RENDER_WIDTH, windowHeight / RENDER_HEIGHT);

	let newRenderWidth = RENDER_WIDTH * ratio;
	let newRenderHeight = RENDER_HEIGHT * ratio;

	application.renderer.resize(newRenderWidth, newRenderHeight);
	sprite.scale.x = sprite.scale.y = ratio;
}

// load resources

loader.add('car', 'assets/car.png')
	  .add('road', 'assets/road.png')
	  .add('road_lines', 'assets/road_lines.png')
	  .add('town', 'assets/town.png')
	  .add('clouds', 'assets/clouds.png');

loader.load((loader, resources) => {
	objects.car = new PIXI.Sprite(resources.car.texture);
	objects.road = new PIXI.Sprite(resources.road.texture);
	objects.roadLineLeft = new PIXI.TilingSprite(resources.road_lines.texture, 4, 453);
	objects.roadLineCenter = new PIXI.TilingSprite(resources.road_lines.texture, 4, 453);
	objects.roadLineRight = new PIXI.TilingSprite(resources.road_lines.texture, 4, 453);
	objects.town = new PIXI.Sprite(resources.town.texture);
	objects.clouds = new PIXI.TilingSprite(resources.clouds.texture, 512, 34);

	start();
});

// start

function start() {
	container.addChild(objects.town);
	container.addChild(objects.clouds);
	container.addChild(objects.road);
	container.addChild(objects.roadLineLeft);
	container.addChild(objects.roadLineCenter);
	container.addChild(objects.roadLineRight);
	container.addChild(objects.car);

	objects.town.position.y = 25;
	objects.road.position.y = 73;

	objects.roadLineLeft.position.x = 182;
	objects.roadLineCenter.position.x = 255;
	objects.roadLineRight.position.x = 322;

	objects.roadLineLeft.position.y = 70;
	objects.roadLineCenter.position.y = 70;
	objects.roadLineRight.position.y = 70;

	objects.roadLineLeft.rotation = 0.05;
	objects.roadLineRight.rotation = -0.05;

	objects.car.position.x = RENDER_WIDTH / 2 - 44 / 2 ;
	objects.car.position.y = 430;

	application.ticker.add(loop);
}

// loop

function loop(delta) {
	objects.clouds.tilePosition.x += 0.5 * delta;
	objects.roadLineLeft.tilePosition.y += 1 * delta;
	objects.roadLineCenter.tilePosition.y += 1 * delta;
	objects.roadLineRight.tilePosition.y += 1 * delta;

	if(keyboard.left === true) {
		if(objects.car.position.x > 130) {
			objects.car.position.x -= 4 * delta;
		}
	}

	if(keyboard.right === true) {
		if(objects.car.position.x < 336) {
			objects.car.position.x += 4 * delta;
		}
	}

	application.renderer.render(container, texture);
}

// control

function control(key) {
	let type = key.type;
	let code = key.keyCode;

	if(code === 65) {
		keyboard.left = type === 'keyup' ? false : true;
	}

	if(code === 68) {
		keyboard.right = type === 'keyup' ? false : true;
	}
}
