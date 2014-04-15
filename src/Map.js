var Map = cc.Node.extend({
	ctor: function() {
		this._super();
		this.WIDTH = 30;
		this.HEIGHT = 20;
		this.MAP = [
			'##############################', //30 x 20 size: 900 x 600
			'#                            #',
			'#                            #',
			'#   ######  #                #',
			'#   ######  #                #',
			'#   #       #   *********    #',
			'#   #       #   #########    #',
			'#   #   #####                #',
			'#   #       #                #',
			'#   #       #                #',
			'#   ######  ##############   #',
			'#   #       #                #',
			'#   #       #                #',
			'#   #   #####   ##############',
			'#   #       #                #',
			'#   #       #                #',
			'#   ####    ##############   #',
			'#   ####                     #',
			'#   ####                     #',
			'##############################'
		];

		this.wallSprite = new Array();
		this.coinSprite = new Array();
		var i = 0;
		var j = 0;

		for ( var r = 0 ; r < this.HEIGHT ; r++ ) {
			for ( var c = 0 ; c < this.WIDTH ; c++ ) {
				if ( this.MAP[r][c] == "#" ) {
					this.wallSprite[i] = cc.Sprite.create( 'images/rockTile.png' );
					this.wallSprite[i].setAnchorPoint( cc.p( 0, 0 ) );
					this.wallSprite[i].setPosition( cc.p( c*30, ( this.HEIGHT - r - 1 )*30 ) );
					this.addChild( this.wallSprite[i] );
					i++;
				}
				if ( this.MAP[r][c] == "*" ) {
					this.coinSprite[j] = new Coin();
					this.coinSprite[j].setAnchorPoint( cc.p( 7.5, 7.5 ) );
					this.coinSprite[j].setPosition( cc.p( c*30 + Map.COIN_BOUNDARY_DISTANCE, ( this.HEIGHT - r - 1 )*30 + Map.COIN_BOUNDARY_DISTANCE ) );
					this.addChild( this.coinSprite[j] );
					j++;
				}
			}
		}

		this.setAnchorPoint( cc.p( 0, 0 ) );

		this.wallPosition = new Array();
		for ( var s = 0 ; s < this.wallSprite.length ; s++ ) {
			this.wallPosition[s] = this.wallSprite[s].getPosition();
			console.log(this.wallPosition[s].x+','+this.wallPosition[s].y);
		}

		this.wallBox = new Array();
		for ( var s = 0 ; s < this.wallSprite.length ; s++ ) {
			this.wallBox[s] = this.wallSprite[s].getBoundingBoxToWorld();
		}
	},
	removeCoin: function( index ){
		this.removeChild( this.coinSprite[index] );
	}
});
Map.COIN_BOUNDARY_DISTANCE = 30*4;