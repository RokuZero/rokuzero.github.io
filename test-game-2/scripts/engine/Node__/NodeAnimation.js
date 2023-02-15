class NodeAnimation extends NodeSpriteSheet
{

	constructor(_texturePath, _tileSizeX, _tileSizeY, _fps = 7)
	{
		super(_texturePath, _tileSizeX, _tileSizeY);

		this._event = {
			'end' : () => {}
		};

		this._fps = 7;

		this._isPlay = false;
		this._frames = [];
		this._frameIndex = 0;
		this._repeat = Infinity;
		this._time = 0;

		for(let i = 0; i < this._framesNumber; i++)
			this._frames.push(i);

		this.setFPS(_fps);
	}

	/*
		FPS
	*/

	setFPS(_fps)
	{
		let fps = Math.round(_fps) || 7;

		if(fps > 0)
			this._fps = fps;
	}

	/*
		Callback
	*/

	on(_name, _callback)
	{
		if(typeof this._event[_name] === 'undefined')
			return;

		this._event[_name] = _callback;
	}

	_callback(_name)
	{
		if(typeof this._event[_name] === 'undefined')
			return;

		this._event[_name]();
		this._event[_name] = () => {};
	}

	/*
		Play
	*/

	isPlay()
	{
		return this._isPlay;
	}

	play()
	{
		this._isPlay = true;
	}

	stop()
	{
		this._isPlay = false;
		this._callback('end');
	}

	reset()
	{
		this._frameIndex = 0;
		this._time = 0;
	}

	/*
		Repeat
	*/

	setRepeat(_repeat = Infinity)
	{
		_repeat = Math.round(_repeat) || Infinity;

		if(_repeat > 0 || _repeat === Infinity)
			this._repeat = _repeat;
	}

	/*
		Frames
	*/

	setFrames(_frames)
	{
		if(!Array.isArray(_frames) || _frames.length === 0)
			return;

		for(let i = 0; i < _frames.length; i++)
			_frames[i] = Math.round(_frames[i]) || 0;

		this._frames = _frames;
		this._frameIndex = _frames.length > 1 ? 1 : 0;
		this._time = 0;

		this.showFrame(
			this._frames[0]
		);
	}

	/*
		Update
	*/

	update(_DT)
	{
		if(!this._isPlay || this._frames.length <= 1)
			return;

		this._time += _DT;

		if(this._time < 1000 / this._fps)
			return;

		this._time = 0;

		this.showFrame(
			this._frames[this._frameIndex]
		);

		if(isFinite(this._repeat) && this._repeat <= 0)
		{
			this._isPlay = false;
			this._callback('end');
		}

		if(++this._frameIndex > this._frames.length - 1)
		{
			this._frameIndex = 0;

			if(this._repeat !== Infinity)
				--this._repeat;
		}
	}

}
