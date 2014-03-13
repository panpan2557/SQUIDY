var Squid = cc.Sprite.extend({
	ctor: function() {
		this._super();
		this.initWithFile('images/ball.png');
		this.isLeft = false;
		this.isRight = false;
		this.isJump = false;
		this.resistDir = 0;
		this.vy = Squid.STARTING_VELOCITY;
		this.vx = 0;
		this.resist = Squid.TRANSLATION_VELOCITY;
		this.pos = this.getPosition();
	},
	update: function( dt ) {
		this.vy += Squid.G;
		if ( this.isJump ) {
			this.jump();
		}
		if ( this.isLeft ) {
			this.vx -= Squid.TRANSLATION_VELOCITY;
			this.resist = -Squid.TRANSLATION_VELOCITY;
		}
		if ( this.isRight ) {
			this.vx += Squid.TRANSLATION_VELOCITY; 
			this.resist = Squid.TRANSLATION_VELOCITY;
		}
		if ( this.isLeft || this.isRight ) {
			this.setPosition( new cc.Point( this.pos.x+this.vx, this.pos.y+this.vy ) );
		} else {
			this.setPosition( new cc.Point( this.pos.x+this.resist, this.pos.y+this.vy ) );
		}
		if ( this.resistDir == Squid.DIR.LEFT ) {
			if ( this.resist < 0 ) {
				this.resist += Squid.RESISTANCE;
			} 
		} else if ( this.resistDir == Squid.DIR.RIGHT ) {
			if ( this.resist > 0 ) {
				this.resist += -Squid.RESISTANCE;
			} 
		}
		this.vx=0;
	},
	jump: function() {
		this.vy = Squid.JUMPING_VELOCITY;
	},
	left: function() {
		this.setPosition( new cc.Point( this.pos.x-5, this.pos.y ) );
	},
	right: function() {
		this.setPosition( new cc.Point( this.pos.x+5, this.pos.y ) );
	}
});

Squid.DIR = {
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4
};

Squid.G = -0.8;
Squid.RESISTANCE = 0.05;
Squid.JUMPING_VELOCITY = 8;
Squid.STARTING_VELOCITY = 5;
Squid.TRANSLATION_VELOCITY = 5;