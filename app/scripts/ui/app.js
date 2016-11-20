RKO.APP = (function(window) {

	var app = {},
	lock = RKO.LOCK,
	parallaxFactory = RKO.PARALLAX_FACTORY;

	app.init = function() {
		lock.init();

		$('#auth').mousemove(function(e) {
			parallaxFactory.onMove(this, e, 5);

			$('#parallax-auth').css('transform', 'perspective(1000px) translate3d(' + parallaxFactory.amountMovedX/2 + 'px, ' + parallaxFactory.amountMovedY/2 + 'px, -20px)');
			$('.lock-icon').css('transform', 'perspective(40px) translate3d(' + -parallaxFactory.amountMovedX/4 + 'px, ' + -parallaxFactory.amountMovedY/4 + 'px, 0) rotateX(' + parallaxFactory.degX +') rotateY('+ parallaxFactory.degY +')');
			$('.logo').css('transform', 'perspective(500px) translate3d(' + -parallaxFactory.amountMovedX/8 + 'px, ' + -parallaxFactory.amountMovedY/8 + 'px, 0) rotateX(' + parallaxFactory.degX + ') rotateY(' + parallaxFactory.degY + ')');
		});
	};

	return app;

}(window));
