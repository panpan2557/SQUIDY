var GameLayer = cc.Layer.extend({
    init: function() {
        this._super();
        this.gameLayerX = 0;
        this.gameLayerY = 0;
        this.setPosition( new cc.Point( this.gameLayerX, this.gameLayerY ) );
        this.setKeyboardEnabled( true );

        this.setAnchorPoint( cc.p( 0, 0 ) );

        // var actionBy = cc.MoveTo.create( 1, cc.p( 0, -600 ) );
        // this.runAction( actionBy );

        this.map = new Map( this );
        this.addChild( this.map );

        this.scoreLabel = new cc.LabelTTF.create("score : 0");
        this.scoreLabel.setAnchorPoint( cc.p( 0, 0 ) );
        this.scoreLabel.setPosition( cc.p( 800, 800 ) );
        this.addChild( this.scoreLabel );

        this.squid = new Squid( this.map, this.scoreLabel );
        this.squid.setPosition( new cc.Point( 75,500 ) );
        this.addChild( this.squid, 1 );
        this.squid.scheduleUpdate();

        this.map.addSquidToCheckPoint( this.squid );

        this.state = GameLayer.STATES.FRONT;

        this.scheduleUpdate();

        return true;
    },

    addScene: function( scene ) {
        this.scene = scene;
    },

    onKeyDown: function( e ) {
        if ( this.state == GameLayer.STATES.FRONT ) {
            this.state = GameLayer.STATES.STARTED;
            this.squid.start();
        }
        if ( this.state == GameLayer.STATES.STARTED ) {
            if ( e == cc.KEY.left ) {
                this.squid.isLeft = true;
            } 
            if ( e == cc.KEY.right ) {
                this.squid.isRight = true;
            } 
            if ( e == cc.KEY.space ) {
                this.squid.isJump = true;
            }
        }
    },

    onKeyUp: function( e ){
        if ( e == cc.KEY.left ) {
            this.squid.isLeft = false;
        }
        if ( e == cc.KEY.right ) {
            this.squid.isRight = false;
        }
        if ( e == cc.KEY.space ) {
            this.squid.isJump = false;
        }
    },

    update: function() {
        //console.log( this.map.getPosition().x +", "+ this.map.getPosition().y );
    }
});

GameLayer.STATES = {
    FRONT: 1,
    STARTED: 2
}


