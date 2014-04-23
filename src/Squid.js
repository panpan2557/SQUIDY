var Squid = cc.Sprite.extend({
	ctor: function( map, scoreLabel ) {
		this._super();
		this.initWithFile('images/squidUp.png');
		this.setAnchorPoint( cc.p( 0, 0 ) );
		this.map = map;
		this.coinSprite = this.map.coinSprite;
		this.collidedCoinIndex = -1;
		this.scoreLabel = scoreLabel;
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
		this.squidBox = this.getBoundingBoxToWorld();
		this.nextBox = null;

		var jumpAni = new cc.Animation.create();
		jumpAni.addSpriteFrameWithFile( 'images/squidUp.png' );
		jumpAni.addSpriteFrameWithFile( 'images/squidDown.png' );
		jumpAni.setDelayPerUnit( Squid.ANIMATION_DELAY );
		this.jumpingAction = cc.Animate.create( jumpAni );

		var leftAni = new cc.Animation.create();
		leftAni.addSpriteFrameWithFile( 'images/squidLeft.png' );
		//leftAni.addSpriteFrameWithFile( 'images/squidDown.png' );
		leftAni.setDelayPerUnit( 0.5 );
		this.leftAction = cc.Animate.create( leftAni );

		var rightAni = new cc.Animation.create();
		rightAni.addSpriteFrameWithFile( 'images/squidRight.png' );
		//rightAni.addSpriteFrameWithFile( 'images/squidDown.png' );
		rightAni.setDelayPerUnit( 0.5 );
		this.rightAction = cc.Animate.create( rightAni );

		var normalAni = new cc.Animation.create();
		normalAni.addSpriteFrameWithFile( 'images/squidDown.png' );
		normalAni.setDelayPerUnit( 0.5 );
		this.normalAction = cc.Animate.create( normalAni );

	},

	update: function( dt ) {
		if ( this.started ) {
			this.squidBox =  this.getBoundingBoxToWorld();
			
			this.resetCollisionDir();
			this.collidedCoinIndex = -1;

			this.spriteIndex = Squid.INDEX_NOTCOLLIDE;
			
			this.wallCollisionUpdate();

			this.coinCollisionUpdate();	

			if ( this.isFreeFall() ) {
				this.canJump = true;
			}		

			this.normalUpdatePosition(); //normal update

			this.updatePosition();
		}
	},

	resetCollisionDir: function() {
		for ( var i = 0 ; i < this.collisionDir.length ; i++ ) {
				this.collisionDir[i] = false;
			}
	},

	wallCollisionUpdate: function() {
		for ( var i = 0 ; i < this.wallSprite.length ; i++ ) { //for each wallSprites that are in the map
			//if the squid is overlaping with some wallSprites 
			if ( this.isCollideBottom( i ) ) {
				this.collisionDir[0] = true;
				this.spriteIndex = i;
				this.vy = 0;
				//console.log("from bottom");
			} 
			if ( this.isCollideLeft( i ) ) {
				this.collisionDir[1] = true;
				this.spriteIndex = i;
				this.vx = 0;
				//console.log("from left");
			} 
			if ( this.isCollideRight( i ) ) {
				this.collisionDir[2] = true;
				this.spriteIndex = i;
				this.vx = 0;
				//console.log("from right");
			} 
			if ( this.isCollideGround( i ) ) {
				this.collisionDir[3] = true;
				this.spriteIndex = i;
				if ( this.canJump ) {
					this.vy = -this.vy;
					this.canJump = false;
				}
				if ( this.pos.y+this.vy <= cc.rectGetMaxY( this.wallSprite[ this.spriteIndex ].getBoundingBoxToWorld() ) ) {
					this.vy = 0;
				}
				//console.log("from ground");
			}
			//console.log( this.collisionDir.toString() );
		}
	},

	coinCollisionUpdate: function() {
		for ( var i = 0 ; i < this.coinSprite.length ; i++ ) {
			if ( this.collideWith( this.coinSprite[i] ) ) {
				this.map.removeCoin(i);
				this.score++;
				this.scoreLabel.setString("score : "+this.score);
			}
		}
	},

	normalUpdatePosition: function() {
		if ( this.collisionDir[3] == true /*|| this.isCollideBottom( this.spriteIndex )*/ ) { //if the colision direction is in the ground 
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
			//console.log("on ground : "+this.onGround);
			//console.log( this.onGround +", "+this.collisionDir+", "+this.spriteIndex+", "+this.vy );
			if ( this.spriteIndex == Squid.INDEX_NOTCOLLIDE || this.collisionDir[3] == true || ( this.collisionDir[1] == true && this.collisionDir[0] == false ) || ( this.collisionDir[2] == true && this.collisionDir[0] == false ) ) {
				//you can jump only when   you are free,   you are on the ground,         the collision dir is left       or                  right     
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
		if ( this.isRight ) {
			this.runAction( this.rightAction );
			if ( this.spriteIndex == Squid.INDEX_NOTCOLLIDE || this.collisionDir[2] == false ) {
				if ( this.vx < Squid.MAX_VELOCITY ) {
					this.vx += Squid.TRANSLATION_VELOCITY; 
				}
			}
		}

		if ( !this.isRight && !this.isLeft && !this.isJump ) {
			this.runAction( this.normalAction );
		}
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
					this.vx = Squid.G;
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
		return cc.rectOverlapsRect( this.squidBox, sprite.getBoundingBoxToWorld() );
	},

	jump: function() {
		this.vy = Squid.JUMPING_VELOCITY;
		this.runAction( this.jumpingAction );
	},

	start: function() {
		this.started = true;
	},

	isOverlap: function( i ) {
		if ( i == Squid.INDEX_NOTCOLLIDE ) {
			return false;
		}
		return cc.rectOverlapsRect( this.squidBox, this.wallSprite[i].getBoundingBoxToWorld() );
	},

	//collision references to a squid
	isCollideBottom: function( i ) {
		if ( i == Squid.INDEX_NOTCOLLIDE ) {
			return false;
		}
		return cc.rectContainsPoint( this.wallSprite[i].getBoundingBoxToWorld(), new cc.Point( cc.rectGetMidX( this.squidBox )+this.vx, cc.rectGetMaxY( this.squidBox )+this.vy ) );
	},

	isCollideLeft: function( i ) {
		if ( i == Squid.INDEX_NOTCOLLIDE ) {
			return false;
		}
		return cc.rectContainsPoint( this.wallSprite[i].getBoundingBoxToWorld(), new cc.Point( cc.rectGetMinX( this.squidBox )+this.vx, cc.rectGetMidY( this.squidBox )+this.vy ) );
	},

	isCollideRight: function( i ) {
		if ( i == Squid.INDEX_NOTCOLLIDE ) {
			return false;
		}
		return cc.rectContainsPoint( this.wallSprite[i].getBoundingBoxToWorld(), new cc.Point( cc.rectGetMaxX( this.squidBox )+this.vx, cc.rectGetMidY( this.squidBox )+this.vy ) );
	},

	isCollideGround: function( i ) {
		if ( i == Squid.INDEX_NOTCOLLIDE ) {
			return false;
		}
		return cc.rectContainsPoint( this.wallSprite[i].getBoundingBoxToWorld(), new cc.Point( cc.rectGetMidX( this.squidBox )+this.vx, cc.rectGetMinY( this.squidBox )+this.vy ) );
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
	}
	

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
Squid.MAX_VELOCITY = 1.7;
Squid.JUMPING_VELOCITY = 3.5;
Squid.STARTING_VELOCITY = 4;
Squid.TRANSLATION_VELOCITY = 0.3;
Squid.SIZE = 30;
Squid.ANIMATION_DELAY = 2;
Squid.MAP_BORDER = 150;
Squid.INDEX_NOTCOLLIDE = -1;