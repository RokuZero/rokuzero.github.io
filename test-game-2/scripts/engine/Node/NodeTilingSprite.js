class NodeTilingSprite extends Node
{

	constructor(_texturePath, _width, _height)
	{
		super();

		_width = Math.round(_width) || 0;
		_height = Math.round(_height) || 0;

		let texture = PIXI.Texture.EMPTY;

		if(typeof _texturePath === 'string' && _texturePath.length > 0)
			texture = resource.getTexture(_texturePath);

		this._tilingSprite = new PIXI.extras.TilingSprite(
			texture,
			_width,
			_height
		);

		this._tilingSprite._node = this;
	}

	/*
		Size
	*/

	getSize()
	{
		return {
			width  : this._tilingSprite.width,
			height : this._tilingSprite.height
		};
	}

	/*
		Position
	*/

	getPosition()
	{
		return {
			x : this._tilingSprite.x,
			y : this._tilingSprite.y
		};
	}

	getPositionCenter()
	{
		return {
			x : Math.round(this._tilingSprite.x + this._tilingSprite.width / 2),
			y : Math.round(this._tilingSprite.y + this._tilingSprite.height / 2)
		};
	}

	setPosition(_x, _y)
	{
		this._tilingSprite.x = Math.round(_x) || 0;
		this._tilingSprite.y = Math.round(_y) || 0;
	}

	/*
		Move
	*/

	move(_x, _y)
	{
		this._tilingSprite.position.x += Math.round(_x) || 0;
		this._tilingSprite.position.y += Math.round(_y) || 0;
	}

	/*
		Tile Position
	*/

	moveTile(_x, _y)
	{
		if(Number.isFinite(_x))
			this._tilingSprite.tilePosition.x += _x;

		if(Number.isFinite(_y))
			this._tilingSprite.tilePosition.y += _y;
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
		return this._tilingSprite;
	}

}
