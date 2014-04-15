var Coin = cc.Sprite.extend({
	ctor: function() {
		this._super();
		this.initWithFile( 'images/coin.png' );
	}
})