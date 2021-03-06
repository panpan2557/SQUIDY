var Squid = cc.Sprite.extend({
	ctor: function( map ) {
		this._super();
		this.initWithFile('images/squidUp.png');
		this.setAnchorPoint( cc.p( 0, 0 ) );
		this.map = map;

		//squid's attributes
		this.coinSprite = this.map.coinSprite;
		this.collidedCoinIndex = -1;
		this.score = 0;
		this.wallSprite = this.map.wallSprite;
		this.spriteIndex = Squid.INDEX_NOTCOLLIDE;
		this.collisionDir = [false, false, false, false]; //[bottom, left, right, ground]
		this.isLeft = false;
		this.isRight = false;
		this.isJump = false;
		this.resistDir = 0;
		this.vy = Squid.STARTING_VELOCITY;
		this.vx = 0;
		this.onGround = false;
		this.canJump = false;
		this.resist = Squid.TRANSLATION_VELOCITY;
		this.pos = this.getPosition();
		this.started = false;
		this.squidBox = this.getBoundingBox();
		this.nextBox = null;
		this.wallSpriteBox = null;
		this.initialScroll = 0;
		this.life = Squid.INITIAL_LIVES;
		this.isDead = false;

		//for collision
		this.topPoint1 = null;
		this.topPoint2 = null;
		this.leftPoint1 = null;
		this.leftpoint2 = null;
		this.rightPoint1 = null;
		this.rightPoint2 = null;
		this.bottomPoint1 = null;
		this.bottomPoint2 = null;
		this.squidMaxX = null;
		this.squidMaxY = null;
		this.squidMinX = null;
		this.squidMinY = null;

		//Animation creation
		var jumpAni = new cc.Animation.create();
		jumpAni.addSpriteFrameWithFile( 'images/squidUp.png' );
		jumpAni.addSpriteFrameWithFile( 'images/squidDown.png' );
		jumpAni.setDelayPerUnit( Squid.ANIMATION_DELAY );
		this.jumpingAction = cc.Animate.create( jumpAni );

		var leftAni = new cc.Animation.create();
		leftAni.addSpriteFrameWithFile( 'images/squidLeft.png' );
		leftAni.setDelayPerUnit( 0.5 );
		this.leftAction = cc.Animate.create( leftAni );

		var rightAni = new cc.Animation.create();
		rightAni.addSpriteFrameWithFile( 'images/squidRight.png' );
		rightAni.setDelayPerUnit( 0.5 );
		this.rightAction = cc.Animate.create( rightAni );

		var normalAni = new cc.Animation.create();
		normalAni.addSpriteFrameWithFile( 'images/squidDown.png' );
		normalAni.setDelayPerUnit( 0.5 );
		this.normalAction = cc.Animate.create( normalAni );

	},

	update: function( dt ) {
		if ( this.started ) {

			this.dieCondition();

			this.resetSquidBox();
			
			this.resetCollisionDir();
			
			this.resetAllIndex();
			
			this.wallCollisionUpdate();

			this.coinCollisionUpdate();	

			this.jumpingSwitch();		

			this.normalUpdatePosition(); //normal update

			this.updatePosition();

		}
	},

	dieCondition: function() {
		if ( this.life == 0 ) {
			this.die();
		}
	},

	resetSquidBox: function() {
		this.squidBox =  this.getBoundingBox();
	},

	resetCollisionDir: function() {
		for ( var i = 0 ; i < this.collisionDir.length ; i++ ) {
				this.collisionDir[i] = false;
			}
	},

	resetAllIndex: function() {
		this.collidedCoinIndex = -1;
		this.spriteIndex = Squid.INDEX_NOTCOLLIDE;
	},

	wallCollisionUpdate: function() {
		for ( var i = 0 ; i < this.wallSprite.length ; i++ ) { //for each wallSprites that are in the map
			//if the squid is overlaping with some wallSprite
			if ( cc.rectOverlapsRect( this.getNextBox(), this.wallSprite[i].getBoundingBox() ) ) {
				
				this.initCollisionCheckingPoint();

				if ( this.isCollideBottom( i ) ) {
					this.collisionDir[0] = true;
					this.spriteIndex = i;
					this.vy = 0;
				} 
				if ( this.isCollideLeft( i ) ) {
					this.collisionDir[1] = true;
					this.spriteIndex = i;
					this.vx = 0;
				} 
				if ( this.isCollideRight( i ) ) {
					this.collisionDir[2] = true;
					this.spriteIndex = i;
					this.vx = 0;
				} 
				if ( this.isCollideGround( i ) ) {
					this.collisionDir[3] = true;
					this.spriteIndex = i;
					if ( this.canJump ) {
						this.vy = -this.vy;
						this.canJump = false;
					}
					if ( this.pos.y+this.vy <= cc.rectGetMaxY( this.wallSprite[ this.spriteIndex ].getBoundingBox() ) ) {
						this.vy = 0;
					}
				}
			}
		}
	},

	initCollisionCheckingPoint: function() {
		//octogonal box (8)
		//  1_____2
		// 1/     \1
		// |       |
		// 2\_____/2
		//  1     2
		this.squidMaxX = cc.rectGetMaxX( this.squidBox );
		this.squidMaxY = cc.rectGetMaxY( this.squidBox );
		this.squidMinX = cc.rectGetMinX( this.squidBox );
		this.squidMinY = cc.rectGetMinY( this.squidBox );

		this.topPoint1 = new cc.Point( this.squidMinX+Squid.JUMPING_VELOCITY+this.vx, this.squidMaxY+Squid.JUMPING_VELOCITY+this.vy );
		this.topPoint2 = new cc.Point( this.squidMaxX-Squid.JUMPING_VELOCITY+this.vx, this.squidMaxY+Squid.JUMPING_VELOCITY+this.vy );
		this.leftPoint1 = new cc.Point( this.squidMinX-Squid.JUMPING_VELOCITY+this.vx, this.squidMaxY-Squid.JUMPING_VELOCITY+this.vy );
		this.leftPoint2 = new cc.Point( this.squidMinX-Squid.JUMPING_VELOCITY+this.vx, this.squidMinY+Squid.JUMPING_VELOCITY+this.vy );
		this.rightPoint1 = new cc.Point( this.squidMaxX+Squid.JUMPING_VELOCITY+this.vx, this.squidMaxY-Squid.JUMPING_VELOCITY+this.vy );
		this.rightPoint2 = new cc.Point( this.squidMaxX+Squid.JUMPING_VELOCITY+this.vx, this.squidMinY+Squid.JUMPING_VELOCITY+this.vy );
		this.bottomPoint1 = new cc.Point( this.squidMinX+Squid.JUMPING_VELOCITY+this.vx, this.squidMinY-Squid.JUMPING_VELOCITY+this.vy );
		this.bottomPoint2 = new cc.Point( this.squidMaxX-Squid.JUMPING_VELOCITY+this.vx, this.squidMinY-Squid.JUMPING_VELOCITY+this.vy );
	},

	coinCollisionUpdate: function() {
		for ( var i = 0 ; i < this.coinSprite.length ; i++ ) {
			if ( this.collideWith( this.coinSprite[i] ) ) {
				this.map.removeCoin(i);
				this.score++;
				cc.AudioEngine.getInstance().playEffect( 'sound/Coin Sound Effect.mp3' );
				this.scoreLabel.setString("score : "+this.score);
			}
		}
	},

	jumpingSwitch: function() {
		if ( this.isFreeFall() ) {
				this.canJump = true;
			}
	},

	normalUpdatePosition: function() {
		if ( this.collisionDir[3] == true ) { //if the colision direction is in the ground 
			if ( this.vy + 20*Squid.G <= 0 ) { //if next frame, the squid vy <= 0
				this.vy = 0;	// make it 0
			} else {
				this.vy += 20*Squid.G; //add the 20 times gravity to vy
			}
		}
		if ( this.collisionDir[3] == false ) { //if you are free in the map
			this.vy += Squid.G;	//you are under the gravity
		}

		this.keyPressMovingConditionUpdate();
		this.freeFallUpdate();
	},

	keyPressMovingConditionUpdate: function() {
		//Jumping
		if ( this.isJump ) { //if you press spacebar (jump)
			if ( this.jumpingCondition() ) {   
				this.jump();
			}
		}		

		//Going Left
		if ( this.isLeft ) { //if you press left
			this.runAction( this.leftAction );
			if ( this.spriteIndex == Squid.INDEX_NOTCOLLIDE || this.collisionDir[1] == false  ) {
				if ( this.vx > -Squid.MAX_VELOCITY ) {
					this.vx -= Squid.TRANSLATION_VELOCITY;
				}
			}
		}

		//Going Right
		if ( this.isRight ) { //if you press right
			this.runAction( this.rightAction );
			if ( this.spriteIndex == Squid.INDEX_NOTCOLLIDE || this.collisionDir[2] == false ) {
				if ( this.vx < Squid.MAX_VELOCITY ) {
					this.vx += Squid.TRANSLATION_VELOCITY; 
				}
			}
		}

		//if you aren't press any
		if ( !this.isRight && !this.isLeft && !this.isJump ) { 
			this.runAction( this.normalAction );
		}
	},

	jumpingCondition: function() {
		return ( this.spriteIndex == Squid.INDEX_NOTCOLLIDE || this.collisionDir[3] == true || 
			( this.collisionDir[1] == true && this.collisionDir[0] == false ) || 
			( this.collisionDir[2] == true && this.collisionDir[0] == false ) );
	},

	freeFallUpdate: function() {
		//free fall
		if ( !this.isLeft && !this.isRight ) {
			if ( this.vx > 0 ) {
				if ( this.vx - Squid.RESISTANCE < 0 ) {
					this.vx = 0;
				}
				else {
					this.vx -= Squid.RESISTANCE;
				}
			}
			else if ( this.vx < 0 ) {
				if ( this.vx + Squid.RESISTANCE > 0 ) {
					this.vx = 0;
				}
				else {
					this.vx += Squid.RESISTANCE;
				}
			}
		}
	},

	updatePosition: function() {
		this.setPosition( new cc.Point( this.pos.x+this.vx, this.pos.y+this.vy ) );
	},

	collideWith: function( sprite ) {
		return cc.rectOverlapsRect( this.squidBox, sprite.getBoundingBox() );
	},

	jump: function() {
		this.vy = Squid.JUMPING_VELOCITY;
		this.runAction( this.jumpingAction );
	},

	die: function() {
		this.vx = 0;
		this.vy = 0;
		this.unscheduleUpdate();
		var dieAction = null;
		if ( this.life <= 0 )
			dieAction = cc.MoveBy.create( 3, cc.p( 0, -700 ) );
		else
			dieAction = cc.MoveBy.create( 80, cc.p( 0, -700 ) );
		this.runAction( dieAction );
		this.isDead = true;
	},

	start: function() {
		this.started = true;
	},

	isOverlap: function( i ) {
		if ( i == Squid.INDEX_NOTCOLLIDE ) {
			return false;
		}
		return cc.rectOverlapsRect( this.squidBox, this.wallSprite[i].getBoundingBox() );
	},

	//collision references to a squid
	isCollideBottom: function( i ) {
		if ( i == Squid.INDEX_NOTCOLLIDE ) {
			return false;
		}
		if ( cc.rectContainsPoint( this.wallSprite[i].getBoundingBox(), this.topPoint1 ) || cc.rectContainsPoint( this.wallSprite[i].getBoundingBox(), this.topPoint2 ) ) {
			return true;
		}
		return false;
	},

	isCollideLeft: function( i ) {
		if ( i == Squid.INDEX_NOTCOLLIDE ) {
			return false;
		}
		if ( cc.rectContainsPoint( this.wallSprite[i].getBoundingBox(), this.leftPoint1 ) || cc.rectContainsPoint( this.wallSprite[i].getBoundingBox(), this.leftPoint2 ) ) {
			return true;
		} else if ( cc.rectContainsPoint( this.wallSprite[i].getBoundingBox(), this.leftPoint1 ) ) {
			return true;
		}
		return false;
	},

	isCollideRight: function( i ) {
		if ( i == Squid.INDEX_NOTCOLLIDE ) {
			return false;
		}
		if ( cc.rectContainsPoint( this.wallSprite[i].getBoundingBox(), this.rightPoint1 ) || cc.rectContainsPoint( this.wallSprite[i].getBoundingBox(), this.rightPoint2 ) ) {
			return true;
		} else if ( cc.rectContainsPoint( this.wallSprite[i].getBoundingBox(), this.rightPoint1 ) ) {
			return true;
		}
		return false;
	},

	isCollideGround: function( i ) {
		if ( i == Squid.INDEX_NOTCOLLIDE ) {
			return false;
		}
		if ( cc.rectContainsPoint( this.wallSprite[i].getBoundingBox(), this.bottomPoint1 ) || cc.rectContainsPoint( this.wallSprite[i].getBoundingBox(), this.bottomPoint2 ) ) {
			return true;
		}
	},

	isFreeFall: function() {
		for ( var i = 0 ; i < this.collisionDir.length ; i++ ) {
			if ( this.collisionDir[i] ) {
				return false;
			}
		}
		return true;
	},

	getNextBox: function() {
		return cc.rect( this.pos.x+this.vx, this.pos.y+this.vy, Squid.SIZE, Squid.SIZE );
	},

	getNextOctaBox: function() { // use in urchin
		this.squidMaxX = cc.rectGetMaxX( this.squidBox );
		this.squidMaxY = cc.rectGetMaxY( this.squidBox );
		this.squidMinX = cc.rectGetMinX( this.squidBox );
		this.squidMinY = cc.rectGetMinY( this.squidBox );

		var octaBox = [];

		octaBox[0] = new cc.Point( this.squidMinX+Squid.JUMPING_VELOCITY+this.vx, this.squidMaxY+Squid.JUMPING_VELOCITY+this.vy );
		octaBox[1] = new cc.Point( this.squidMaxX-Squid.JUMPING_VELOCITY+this.vx, this.squidMaxY+Squid.JUMPING_VELOCITY+this.vy );
		octaBox[2] = new cc.Point( this.squidMinX-Squid.JUMPING_VELOCITY+this.vx, this.squidMaxY-Squid.JUMPING_VELOCITY+this.vy );
		octaBox[3] = new cc.Point( this.squidMinX-Squid.JUMPING_VELOCITY+this.vx, this.squidMinY+Squid.JUMPING_VELOCITY+this.vy );
		octaBox[4] = new cc.Point( this.squidMaxX+Squid.JUMPING_VELOCITY+this.vx, this.squidMaxY-Squid.JUMPING_VELOCITY+this.vy );
		octaBox[5] = new cc.Point( this.squidMaxX+Squid.JUMPING_VELOCITY+this.vx, this.squidMinY+Squid.JUMPING_VELOCITY+this.vy );
		octaBox[6] = new cc.Point( this.squidMinX+Squid.JUMPING_VELOCITY+this.vx, this.squidMinY-Squid.JUMPING_VELOCITY+this.vy );
		octaBox[7] = new cc.Point( this.squidMaxX-Squid.JUMPING_VELOCITY+this.vx, this.squidMinY-Squid.JUMPING_VELOCITY+this.vy );

		return octaBox;
	},

	addScoreLabel: function( scoreLabel ) {
		this.scoreLabel = scoreLabel;
	},


});

Squid.DIR = {
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4
};
Squid.COLLISION = {
	BOTTOM: 1,
	LEFT: 2,
	RIGHT: 3,
	GROUND: 4
};

Squid.G = -0.1;
Squid.RESISTANCE = 0.05;
Squid.MAX_VELOCITY = 2.5;
Squid.JUMPING_VELOCITY = 3.5;
Squid.STARTING_VELOCITY = 5;
Squid.TRANSLATION_VELOCITY = 0.4;
Squid.SIZE = 30;
Squid.ANIMATION_DELAY = 2;
Squid.MAP_BORDER = 150;
Squid.INDEX_NOTCOLLIDE = -1;
Squid.INITIAL_LIVES = 3;