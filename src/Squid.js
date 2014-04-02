var Squid = cc.Sprite.extend({
	ctor: function( map ) {
		this._super();
		this.initWithFile('images/squidUp.png');
		this.map = map;
		this.wallSprite = this.map.wallSprite;
		this.isLeft = false;
		this.isRight = false;
		this.isJump = false;
		this.resistDir = 0;
		this.vy = Squid.STARTING_VELOCITY;
		this.vx = 0;
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
			var collision = false;
			var collisionDir = 0;
			for ( var i = 0 ; i < this.wallSprite.length ; i++ ) { //for each wallSprites that are in the map
				if ( this.isOverlap( i ) ) { //if the squid is overlaping with some wallSprites 
					console.log("Collide!");
					collsion = true;
					if ( this.isCollideBottom( i ) ) {
						collisionDir = 1;
						console.log("from bottom");
					} else if ( this.isCollideLeft( i ) ) {
						collisionDir = 2;
						console.log("from left");
					} else if ( this.isCollideRight( i ) ) {
						collisionDir = 3;
						console.log("from right");
					} else if ( this.isCollideGround( i ) ) {
						collisionDir = 4;
						console.log("from ground");
					}
					/*if ( ( this.vx > 0 || this.vx < 0 ) && ( this.vy != 0 ) ) { //DOES NOT WORK WTF !!!
						this.vx = -this.vx;
					} else if ( this.isOnGround() ) {
						// another update
					}*/
					//if ( cc.get )
				}
			}
			this.updatePosition(); //normal update
			if ( collision ) {
				if ( collisionDir == 1 ) {
					this.vy = 0;
				} else if ( collisionDir == 2 || collisionDir == 3 ) {
					this.vx = -this.vx;
				} else if ( collisionDir == 4 ) {
					this.vy = -this.vy;
				}
			}
			this.setPosition( new cc.Point( this.pos.x+this.vx, this.pos.y+this.vy ) );
		}
	},

	jump: function() {
		this.vy = Squid.JUMPING_VELOCITY;
		this.runAction( this.movingAction );
	},

	left: function() {
		this.setPosition( new cc.Point( this.pos.x-Squid.TRANSLATION_VELOCITY, this.pos.y ) );
	},

	right: function() {
		this.setPosition( new cc.Point( this.pos.x+5, this.pos.y ) );
	},

	start: function() {
		this.started = true;
	},

	updatePosition: function() {
		// this.vy += Squid.G;
		// if ( this.isJump ) {                  ** OLD COLLISION DETECTION **
		// 	this.jump();
		// }
		// if ( this.isLeft ) {
		// 	this.vx -= Squid.TRANSLATION_VELOCITY;
		// 	this.resist = -Squid.TRANSLATION_VELOCITY;
		// }
		// if ( this.isRight ) {
		// 	this.vx += Squid.TRANSLATION_VELOCITY; 
		// 	this.resist = Squid.TRANSLATION_VELOCITY;
		// }
		// if ( this.isLeft || this.isRight ) {
		// 	this.setPosition( new cc.Point( this.pos.x+this.vx, this.pos.y+this.vy ) );
		// } else {
		// 	this.setPosition( new cc.Point( this.pos.x+this.resist, this.pos.y+this.vy ) );
		// }
		// if ( this.resistDir == Squid.DIR.LEFT ) {
		// 	if ( this.resist < 0 ) {
		// 		this.resist += Squid.RESISTANCE;
		// 	} 
		// } else if ( this.resistDir == Squid.DIR.RIGHT ) {
		// 	if ( this.resist > 0 ) {
		// 		this.resist += -Squid.RESISTANCE;
		// 	} 
		// }
		// this.vx=0;
	
		this.vy += Squid.G;

		if ( this.isJump ) {
			this.jump();
		}
		if ( this.isLeft ) {
			if ( Math.abs( this.vx ) < Squid.MAX_VELOCITY ) {
				this.vx -= Squid.TRANSLATION_VELOCITY;
			}
		}
		if ( this.isRight ) {
			if ( Math.abs( this.vx ) < Squid.MAX_VELOCITY ) {
				this.vx += Squid.TRANSLATION_VELOCITY; 
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
			if ( this.vx < 0 ) {
				if ( this.vx + Squid.RESISTANCE > 0 ) {
					this.vx = 0;
				}
				else {
					this.vx += Squid.RESISTANCE;
				}
			}
		}

	},

	isCollide: function( i ) {
		return cc.rectIntersectsRect( this.squidBox, this.wallSprite[i].getBoundingBoxToWorld() );
	},

	isOverlap: function( i ) {
		return cc.rectOverlapsRect( this.squidBox, this.wallSprite[i].getBoundingBoxToWorld() );
	},

	//collision references to a squid
	isCollideBottom: function( i ) {
		return cc.rectContainsPoint( this.wallSprite[i].getBoundingBoxToWorld(), new cc.Point( cc.rectGetMidX( this.squidBox ), cc.rectGetMaxY( this.squidBox ) ) );
	},

	isCollideLeft: function( i ) {
		return cc.rectContainsPoint( this.wallSprite[i].getBoundingBoxToWorld(), new cc.Point( cc.rectGetMinX( this.squidBox ), cc.rectGetMidY( this.squidBox ) ) );
	},

	isCollideRight: function( i ) {
		return cc.rectContainsPoint( this.wallSprite[i].getBoundingBoxToWorld(), new cc.Point( cc.rectGetMaxX( this.squidBox ), cc.rectGetMidY( this.squidBox ) ) );
	},

	isCollideGround: function( i ) {
		return cc.rectContainsPoint( this.wallSprite[i].getBoundingBoxToWorld(), new cc.Point( cc.rectGetMidX( this.squidBox ), cc.rectGetMinY( this.squidBox ) ) );
	}
	

});

Squid.DIR = {
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4
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