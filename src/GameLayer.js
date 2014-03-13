var GameLayer = cc.LayerColor.extend({
    init: function() {
        this._super( new cc.Color4B( 127, 127, 127, 255 ) );
        this.setPosition( new cc.Point( 0, 0 ) );
        this.setKeyboardEnabled( true );

        this.squid = new Squid();
        this.squid.setPosition( new cc.Point(400,400) );
        this.addChild( this.squid );
        this.squid.scheduleUpdate();

        return true;
    },

    onKeyDown: function( e ) {
        console.log('Down '+e);
        if ( e == cc.KEY.left ) {
            this.squid.isLeft = true;
            this.squid.resistDir = 0;
        } else if ( e == cc.KEY.right ) {
            this.squid.isRight = true;
            this.squid.resistDir = 0;
        } else if ( e == cc.KEY.space ) {
            this.squid.isJump = true;
        }
    },

    onKeyUp: function( e ){
        if ( e == cc.KEY.left ) {
            this.squid.isLeft = false;
            this.squid.resistDir = 4;
        } else if ( e == cc.KEY.right ) {
            this.squid.isRight = false;
            this.squid.resistDir = 2;
        } else if ( e == cc.KEY.space ) {
            this.squid.isJump = false;
        }
    }
});

var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild( layer );
    }
});

