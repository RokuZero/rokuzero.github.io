const SYSTEM_WIDTH = 1280;

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

class Engine
{

	constructor()
	{
		this._camera = new Camera();

		this._application = null;
		this._container =  new PIXI.Container();
		this._texture = null;
		this._sprite = null;

		this._dt = 0;
		this._lastTime = 0;
	}

	/*
		Start
	*/

	start()
	{
		this._application = new PIXI.Application(window.innerWidth, window.innerHeight, {
			antialias       : true,
			roundPixels     : true,
			backgroundColor : 0x141415
		});

		this._texture = new PIXI.RenderTexture(
			new PIXI.BaseRenderTexture(2, 2, PIXI.SCALE_MODES.NEAREST, 1)
		);

		this._sprite = new PIXI.Sprite(this._texture);
		this._application.stage.addChild(this._sprite);
		document.body.appendChild(this._application.view);

		window.addEventListener('resize', () => {
			this._resize();
		});

		this._resize();
	}

	/*
		Get Size
	*/

	getSize()
	{
		return {
			width  : this._texture.width,
			height : this._texture.height
		};
	}

	/*
		Camera
	*/

	getCamera()
	{
		return this._camera;
	}

	/*
		DT
	*/

	getDT()
	{
		return this._dt;
	}

	/*
		Node
	*/

	addNode(_node, _zIndex = 0)
	{
		if(!(_node instanceof Node))
			return console.error('Engine.addNode error', arguments);

		let layer = this._getLayer(_zIndex);
		let object = _node._getDrawnObject();
		layer.addChild(object);
	}

	removeNode(_node)
	{
		if(!(_node instanceof Node))
			return console.error('Engine.removeNode error', arguments);

		let object = _node._getDrawnObject();

		if(object.parent !== null)
			object.parent.removeChild(object);
	}

	/*
		Run
	*/

	run(_callback = ()=>{})
	{
		let cameraPosition = this._camera.getPosition();

		this._container.position.x = -cameraPosition.x;
		this._container.position.y = -cameraPosition.y;

		requestAnimationFrame(() =>
		{
			let time = Math.round(performance.now());
			let timeDiff = time - this._lastTime;
			this._dt = timeDiff;

			if(this._dt > 20)
				this._dt = 20;

			this._application.renderer.render(this._container, this._texture);

			if(timeDiff > 0)
				this._lastTime = time;

			for(let layer of this._container.children)
			{
				for(let sprite of layer.children)
					sprite._node.update(this._dt);

				layer.children.sort(function(_a, _b) {
					return (_a._node.getPosition().y + _a._node.getSize().height)
						- (_b._node.getPosition().y + _b._node.getSize().height);
				});
			}

			_callback();
			this.run(_callback);
		});
	}

	/*
		Screen
	*/

	toFullScreen()
	{
		nw.Window.get().enterFullscreen();
	}

	leaveFullScreen()
	{
		nw.Window.get().leaveFullscreen();
	}

	isFullScreen()
	{
		return nw.Window.get().isFullscreen;
	}

	/*
		Exit
	*/

	exit()
	{
		nw.App.clearCache();
		nw.App.quit();
	}

	restart()
	{
		nw.App.clearCache();
		nw.Window.get().reloadIgnoringCache();
	}

	/*
		Layer
	*/

	_getLayer(_zIndex)
	{
		_zIndex = Math.round(_zIndex) || 0;

		for(let layer of this._container.children)
			if(layer.zIndex === _zIndex)
				return layer;

		let layer = new PIXI.Container();
		layer.zIndex = _zIndex;

		this._container.addChild(layer);

		this._container.children.sort((a, b) => {
			return a.zIndex - b.zIndex;
		});

		return layer;
	}

	/*
		Resize
	*/

	_resize()
	{
		let width = window.innerWidth;
		let height = window.innerHeight;

		let renderWidth = SYSTEM_WIDTH;
		let renderHeight = Math.round(renderWidth / (width / height));

		let ratio = Math.min(width / renderWidth, height / renderHeight);

		this._texture.resize(renderWidth, renderHeight);
		this._application.renderer.resize(width, height);
		this._sprite.scale.x = this._sprite.scale.y = ratio;

		this._camera.setViewport(renderWidth, renderHeight);

		/*console.log('resize');
		console.log('window size', width, height);
		console.log('render size', renderWidth, renderHeight);
		console.log('ratio', ratio);*/

	}

}