var GameLayer = cc.LayerColor.extend({
    init: function() {
        this._super( new cc.Color4B( 127, 127, 127, 255 ) );
        this.setPosition( new cc.Point( 0, 0 ) );
        this.setKeyboardEnabled( true );

        this.map = new Map();
        this.map.setPosition( cc.p( 0, 150 ) );
        this.addChild( this.map );

        this.squid = new Squid( this.map );
        this.squid.setPosition( new cc.Point(400,400) );
        this.addChild( this.squid, 1 );
        this.squid.scheduleUpdate();

        this.state = GameLayer.STATES.FRONT;

        return true;
    },

    onKeyDown: function( e ) {
        if ( this.state == GameLayer.STATES.FRONT ) {
            this.state = GameLayer.STATES.STARTED;
            this.squid.start();
        }
        if ( this.state == GameLayer.STATES.STARTED ) {
            console.log('Down '+e);
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
    }
});

GameLayer.STATES = {
    FRONT: 1,
    STARTED: 2
}

var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild( layer );
    }
});

