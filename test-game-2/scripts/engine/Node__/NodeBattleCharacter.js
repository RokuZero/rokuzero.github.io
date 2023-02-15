const NODE_BATTLE_CHARACTER_SIZE_X = 192;
const NODE_BATTLE_CHARACTER_SIZE_Y = 192;

const NODE_BATTLE_CHARACTER_ARROW_SPRITE = 'common/cursor.png';

const NODE_BATTLE_CHARACTER_ANIMATION = {
	STAND     : 1000,
	ATTACK    : 2000,
	ATTACK2   : 3000,
	SHAKE     : 4000,
	EVADE     : 5000,
	EVADE_END : 5001,
	USE       : 6000,
	SKILL     : 7000,
	SLEEP     : 8000
};

class NodeBattleCharacter extends NodeAnimation
{

	constructor(_persona)
	{
		super(_persona.getSprite(), NODE_BATTLE_CHARACTER_SIZE_X, NODE_BATTLE_CHARACTER_SIZE_Y);

		this._persona = _persona;
		this._playingAnimayion = 0;
		this._shaking = false;
		this._isEnemy = false;
		this._isBoss = false;

		this._arrow = new NodeAnimation(NODE_BATTLE_CHARACTER_ARROW_SPRITE, 60, 60);
		this._arrow.setPosition(66, 6);
		this._arrow.setFPS(7 * Game.getBattleSpeed());
		this._arrow.play();

		this.playAnimation(NODE_BATTLE_CHARACTER_ANIMATION.STAND);
	}

	/*
		Persona
	*/

	getPersona()
	{
		return this._persona;
	}

	/*
		Is Enemy
	*/

	isEnemy()
	{
		return this._isEnemy;
	}

	setEnemy(_isEnemy)
	{
		this._isEnemy = Boolean(_isEnemy);
	}

	/*
		Is Boss
	*/

	isBoss()
	{
		return this._isBoss;
	}

	setBoss(_isBoss)
	{
		if(typeof _isBoss === 'boolean')
			this._isBoss = _isBoss;
	}

	/*
		Animation
	*/

	getPlayAnimation()
	{
		return this._playingAnimayion;
	}

	playAnimation(_animationName)
	{
		this._playingAnimayion = _animationName;
		switch(this._playingAnimayion)
		{
			case NODE_BATTLE_CHARACTER_ANIMATION.STAND:
			{
				this.setFrames([0, 1]);
				this.setRepeat();
				this.setFPS(3 * Game.getBattleSpeed());
				this.play();
			} break;

			case NODE_BATTLE_CHARACTER_ANIMATION.ATTACK:
			{
				this.setFrames([6, 7, 8]);
				this.setRepeat(1);
				this.setFPS(5 * Game.getBattleSpeed());
				this.play();
			} break;

			case NODE_BATTLE_CHARACTER_ANIMATION.ATTACK2:
			{
				this.setFrames([9, 10, 11]);
				this.setRepeat(1);
				this.setFPS(5 * Game.getBattleSpeed());
				this.play();
			} break;

			case NODE_BATTLE_CHARACTER_ANIMATION.SHAKE:
			{

				if(this._shaking)
					return;

				this._shaking = true;
				this.playAnimation(NODE_BATTLE_CHARACTER_ANIMATION.STAND);

				let startPosition = this.getPosition();
				let quantity = 4;
				let speed = -8;

				let loop = () =>
				{
					let position = this.getPosition();

					speed = speed === -8 ? 8 : -8;
					quantity--;

					if(quantity < 0)
					{
						this._shaking = false;
						this.setPosition(startPosition.x, startPosition.y);
						return;
					}

					position.x += speed;
					this.setPosition(position.x, position.y);

					setTimeout(loop, 70);
				};

				loop();

			} break;

			case NODE_BATTLE_CHARACTER_ANIMATION.EVADE:
			{
				this.setFrames([12, 13]);
				this.setRepeat(1);
				this.setFPS(3 * Game.getBattleSpeed());
				this.play();
				this.on('end', () => {
					if(this.getPlayAnimation() === NODE_BATTLE_CHARACTER_ANIMATION.EVADE)
						this.playAnimation(NODE_BATTLE_CHARACTER_ANIMATION.STAND);
				});
			} break;

			case NODE_BATTLE_CHARACTER_ANIMATION.EVADE_END:
			{
				this.setFrames([12, 13]);
				this.setRepeat(1);
				this.setFPS(3 * Game.getBattleSpeed());
				this.play();
			} break;

			case NODE_BATTLE_CHARACTER_ANIMATION.USE:
			{
				this.setFrames([2, 3, 2, 3, 2]);
				this.setRepeat(1);
				this.setFPS(3 * Game.getBattleSpeed());
				this.play();
			} break;

			case NODE_BATTLE_CHARACTER_ANIMATION.SKILL:
			{
				this.setFrames([4, 5, 4, 5, 4]);
				this.setRepeat(1);
				this.setFPS(3 * Game.getBattleSpeed());
				this.play();
			} break;

			case NODE_BATTLE_CHARACTER_ANIMATION.SLEEP:
			{
				this.setFrames([16, 17, 16, 17, 16]);
				this.setRepeat(1);
				this.setFPS(3 * Game.getBattleSpeed());
				this.play();
			} break;
		}
	}

	/*
		Show Arrow
	*/

	isEnableArrow()
	{
		let sprite = this._arrow._getDrawnObject();
		return sprite.parent !== null;
	}

	enableArrow(_enable = true)
	{
		if(_enable === this.isEnableArrow())
			return;

		let sprite = this._arrow._getDrawnObject();

		if(_enable)
		{
			this._sprite.addChild(sprite);
			return;
		}

		sprite.parent.removeChild(sprite);
		this._arrow.reset();
	}

	/*
		Pop Up Message
	*/

	popUpMessage(_text, _icon = '', _x = 0)
	{
		let position = this.getPosition();
		let size = this.getSize();
		position.x += Math.round(size.width / 2) + _x;
		position.y += 30;
		ui.popUpText(position.x, position.y, _text, _icon);
	}

	/*
		Disappear
	*/

	disappear()
	{
		let counter = 4;
		let sprite = this._getDrawnObject();
		let parent = sprite.parent;

		let loop = () =>
		{
			if(sprite.parent !== null)
			{
				parent.removeChild(sprite);

				if(counter <= 0)
					return;
			}
			else
			{
				parent.addChild(sprite);
				counter--;
			}

			setTimeout(loop, 140);
		};

		loop();
	}

	/*
		Update
	*/

	update(_DT)
	{
		super.update(_DT);

		for(let sprite of this._sprite.children)
			sprite._node.update(_DT);
	}

}
