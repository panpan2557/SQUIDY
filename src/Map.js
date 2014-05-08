var Map = cc.Node.extend({
	ctor: function( gameLayer ) {
		this._super();
		this.gameLayer = gameLayer;

		this.WIDTH = 30;
		this.HEIGHT = 20;
		this.nextMapIndicator = 0;
		this.MAP = Map.maps[0];

		this.wallSprite = [];
		this.coinSprite = [];
		this.checkPoint = [];
		this.urchin = [];
		this.bonusTime = [];

		this.mapLevel = 0;
		this.drawMap( Map.maps[this.mapLevel] );

		this.setAnchorPoint( cc.p( 0, 0 ) );

	},

	drawMap: function( map ) {
		// var i = this.wallSprite.length;
		// var j = this.coinSprite.length;
		// var k = this.checkPoint.length;
		// var l = this.urchin.length;

		for ( var r = 0 ; r < this.HEIGHT ; r++ ) {
			for ( var c = 0 ; c < this.WIDTH ; c++ ) {
				if ( map[r][c] == "#" ) {
					var sprite = new Wall();
					sprite.setPosition( cc.p( c*30, ( this.HEIGHT - r - 1 )*30+150+this.nextMapIndicator ) );
					this.addChild( sprite );
					this.wallSprite.push( sprite );
				}
				if ( map[r][c] == "*" ) {
					var sprite = new Coin();
					sprite.setPosition( cc.p( c*30+10, ( this.HEIGHT - r - 1 )*30+10+150+this.nextMapIndicator ) );
					this.addChild( sprite );
					this.coinSprite.push( sprite );
				}
				if ( map[r][c] == "c" ) {
					var sprite = new CheckPoint( this.gameLayer, this );
					sprite.setPosition( cc.p( c*30, ( this.HEIGHT - r - 1 )*30+150+this.nextMapIndicator ) );
					this.addChild( sprite );
					sprite.scheduleUpdate();
					this.checkPoint.push( sprite );
				}
				if ( map[r][c] == "U" ) {
					var sprite = new Urchin( this.gameLayer );
					sprite.setPosition( cc.p( c*30, ( this.HEIGHT - r - 1 )*30+150+this.nextMapIndicator ) );
					this.addChild( sprite );
					sprite.scheduleUpdate();
					this.urchin.push( sprite );
				}
				if ( map[r][c] == "B" ) {
					var sprite = new BonusTime( this.gameLayer );
					sprite.setPosition( cc.p( c*30, ( this.HEIGHT - r - 1 )*30+150+this.nextMapIndicator ) );
					this.addChild( sprite );
					sprite.scheduleUpdate();
					this.bonusTime.push( sprite );
				}
			}
		}
		this.nextMapIndicator += Map.HEIGHT;
		this.mapLevel += 1;
	},

	removeCoin: function( index ){
		this.removeChild( this.coinSprite[index] );
		this.coinSprite.splice( index, 1 );
	},
	removeSprite: function() {
		for ( var i = 0 ; i < this.wallSprite.length ; i++ ) {
			if ( cc.rectGetMinY( this.wallSprite[i].getBoundingBoxToWorld() ) < 0 ) {
				this.removeChild( this.wallSprite[i] );
				this.wallSprite.splice( i, 1 );
			}
		}

		for ( var i = 0 ; i < this.checkPoint.length ; i++ ) {
			if ( cc.rectGetMinY( this.checkPoint[i].getBoundingBoxToWorld() ) < 0 ) {
				this.removeChild( this.checkPoint[i] );
				this.checkPoint.splice( i, 1 );
			}
		}

		for ( var i = 0 ; i < this.urchin.length ; i++ ) {
			if ( cc.rectGetMinY( this.urchin[i].getBoundingBoxToWorld() ) < 0 ) {
				this.removeChild( this.urchin[i] );
				this.urchin.splice( i, 1 );
			}
		}

		for ( var i = 0 ; i < this.bonusTime.length ; i++ ) {
			if ( cc.rectGetMinY( this.bonusTime[i].getBoundingBoxToWorld() ) < 0 ) {
				this.removeChild( this.bonusTime[i] );
				this.bonusTime.splice( i, 1 );
			}
		}
	},

	inactivateCheckPoint: function() {
		for ( var i = 0 ; i < this.checkPoint.length ; i++ ) {
			if ( this.gameLayer.actionIsDone ) {
				for( var j=0;j<3;j++ ) {
					this.removeChild( this.checkPoint[0] );
					this.checkPoint.shift();
				}
				console.log(this.mapLevel+": Before");
				this.drawMap( Map.maps[this.mapLevel] );
				console.log(this.mapLevel+": After");
				console.log(this.checkPoint.length);
				this.gameLayer.squid.initialScroll -= 600;
				this.gameLayer.actionIsDone = false;
				break;
			}
		}
	},

	specialRemoveCoin: function() {
		for ( var i = 0 ; i < this.coinSprite.length ; i++ ) {
			if ( cc.rectGetMinY( this.coinSprite[i].getBoundingBoxToWorld() ) < 0 ) {
				this.removeChild( this.coinSprite[i] );
				this.coinSprite.splice( i, 1 );
			}
		}
	},

	update: function() { 
		this.inactivateCheckPoint();
		this.removeSprite();
	}

});
Map.HEIGHT = 600;
Map.maps = [
[
	'##########################ccc#', //30 x 20 size: 900 x 600
	'#                            #',
	'#   *****B          *****    #',
	'#   ######  U                #',
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
],
[
	'#ccc##########################', //30 x 20 size: 900 x 600
	'#           ##               #',
	'#      ***  ##               #',
	'#####  * *  ##               #',
	'#####  * *  ##          ## * #',
	'#####  ***  ##  ******* ## * #',
	'#####       ##  ########## * #',
	'#####   ######          ## * #',
	'#####       ##          ## * #',
	'##### ***   ##  ******* ## * #',
	'##########  ##  ####### ## * #',
	'#####       ##          ## * #',
	'#####    ** ##  ******* ## * #',
	'#####   ######  ########## * #',
	'#####                   ## * #',
	'##### *     *   *   *   ## * #',
	'########   * * * * * *  ## * #',
	'########  * * * * * * * ## * #',
	'######## * * *  *  * * *## * #',
	'########################## * #'
],
[
	'##########################ccc#', //30 x 20 size: 900 x 600
	'#     ****                   #',
	'#     ****      *********    #',
	'#     ####  #   * *   * *    #',
	'#     ####  #   *  ###  *    #',
	'#           #   *********    #',
	'#    ****** #   #########    #',
	'#     *  ####                #',
	'#      *    #                #',
	'#  ******   # * * * * * * *  #',
	'#   * ####  ###############  #',
	'#    *      # * * * * * * *  #',
	'#     ***** # * * * * * * *  #',
	'#    *  ######################',
	'#   ***********    ### ***** #',
	'#       ######**********## * #',
	'########################## * #',
	'#     *   *   *  *  *  *   * #',
	'#    * *** *** ** ** ** **** #',
	'#   ##########################'
],
[
	'#ccc##########################', //30 x 20 size: 900 x 600
	'#   #                   **   #',
	'#   #  *   *   *   ##  *  *  #',
	'#   #  *   *   *   ##  *  *  #',
	'#   #  *   *   *   ##   **   #',
	'#   #  *   *   *   ########  #',
	'#   #  *********   #         #',
	'#   #              #  ****** #',
	'#   #  *********   #  ########',
	'#   #      *       #         #',
	'#   #      *       ####### * #',
	'#   #      *       #  *  # * #',
	'#   ###    *       # *** # * #',
	'#                  # *** # * #',
	'#      *********   # *** # * #',
	'#      *           # *** # * #',
	'#      *****       # *** # * #',
	'#      *           # *** # * #',
	'#                     *  # * #',
	'########################## * #'
],
[
	'##############################', //30 x 20 size: 900 x 600
	'#****************************#',
	'#**cccccc**cc***cc**cccccc***#',
	'#**ccc*****ccc**cc**cc****c**#',
	'#**cccccc**cc*c*cc**cc****c**#',
	'#**ccc*****cc**ccc**cc****c**#',
	'#**cccccc**cc***cc**cccccc***#',
	'#****************************#',
	'#****************************#',
	'#****************************#',
	'#****************************#',
	'#*********###***###**********#',
	'#****************************#',
	'#****************************#',
	'#********#*********#*********#',
	'#*********##*****##**********#',
	'#***********#####************#',
	'#****************************#',
	'#****************************#',
	'##############################'
]

];
/* template
[
	'##############################', //30 x 20 size: 900 x 600
	'#                            #',
	'#                            #',
	'#                            #',
	'#                            #',
	'#                            #',
	'#                            #',
	'#                            #',
	'#                            #',
	'#                            #',
	'#                            #',
	'#                            #',
	'#                            #',
	'#                            #',
	'#                            #',
	'#                            #',
	'#                            #',
	'#                            #',
	'#                            #',
	'##############################'
]
*/