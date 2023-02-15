class NodeSprite extends Node
{

	constructor(_texturePath)
	{
		super();

		this._texture = PIXI.Texture.EMPTY;

		if(typeof _texturePath === 'string' && _texturePath.length > 0)
			this._texture = resource.getTexture(_texturePath);

		this._sprite = new PIXI.Sprite(this._texture);
		this._sprite._node = this;
	}

	/*
		Size
	*/

	getSize()
	{
		return {
			width  : this._sprite.width,
			height : this._sprite.height
		};
	}

	/*
		Position
	*/

	getPosition()
	{
		return {
			x : this._sprite.position.x,
			y : this._sprite.position.y
		};
	}

	getPositionCenter()
	{
		return {
			x : Math.round(this._sprite.position.x + this._sprite.width / 2),
			y : Math.round(this._sprite.position.y + this._sprite.height / 2)
		};
	}

	setPosition(_x, _y)
	{
		this._sprite.position.x = Math.round(_x) || 0;
		this._sprite.position.y = Math.round(_y) || 0;
	}

	/*
		Move
	*/

	move(_x, _y)
	{
		this._sprite.position.x += Math.round(_x) || 0;
		this._sprite.position.y += Math.round(_y) || 0;
	}

	/*
		Alpha
	*/

	setAlpha(_alpha)
	{
		this._sprite.alpha = _alpha;
	}

	/*
		Flip
	*/

	setFlip(_horizontal, _vertical)
	{
		if(typeof _horizontal === 'boolean')
		{
			if(_horizontal)
			{
				this._sprite.anchor.x = 1;
				this._sprite.scale.x = -1;
			}
			else
			{
				this._sprite.anchor.x = 0;
				this._sprite.scale.x = 1;
			}
		}

		if(typeof _vertical === 'boolean')
		{
			if(_vertical)
			{
				this._sprite.anchor.y = 0;
				this._sprite.scale.y = -1;
			}
			else
			{
				this._sprite.anchor.y = 1;
				this._sprite.scale.y = 1;
			}
		}
	}

	/*
		Update
	*/

	update(_DT)
	{

	}

	/*
		Draw object
	*/

	_getDrawnObject()
	{
		return this._sprite;
	}

}
