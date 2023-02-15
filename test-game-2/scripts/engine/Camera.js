class Camera {
	constructor() {
		this.position = {
			x : 0,
			y : 0
		};

		this.viewPort = {
			width  : 0,
			height : 0
		};
	}

	getViewport() {
		return {
			x1 : this.position.x,
			x2 : this.position.x + this.viewPort.width,
			y1 : this.position.y,
			y2 : this.position.y + this.viewPort.height
		};
	}

	setViewport(width, height) {
		this.viewPort.width = Math.round(width);
		this.viewPort.height = Math.round(height);
	}

	getPosition() {
		return {
			x : this.position.x,
			y : this.position.y
		};
	}

	setPosition(x, y) {
		this.position.x = Math.round(x);
		this.position.y = Math.round(y);
	}

	setCenter(x, y) {
		this.setPosition(x, y);
		this.position.x -= Math.round(this.viewPort.width / 2);
		this.position.y -= Math.round(this.viewPort.height / 2);
	}
}
