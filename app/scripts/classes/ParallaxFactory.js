function ParallaxFactory(maxDeg) {
	this.parallaxPackage = {};
	this.maxDeg = maxDeg;
}

ParallaxFactory.prototype = {
	getMatrix: function(context, e) {
		var that = this;
		var halfW = ( context.clientWidth / 2 );
		var halfH = ( context.clientHeight / 2 );
		var coorX = ( halfW - ( e.pageX - context.offsetLeft ) );
		var coorY = ( halfH - ( e.pageY - context.offsetTop ) );
		that.parallaxPackage.degX  = ( ( coorY / halfH ) * that.maxDeg ) + 'deg';
		that.parallaxPackage.degY  = ( ( coorX / halfW ) * -(that.maxDeg) ) + 'deg';
		that.parallaxPackage.X = ((e.pageX * -1 / 2) + halfW / 2) / 8;
		that.parallaxPackage.Y = ((e.pageY * -1 / 2) + halfH / 2) / 8;

		return that.parallaxPackage;
	}
}
