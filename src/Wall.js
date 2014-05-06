var Wall = cc.Sprite.extend({
	ctor: function() {
		this._super();
		this.initWithFile("images/rockTile3.png");
		this.setAnchorPoint( cc.p( 0, 0 ) );

		this.pos = this.getPosition();
	},

});

Wall.SIZE = 30; //px
Wall.CORNER_SIZE = Wall.SIZE/2; //px