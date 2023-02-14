PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const RENDER_WIDTH = 512;
const RENDER_HEIGHT = 528;

let application = false;
let texture = false;
let sprite = false;
let container =  new PIXI.Container();
let loader = new PIXI.Loader();
let sprites = {};
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

texture = new PIXI.BaseRenderTexture(0, 0, PIXI.SCALE_MODES.NEAREST, 1);
texture = new PIXI.RenderTexture(texture);

sprite = new PIXI.Sprite(texture);
application.stage.addChild(sprite);

document.body.appendChild(application.view);

document.addEventListener('keydown', control);
document.addEventListener('keyup', control);

window.addEventListener('resize', resize);
resize();

// load resources

loader.add('car', 'assets/car.png')
.add('road', 'assets/road.png')
.add('road_lines', 'assets/road_lines.png')
.add('town', 'assets/town.png')
.add('clouds', 'assets/clouds.png');

loader.load((loader, resources) => {
	sprites.car = new PIXI.Sprite(resources.car.texture);
	sprites.road = new PIXI.Sprite(resources.road.texture);
	sprites.roadLineLeft = new PIXI.TilingSprite(resources.road_lines.texture, 4, 453);
	sprites.roadLineCenter = new PIXI.TilingSprite(resources.road_lines.texture, 4, 453);
	sprites.roadLineRight = new PIXI.TilingSprite(resources.road_lines.texture, 4, 453);
	sprites.town = new PIXI.Sprite(resources.town.texture);
	sprites.clouds = new PIXI.TilingSprite(resources.clouds.texture, 512, 34);

	start();
});

// resize

function resize() {
	let windowWidth = window.innerWidth;
	let windowHeight = window.innerHeight;

	let ratio = Math.min(windowWidth / RENDER_WIDTH, windowHeight / RENDER_HEIGHT);

	let newRenderWidth = RENDER_WIDTH * ratio;
	let newRenderHeight = RENDER_HEIGHT * ratio;

	texture.resize(RENDER_WIDTH, RENDER_HEIGHT);
	application.renderer.resize(newRenderWidth, newRenderHeight);
	sprite.scale.x = sprite.scale.y = ratio;
}

// start

function start() {
	container.addChild(sprites.town);
	container.addChild(sprites.clouds);
	container.addChild(sprites.road);
	container.addChild(sprites.roadLineLeft);
	container.addChild(sprites.roadLineCenter);
	container.addChild(sprites.roadLineRight);
	container.addChild(sprites.car);

	sprites.town.position.y = 25;
	sprites.road.position.y = 73;

	sprites.roadLineLeft.position.x = 182;
	sprites.roadLineLeft.position.y = 70;
	sprites.roadLineLeft.rotation = 0.05;

	sprites.roadLineCenter.position.x = 255;
	sprites.roadLineCenter.position.y = 70;

	sprites.roadLineRight.position.x = 322;
	sprites.roadLineRight.position.y = 70;
	sprites.roadLineRight.rotation = -0.05;

	sprites.car.position.x = RENDER_WIDTH / 2 - 44 / 2 ;
	sprites.car.position.y = 430;

	application.ticker.add(loop);
}

// loop

function loop(delta) {
	application.renderer.render(container, texture);
	sprites.clouds.tilePosition.x += 0.5 * delta;
	sprites.roadLineLeft.tilePosition.y += 1 * delta;
	sprites.roadLineCenter.tilePosition.y += 1 * delta;
	sprites.roadLineRight.tilePosition.y += 1 * delta;

	if(keyboard.left === true) {
		if(sprites.car.position.x > 130) {
			sprites.car.position.x -= 4 * delta;
		}
	}

	if(keyboard.right === true) {
		if(sprites.car.position.x < 336) {
			sprites.car.position.x += 4 * delta;
		}
	}
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
