class NodeSpriteSheet extends NodeSprite
{

	constructor(_texturePath, _tileSizeX = 64, _tileSizeY = 64)
	{
		super(_texturePath);

		_tileSizeX = Math.round(_tileSizeX) || 64;
		_tileSizeY = Math.round(_tileSizeY) || 64;

		this._tileSize = {
			x : _tileSizeX,
			y : _tileSizeY
		};

		this._columnsNumber = Math.floor(this._texture.baseTexture.realWidth / this._tileSize.x);
		this._rowsNumber = Math.floor(this._texture.baseTexture.realHeight / this._tileSize.y);
		this._framesNumber = this._columnsNumber * this._rowsNumber;

		this._showFrame = 0;
		this.showFrame(0);
	}

	/*
		Frame
	*/

	showFrame(_frame)
	{
		_frame = Math.round(_frame);

		let col = Math.floor(_frame % this._columnsNumber);
		let row = Math.floor(_frame / this._columnsNumber);
		let x = col * this._tileSize.x;
		let y = row * this._tileSize.y;

		if(_frame < 0 || row > this._rowsNumber - 1)
			return console.error('NodeSpriteSheet.showFrame error');

		this._showFrame = _frame;

		this._texture.setFrame(
			new PIXI.Rectangle(x, y, this._tileSize.x, this._tileSize.y)
		);
	}

	getShowFrame()
	{
		return this._showFrame;
	}

}
