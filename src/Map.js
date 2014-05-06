var Map = cc.Node.extend({
	ctor: function( gameLayer ) {
		this._super();
		// this.setPosition( cc.p( 0, 150 ) );
		this.gameLayer = gameLayer;

		this.WIDTH = 30;
		this.HEIGHT = 20;
		this.nextMapIndicator = 0;
		this.MAP = Map.maps[0];

		this.wallSprite = [];
		this.coinSprite = [];
		this.checkPoint = [];
		// var i = 0;
		// var j = 0;
		// var k = 0;

		// for ( var r = 0 ; r < this.HEIGHT ; r++ ) {
		// 	for ( var c = 0 ; c < this.WIDTH ; c++ ) {
		// 		if ( this.MAP[r][c] == "#" ) {
		// 			this.wallSprite[i] = new Wall();
		// 			this.wallSprite[i].setPosition( cc.p( c*30, ( this.HEIGHT - r - 1 )*30+150 ) );
		// 			this.addChild( this.wallSprite[i] );
		// 			i++;
		// 		}
		// 		if ( this.MAP[r][c] == "*" ) {
		// 			this.coinSprite[j] = new Coin();
		// 			this.coinSprite[j].setAnchorPoint( cc.p( 0, 0 ) );
		// 			this.coinSprite[j].setPosition( cc.p( c*30+10, ( this.HEIGHT - r - 1 )*30+10+150 ) );
		// 			this.addChild( this.coinSprite[j] );
		// 			j++;
		// 		}
		// 		if ( this.MAP[r][c] == "c" ) {
		// 			this.checkPoint[k] = new CheckPoint( this.gameLayer, this );
		// 			this.checkPoint[k].setPosition( cc.p( c*30, ( this.HEIGHT - r - 1 )*30+150 ) );
		// 			this.addChild( this.checkPoint[k] );
		// 			k++;
		// 		}
		// 	}
		// }
		this.mapLevel = 0;
		this.drawMap( Map.maps[this.mapLevel] );

		this.setAnchorPoint( cc.p( 0, 0 ) );

	},

	drawMap: function( map ) {
		var i = this.wallSprite.length;
		var j = this.coinSprite.length;
		var k = this.checkPoint.length;

		for ( var r = 0 ; r < this.HEIGHT ; r++ ) {
			for ( var c = 0 ; c < this.WIDTH ; c++ ) {
				if ( map[r][c] == "#" ) {
					var wallSpritee = new Wall();
					wallSpritee.setPosition( cc.p( c*30, ( this.HEIGHT - r - 1 )*30+150+this.nextMapIndicator ) );
					this.addChild( wallSpritee );
					this.wallSprite.push( wallSpritee );
					// this.wallSprite[i] = new Wall();
					// this.wallSprite[i].setPosition( cc.p( c*30, ( this.HEIGHT - r - 1 )*30+150+this.nextMapIndicator ) );
					// this.addChild( this.wallSprite[i] );
					// i++;
				}
				if ( map[r][c] == "*" ) {
					var wallSpritee = new Coin();
					wallSpritee.setPosition( cc.p( c*30+10, ( this.HEIGHT - r - 1 )*30+10+150+this.nextMapIndicator ) );
					this.addChild( wallSpritee );
					this.coinSprite.push( wallSpritee );
					// this.coinSprite[j] = new Coin();
					// this.coinSprite[j].setAnchorPoint( cc.p( 0, 0 ) );
					// this.coinSprite[j].setPosition( cc.p( c*30+10, ( this.HEIGHT - r - 1 )*30+10+150+this.nextMapIndicator ) );
					// this.addChild( this.coinSprite[j] );
					// j++;
				}
				if ( map[r][c] == "c" ) {
					var wallSpritee = new CheckPoint( this.gameLayer, this );
					wallSpritee.setPosition( cc.p( c*30, ( this.HEIGHT - r - 1 )*30+150+this.nextMapIndicator ) );
					this.addChild( wallSpritee );
					wallSpritee.scheduleUpdate();
					this.checkPoint.push( wallSpritee );
					console.log(this.checkPoint.length);
					// this.checkPoint[k] = new CheckPoint( this.gameLayer, this );
					// this.checkPoint[k].setPosition( cc.p( c*30, ( this.HEIGHT - r - 1 )*30+150+this.nextMapIndicator ) );
					// this.addChild( this.checkPoint[k] );
					// this.checkPoint[k].scheduleUpdate();
					// k++;
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
				//var y = cc.rectGetMinY( this.checkPoint[i].getBoundingBoxToWorld() );
				// for ( var j = 0 ; j < this.checkPoint.length ; j++ ) {
				// 	if ( y == cc.rectGetMinY( this.checkPoint[j].getBoundingBoxToWorld() ) ) {
						
				// 		this.checkPoint.splice( j, 1 );
				// 	}
				// }
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