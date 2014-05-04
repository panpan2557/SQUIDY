var Map = cc.Node.extend({
	ctor: function( gameLayer ) {
		this._super();
		// this.setPosition( cc.p( 0, 150 ) );
		this.gameLayer = gameLayer;

		this.WIDTH = 30;
		this.HEIGHT = 20;
		this.MAP = [
			'#ccc##########################', //30 x 20 size: 900 x 600
			'#                            #',
			'#   ******          *****    #',
			'#   ######  #                #',
			'#   ######  #                #',
			'#   #       #   *********    #',
			'#   #   ****#   #########    #',
			'#   #   #####                #',
			'#   #       #                #',
			'#   #*****  #*************   #',
			'#   ######  ##############   #',
			'#   #       #                #',
			'#   #   ****#   *************#',
			'#   #   #####   ##############',
			'#   #       #                #',
			'#   #***    #*************   #',
			'#   ####    ##############   #',
			'#   ####                     #',
			'#   ####*********************#',
			'##############################'
		];

		this.wallSprite = new Array();
		this.coinSprite = new Array();
		this.checkPoint = new Array();
		var i = 0;
		var j = 0;
		var k = 0;

		for ( var r = 0 ; r < this.HEIGHT ; r++ ) {
			for ( var c = 0 ; c < this.WIDTH ; c++ ) {
				if ( this.MAP[r][c] == "#" ) {
					this.wallSprite[i] = new Wall();
					this.wallSprite[i].setPosition( cc.p( c*30, ( this.HEIGHT - r - 1 )*30+150 ) );
					this.addChild( this.wallSprite[i] );
					i++;
				}
				if ( this.MAP[r][c] == "*" ) {
					this.coinSprite[j] = new Coin();
					this.coinSprite[j].setAnchorPoint( cc.p( 0, 0 ) );
					this.coinSprite[j].setPosition( cc.p( c*30+10, ( this.HEIGHT - r - 1 )*30+10+150 ) );
					this.addChild( this.coinSprite[j] );
					j++;
				}
				if ( this.MAP[r][c] == "c" ) {
					this.checkPoint[k] = new CheckPoint( this.gameLayer, this );
					this.checkPoint[k].setPosition( cc.p( c*30, ( this.HEIGHT - r - 1 )*30+150 ) );
					this.addChild( this.checkPoint[k] );
					k++;
				}
			}
		}

		this.setAnchorPoint( cc.p( 0, 0 ) );

		this.wallPosition = new Array();
		for ( var s = 0 ; s < this.wallSprite.length ; s++ ) {
			this.wallPosition[s] = this.wallSprite[s].getPosition();
		}

		this.wallBox = new Array();
		for ( var s = 0 ; s < this.wallSprite.length ; s++ ) {
			this.wallBox[s] = this.wallSprite[s].getBoundingBox();
		}
	},

	removeCoin: function( index ){
		this.removeChild( this.coinSprite[index] );
		this.coinSprite.splice( index, 1);
	},

	addSquidToCheckPoint: function( squid ) {
		for ( var i = 0 ; i < this.checkPoint.length ; i++ ) {
			this.checkPoint[i].addSquid( squid );
			this.checkPoint[i].scheduleUpdate();
		}
	}

});
Map.COIN_BOUNDARY_DISTANCE = 30*4;