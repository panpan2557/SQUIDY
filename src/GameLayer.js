var GameLayer = cc.Layer.extend({
    init: function( timeGauge ) {
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

        this.squid = new Squid( this.map );
        this.squid.setPosition( new cc.Point( 75,500 ) );
        this.addChild( this.squid, 1 );
        this.squid.scheduleUpdate();

        this.timeGauge = timeGauge;

        this.actionIsDone = false;

        this.map.scheduleUpdate();

        this.state = GameLayer.STATES.FRONT;

        this.scheduleUpdate();

        return true;
    },

    addScene: function( scene ) {
        this.scene = scene;
    },

    addScoreLabel: function( scoreLabel ) {
        this.scoreLabel = scoreLabel;
        this.squid.addScoreLabel( this.scoreLabel );
    },

    addTimeGauge: function( timeGauge ) {
        this.timeGauge = timeGauge;
        // this.squid.addTimeGauge
    },

    onKeyDown: function( e ) {
        if ( this.state == GameLayer.STATES.FRONT ) {
            this.state = GameLayer.STATES.STARTED;
            this.squid.start();
        }
        if ( this.state == GameLayer.STATES.STARTED ) {
            this.timeGauge.scheduleUpdate();
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
        if ( this.timeGauge.isTimeOut ) {
            this.squid.die();
            //console.log(1);
        }
    }
});

GameLayer.STATES = {
    FRONT: 1,
    STARTED: 2
}


