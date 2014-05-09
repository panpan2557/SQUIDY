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

		this.firstStage = new cc.Sprite();
		this.firstStage.init( 'images/firstStage.png' );
		this.firstStage.setAnchorPoint( cc.p( 0, 0 ) );
		this.firstStage.setPosition( cc.p( 150, 75 ) );
		this.addChild( this.firstStage );

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
				// console.log(this.mapLevel+": Before");
				if ( this.mapLevel % 2 == 0 ) {
					var num = Math.round((Math.random() * (Map.leftMap.length-1 - 0)));
					this.drawMap( Map.leftMap[num] );
				} else {
					var num = Math.round((Math.random() * (Map.rightMap.length-1 - 0)));
					this.drawMap( Map.rightMap[num] );
				}
				// this.drawMap( Map.maps[this.mapLevel] );
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

///////////////////////////////////////// (start) left - right

Map.leftMap = 
[
[
	'##########################ccc#', //30 x 20 size: 900 x 600
	'#        UU             UU   #',
	'#                *           #',
	'#               * *          #',
	'# * ##   UU    *   *    UU   #',
	'# * ##   UU   *  U  *   UU   #',
	'# * ##   UU  *   U   *  UU   #',
	'# * ##      *    U    *      #',
	'# * ##     *     U     *     #',
	'# * ##    *      U      *    #',
	'# * ##U  *****   U   *****  U#',
	'# * ##        *  U  *        #',
	'# * ##       *   U   *       #',
	'# * ##      ****   ****      #',
	'# * ##          * *          #',
	'# * ##           *           #',
	'# * ##      UU   B   UU      #',
	'# * ##                       #',
	'# * ##UUUUUUUUUUUUUUUUUUUUUUU#',
	'#   ##########################'
],
[
	'##########################ccc#', //30 x 20 size: 900 x 600
	'#          #                 #',
	'#          #  *******        #',
	'#   UU     #  *******        #',
	'# * ##     #                 #',
	'# * ##    U############      #',
	'# * ##                #      #',
	'# * ## ***********    #      #',
	'# * ###############   #      #',
	'# * ##UU              #      #',
	'# * ##      ********* #      #',
	'# * ## ** #############UU  UU#',
	'# * ## ** #                  #',
	'# * ## ** #       B          #',
	'# * ## ** #      ###   ***   #',
	'# * ## **        ### ******* #',
	'# * ## **        ### ******* #',
	'# * ##           ### ******* #',
	'# * ## UUUUUUUUU ###   ***   #',
	'#   ##########################'
],
[
	'##########################ccc#', //30 x 20 size: 900 x 600
	'#    UUUUUUUUUUUUU      UU   #',
	'#    *************    B UU   #',
	'#    *************           #',
	'#                            #',
	'#****#########################',
	'#****                        #',
	'#****        **********    * #',
	'##########UU             U * #',
	'#          U             U * #',
	'# *    *** U **********  U * #',
	'# * ## *** U *****B****  U * #',
	'# * ## *** U **********  U * #',
	'# * ## *** U             U * #',
	'# * ## *** UUUUU     UUUUU * #',
	'# * ##       ***********     #',
	'# * ##       ***********     #',
	'# * ##                       #',
	'# * ##          UUUUUU       #',
	'#   ##########################'
],
[
	'##########################ccc#', //30 x 20 size: 900 x 600
	'#UUUUUU ****   ****     ** B #',
	'#UUUUUU ****   ****     **** #',
	'#UUUUUU **** # ****     **** #',
	'#            #     *****     #',
	'# ******     #     *****     #',
	'# ******     #     *****     #',
	'# ******     #################',
	'#            # ***** UU *****#',
	'#########    # *   * UU *   *#',
	'#            # * U * UU * U *#',
	'#            # * U * UU * U *#',
	'#   ########## * U * UU * U *#',
	'#   ########## * U *    * U *#',
	'#         U      U ****** U *#',
	'#   U            U **BB** U *#',
	'###########################  #',
	'# *** ****    ****    ****   #',
	'# *  *    ****    ****       #',
	'#   ##########################'
],
[
	'##########################ccc#', //30 x 20 size: 900 x 600
	'#U      U##    * *       U   #',
	'#        ##    * *********   #',
	'# * ## * ##  * *             #',
	'# * ## * ##  * ***********   #',
	'# * ## *    **               #',
	'# * ## *******************   #',
	'# * ##                       #',
	'# * UUUBBUUUUUUUUUUUUUUUUU   #',
	'# * UUUUUUUUU                #',
	'# * UUUUUUUUU                #',
	'# * UUUUUUUUU  ************  #',
	'# *         #  ************  #',
	'#*********  #  ************  #',
	'##########  #  ************  #',
	'# ****** #  #       **       #',
	'# ****** #  #  UUU  **  UUU  #',
	'# * ###  #  #  UUU  **  UUU  #',
	'# * ###     #  UUU  BB  UUU  #',
	'# * ##########################'
],
[
	'##########################ccc#', //30 x 20 size: 900 x 600
	'#     ****                   #',
	'#     ****      *********    #',
	'#     ####  #   * * B * *    #',
	'#     ####  #   *  ###  *    #',
	'#           #   *********    #',
	'#    ****** #   #########    #',
	'#     *  ####                #',
	'#      *    #                #',
	'#  ******   # * * * * * * *  #',
	'#   * ####  ###############  #',
	'#    *      # * * * * * * *  #',
	'#     B**** # * * * * * * *  #',
	'#    *  ######################',
	'#   ***********    ### ***** #',
	'#       ######**********## * #',
	'########################## * #',
	'#     *   *   *  *  *  *   * #',
	'#    * *** *** ** ** ** **** #',
	'#   ##########################'
]

];

Map.rightMap = 
[
[
	'#ccc##########################', //30 x 20 size: 900 x 600
	'#           ##               #',
	'#      *B*  ##               #',
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
	'#ccc##########################', //30 x 20 size: 900 x 600
	'#   #                   **   #',
	'#   #  *   *   *   ##  *  *  #',
	'#   #  *   *   *   ##  *  *  #',
	'#   #  *   *   *   ##   **   #',
	'#   #  *   *   *   ########  #',
	'#   #  *********   #         #',
	'#   #              #  ****** #',
	'#   #  ****B****   #  ########',
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
	'#ccc##########################', //30 x 20 size: 900 x 600
	'# B  U               U       #',
	'#        UUUUUUUUU           #',
	'##########################   #',
	'#         U **************   #',
	'#    B    U *                #',
	'#  *    * U *    UUUUUUUUUUUU#',
	'# * * U * U * * * * * * * *  #',
	'# * * U * U  * * * * * * * * #',
	'# * * U * U############### * #',
	'# * * U * U   ****   U   B * #',
	'# * * # * U  *    *  U     * #',
	'# * * # *    *    *  U     * #',
	'# * * #  ***** U  *        * #',
	'# * * #        U   ********* #',
	'#  *  ########################',
	'#U *          UUUU          U#',
	'#     ******        ******   #',
	'#UUUUU######        ###### * #',
	'########################## * #'
],
[
	'#ccc##########################', //30 x 20 size: 900 x 600
	'# *              U## BB UUUUU#',
	'# **************  #U    ## * #',
	'#               * ##U  U## * #',
	'#               * #U    ## * #',
	'# UUUUUUU       * ##    ## * #',
	'#               * #U ******* #',
	'#  ********     * ## ******* #',
	'# *   *   ** UU * #U ** ## * #',
	'# * U * U ** UU * ## ** UU * #',
	'# * U B U ** UU * #U ** ## * #',
	'# * UUUUU ** UU * ## ** UU * #',
	'############### * #U ** ## * #',
	'#U **********     ## ** UU * #',
	'# *              U#U ** ## * #',
	'# * ################ ** UU * #',
	'# ** *  UUUU     * * ** ## * #',
	'#   * * * * * * * * *   ## * #',
	'#   U  * * * * *  ##UUUU## * #',
	'########################## * #'
],
[
	'#ccc##########################', //30 x 20 size: 900 x 600
	'# * U                        #',
	'# * U             ********   #',
	'# *    *      #   *      *   #',
	'# *   ***     #   *  *** *   #',
	'#******B******#   *    * *   #',
	'#     ***     #   ****** *   #',
	'#      *      #          *   #',
	'# UUUUUUUUUUUUU          *   #',
	'#U *** UUUUU  *******    *   #',
	'#U * *  ***   *          *   #',
	'#U * **** *****  UU          #',
	'#U *  ###############**      #',
	'#U *        ******** ##**    #',
	'#U * * * * *        ** ##**  #',
	'#U* * * * * UUUUUU##  *  ##*B#',
	'#U * * * * U       ##  *   ###',
	'# U UBU U U         ##  ***  #',
	'#  U U U U           ##    * #',
	'##########################   #'
],
[
	'#ccc##########################', //30 x 20 size: 900 x 600
	'# B UUUUUUUUUUUU*************#',
	'#                          * #',
	'########################  * *#',
	'#U  ******** U *  UB**** * * #',
	'#  * *  U   * * * UUUUU * *  #',
	'# *   ****** * U ******* *   #',
	'# * ##########################',
	'# * UU *****  UUU  *******   #',
	'#  *  *     *     *       ** #',
	'#U  **  UUU  *****  UUU    * #',
	'########################## * #',
	'#        ***************   * #',
	'# ******* U U U U U U   B*** #',
	'# *      ***************U    #',
	'# * ##########################',
	'# *******   U    *********  U#',
	'#      U *   U  *  U      *  #',
	'#     U   ******  U        * #',
	'########################## * #'
],
[
	'#ccc##########################', //30 x 20 size: 900 x 600
	'#   ***************     UUUU#',
	'#                 *    UU    #',
	'###############  *   UU   ** #',
	'# U   U  *****  *  UU    * * #',
	'#U   ****  U  * *  U    *  * #',
	'# B *       U  *   U  **   * #',
	'#  *    ###########U *  ## * #',
	'#   *   *   ****** U *  ## * #',
	'#U   * * * *    ** U *  ## * #',
	'#U    * U *     ** U *  ## * #',
	'#UUUUUUUUUUUUUU ** U *  ## * #',
	'#            UU    U *  ## * #',
	'# **    ****    ** U *  ## * #',
	'# **    ****    ** U *  ## * #',
	'#            UU    U *  ## * #',
	'# ** UUUUUUUUUUUUUUU *  ## * #',
	'# **        B        *  ## * #',
	'#                       ## * #',
	'########################## * #'
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