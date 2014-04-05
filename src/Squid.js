var Squid = cc.Sprite.extend({
	ctor: function( map ) {
		this._super();
		this.initWithFile('images/squidUp.png');
		this.map = map;
		this.wallSprite = this.map.wallSprite;
		this.spriteIndex = Squid.INDEX_NOTCOLLIDE;
		this.collisionDir = 0;
		this.isLeft = false;
		this.isRight = false;
		this.isJump = false;
		this.resistDir = 0;
		this.vy = Squid.STARTING_VELOCITY;
		this.vx = 0;
		this.onGround = false;
		this.intersect = false;
		this.resist = Squid.TRANSLATION_VELOCITY;
		this.pos = this.getPosition();
		this.started = false;
		this.squidBox = this.getBoundingBoxToWorld();
		this.corner = new Array();

		var animation = new cc.Animation.create();
		animation.addSpriteFrameWithFile( 'images/squidUp.png' );
		animation.addSpriteFrameWithFile( 'images/squidDown.png' );
		animation.setDelayPerUnit( Squid.ANIMATION_DELAY );
		this.movingAction = cc.Animate.create( animation );

	},

	update: function( dt ) {
		if ( this.started ) {
			this.squidBox =  this.getBoundingBoxToWorld();
			this.collisionDir = 0;
			this.spriteIndex = Squid.INDEX_NOTCOLLIDE;
			for ( var i = 0 ; i < this.wallSprite.length ; i++ ) { //for each wallSprites that are in the map
				//if the squid is overlaping with some wallSprites 
				if ( this.isCollideBottom( i ) ) {
					this.collisionDir = Squid.COLLISION.BOTTOM;
					this.spriteIndex = i;
					//console.log("from bottom");
				} else if ( this.isCollideLeft( i ) ) {
					this.collisionDir = Squid.COLLISION.LEFT;
					this.spriteIndex = i;
					//console.log("from left");
				} else if ( this.isCollideRight( i ) ) {
					this.collisionDir = Squid.COLLISION.RIGHT;
					this.spriteIndex = i;
					//console.log("from right");
				} else if ( this.isCollideGround( i ) ) {
					this.collisionDir = Squid.COLLISION.GROUND;
					this.spriteIndex = i;
					//console.log("from ground");
				}
			}
			
			//console.log("("+this.vx+","+this.vy+")");
			//console.log( this.collisionDir );
			if ( this.collisionDir == Squid.COLLISION.BOTTOM ) {
				this.vy = 0;
			} else if ( this.collisionDir == Squid.COLLISION.LEFT || this.collisionDir == Squid.COLLISION.RIGHT ) {
				this.vx = 0;
			} else if ( this.collisionDir == Squid.COLLISION.GROUND ) {
				if ( this.intersect ) {
				this.vy = -this.vy;
				this.intersect = false;
				//change somthing false
				}

				if ( this.pos.y+this.vy <= cc.rectGetMaxY( this.wallSprite[ this.spriteIndex ].getBoundingBoxToWorld() ) ) {
					console.log(1);
					this.vy = 0;
				}
			}

			if ( this.spriteIndex == Squid.INDEX_NOTCOLLIDE ) {
				this.intersect = true;
			}

			//console.log( this.vy )
			this.updatePosition(); //normal update

			this.setPosition( new cc.Point( this.pos.x+this.vx, this.pos.y+this.vy ) );
		}
	},

	updatePosition: function() {
		if ( this.collisionDir == Squid.COLLISION.GROUND ) { //if the colision is 
			if ( this.vy + 20*Squid.G <= 0 ) {
				this.vy = 0;
				this.onGround = true;
			} else {
				this.vy += 20*Squid.G;
			}
		}

		if ( this.isJump ) {
			//console.log("on ground : "+this.onGround);
			if ( this.spriteIndex == Squid.INDEX_NOTCOLLIDE || this.onGround || this.collisionDir == Squid.COLLISION.LEFT || this.collisionDir == Squid.COLLISION.RIGHT ) {
				this.jump();
			}
		}

		if ( !this.onGround ) {
			this.vy += Squid.G;	
		} else {
			if ( this.isJump ) {
				this.onGround = false;
			}
		}
		
		if ( this.isLeft ) {
			if ( this.spriteIndex == Squid.INDEX_NOTCOLLIDE || this.collisionDir != Squid.COLLISION.LEFT  ) {
				if ( this.vx > -Squid.MAX_VELOCITY ) {
					this.vx -= Squid.TRANSLATION_VELOCITY;
				}
			}
		}
		if ( this.isRight ) {
			if ( this.spriteIndex == Squid.INDEX_NOTCOLLIDE || this.collisionDir != Squid.COLLISION.RIGHT ) {
				if ( this.vx < Squid.MAX_VELOCITY ) {
					this.vx += Squid.TRANSLATION_VELOCITY; 
				}
			}
		}
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


	jump: function() {
		this.vy = Squid.JUMPING_VELOCITY;
		this.runAction( this.movingAction );
	},

	start: function() {
		this.started = true;
	},

	isOverlap: function( i ) {
		return cc.rectOverlapsRect( this.squidBox, this.wallSprite[i].getBoundingBoxToWorld() );
	},


	//collision references to a squid
	isCollideBottom: function( i ) {
		return cc.rectContainsPoint( this.wallSprite[i].getBoundingBoxToWorld(), new cc.Point( cc.rectGetMidX( this.squidBox )+this.vx, cc.rectGetMaxY( this.squidBox )+this.vy ) );
	},

	isCollideLeft: function( i ) {
		return cc.rectContainsPoint( this.wallSprite[i].getBoundingBoxToWorld(), new cc.Point( cc.rectGetMinX( this.squidBox )+this.vx, cc.rectGetMidY( this.squidBox )+this.vy ) );
	},

	isCollideRight: function( i ) {
		return cc.rectContainsPoint( this.wallSprite[i].getBoundingBoxToWorld(), new cc.Point( cc.rectGetMaxX( this.squidBox )+this.vx, cc.rectGetMidY( this.squidBox )+this.vy ) );
	},

	isCollideGround: function( i ) {
		return cc.rectContainsPoint( this.wallSprite[i].getBoundingBoxToWorld(), new cc.Point( cc.rectGetMidX( this.squidBox )+this.vx, cc.rectGetMinY( this.squidBox )+this.vy ) );
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
Squid.MAX_VELOCITY = 2;
Squid.JUMPING_VELOCITY = 3.5;
Squid.STARTING_VELOCITY = 4;
Squid.TRANSLATION_VELOCITY = 0.3;
Squid.SIZE = 30;
Squid.ANIMATION_DELAY = 1.7;
Squid.MAP_BORDER = 150;
Squid.INDEX_NOTCOLLIDE = -1;