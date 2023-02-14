PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const RENDER_WIDTH = 512;
const RENDER_HEIGHT = 528;

let application = false;
let texture = false;
let sprite = false;
let container =  new PIXI.Container();
let loader = new PIXI.Loader();
let nodes = {};
let timePassed = 0;
let score = 0;
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
	  .add('clouds', 'assets/clouds.png')
	  .add('hole', 'assets/hole.png')
	  .add('barrier', 'assets/barrier.png')
	  .load(prepare)

// prepare

function prepare() {
	nodes.town = new PIXI.Sprite(loader.resources.town.texture);
	nodes.clouds = new PIXI.TilingSprite(loader.resources.clouds.texture, 512, 34);
	nodes.road = new PIXI.Sprite(loader.resources.road.texture);
	nodes.roadLines = new PIXI.TilingSprite(loader.resources.road_lines.texture, 142, 452);
	nodes.car = new PIXI.Sprite(loader.resources.car.texture);

	container.addChild(nodes.town);
	container.addChild(nodes.clouds);
	container.addChild(nodes.road);
	container.addChild(nodes.roadLines);
	container.addChild(nodes.car);

	nodes.barriers = [];
	nodes.holes = [];

	start();
}

// start

function start() {
	nodes.town.position.y = 25;
	nodes.road.position.y = 73;

	nodes.roadLines.position.x = 185;
	nodes.roadLines.position.y = 70;

	nodes.car.position.x = RENDER_WIDTH / 2 - 44 / 2 ;
	nodes.car.position.y = 430;

	application.ticker.add(loop);
}

// loop

function loop(delta) {
	timePassed += delta  / 60;

	nodes.clouds.tilePosition.x += 0.5 * delta;
	nodes.roadLines.tilePosition.y += 1 * delta;

	if(keyboard.left === true) {
		if(nodes.car.position.x > 130) {
			nodes.car.position.x -= 4 * delta;
		}
	}

	if(keyboard.right === true) {
		if(nodes.car.position.x < 336) {
			nodes.car.position.x += 4 * delta;
		}
	}

	if(timePassed / 10 > nodes.barriers.length && nodes.barriers.length < 2) {
		let barrier = new PIXI.Sprite(loader.resources.barrier.texture);
		barrier.position.y = 70;
		barrier.position.x = getRandomPositionX();
		nodes.barriers.push(barrier)
		container.addChild(barrier);
	}

	if(timePassed / 15 > nodes.holes.length + 1 && nodes.holes.length < 2) {
		let hole = new PIXI.Sprite(loader.resources.hole.texture);
		hole.position.y = 70;
		hole.position.x = getRandomPositionX();
		nodes.holes.push(hole)
		container.addChild(hole);
	}

	for(let barrier of nodes.barriers) {
		barrier.position.y += 1 * delta;
		if(barrier.position.y > 600) {
			barrier.position.y = 70
			barrier.position.x = getRandomPositionX();
		}
	}

	for(let hole of nodes.holes) {
		hole.position.y += 1 * delta;
		if(hole.position.y > 600) {
			hole.position.y = 70
			hole.position.x = getRandomPositionX();
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

// random position

function getRandomPositionX() {
	let position = [159, 227, 295];
	let index = Math.random() * position.length;
	index = Math.floor(index);
	return position[index];
}
