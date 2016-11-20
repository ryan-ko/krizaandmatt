RKO.PARALLAX_FACTORY = (function(window) {
	var parallax = {
		amountMovedX: undefined,
		amountMovedY: undefined,
		degX: undefined,
		degY: undefined
	};

	parallax.onMove = function(context, e, maxDeg) {
		var halfW = ( context.clientWidth / 2 );
		var halfH = ( context.clientHeight / 2 );
		var coorX = ( halfW - ( e.pageX - context.offsetLeft ) );
		var coorY = ( halfH - ( e.pageY - context.offsetTop ) );
		parallax.degX  = ( ( coorY / halfH ) * maxDeg ) + 'deg';
		parallax.degY  = ( ( coorX / halfW ) * -(maxDeg) ) + 'deg';
		parallax.amountMovedX = ((e.pageX * -1 / 2) + halfW / 2) / 8;
		parallax.amountMovedY = ((e.pageY * -1 / 2) + halfH / 2) / 8;
	};

	return parallax;
}(window));