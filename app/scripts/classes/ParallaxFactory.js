class ParallaxFactory {
	constructor(maxDeg) {
		this.parallaxPackage = {};
		this.maxDeg = maxDeg;
	}

	getMatrix(context, e) {
		let that = this;
		let halfW = ( context.clientWidth / 2 );
		let halfH = ( context.clientHeight / 2 );
		let coorX = ( halfW - ( e.pageX - context.offsetLeft ) );
		let coorY = ( halfH - ( e.pageY - context.offsetTop ) );
		that.parallaxPackage.degX  = ( ( coorY / halfH ) * that.maxDeg ) + 'deg';
		that.parallaxPackage.degY  = ( ( coorX / halfW ) * -(that.maxDeg) ) + 'deg';
		that.parallaxPackage.X = ((e.pageX * -1 / 2) + halfW / 2) / 8;
		that.parallaxPackage.Y = ((e.pageY * -1 / 2) + halfH / 2) / 8;

		return that.parallaxPackage;
	}
}
