var Wall = cc.Sprite.extend({
	ctor: function() {
		this._super();
		this.initWithFile("images/rockTile3.png");
		this.setAnchorPoint( cc.p( 0, 0 ) );
		this.topLeftCorner = new cc.rect( 0, Wall.CORNER_SIZE, Wall.CORNER_SIZE, Wall.CORNER_SIZE );
		this.topRightCorner = new cc.rect( Wall.CORNER_SIZE, Wall.CORNER_SIZE, Wall.CORNER_SIZE, Wall.CORNER_SIZE );
		this.bottomLeftCorner = new cc.rect( 0, 0, Wall.CORNER_SIZE, Wall.CORNER_SIZE );
		this.bottomRightCorner = new cc.rect( Wall.CORNER_SIZE, 0, Wall.CORNER_SIZE, Wall.CORNER_SIZE );
	},

	cornerCheck: function( squid ) {
		console.log(1);
		if ( cc.rectOverlapsRect( this.topLeftCorner, squid.getNextBox() ) ) {
			squid.vx = 0;
			console.log(1);
		}
		if ( cc.rectOverlapsRect( this.topRightCorner, squid.getNextBox() ) ) {
			squid.vx = 0
			console.log(2);
		}
		if ( cc.rectOverlapsRect( this.bottomLeftCorner, squid.getNextBox() ) ) {
			squid.vx = 0;	
			console.log(3);
		}
		if ( cc.rectOverlapsRect( this.bottomRightCorner, squid.getNextBox() ) ) {
			squid.vx = 0;
			console.log(4);
		}
	}
});

Wall.SIZE = 30; //px
Wall.CORNER_SIZE = Wall.SIZE/2; //px