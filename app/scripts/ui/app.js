rko.app = (function(window) {

	var app = {
		previousMode: undefined,
		modeLabel: 'introMode',
		$lockIcon: $('.lock-icon'),
		$logo: $('.logo'),
		$background: $('#parallax-auth'),
		$viewContainer: $('#lock')
	},
	passwordView = rko.passwordView,
	utils = new Utils();

	app.init = function() {
		utils.disableDefaultTouch();
		// $('#auth').imagesLoaded(function() {
		setTimeout(function() {
			console.log('loaded!');
			app.$viewContainer.removeClass('loading');
		}, 100);

		var that = this;

		$('.logo').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
			that.$viewContainer.removeClass('entranceMode');
			console.log(e);
			if (e.type === 'transitionend') {
				that.setupParallaxEffects();
				passwordView.init(that.modeLabel);
			}
		});
	};

	app.setupParallaxEffects = function() {
		var parallaxFactory = new ParallaxFactory(5),
			movementMatrix,
			that = this;

		this.$viewContainer.mousemove(function(e) {
			movementMatrix = parallaxFactory.getMatrix(this, e);
			that.$lockIcon.css('transform', 'perspective(40px) translate3d(' + -movementMatrix.X/4 + 'px, ' + -movementMatrix.Y/4 + 'px, 0) rotateX(' + movementMatrix.degX +') rotateY('+ movementMatrix.degY +')');
			that.$logo.css('transform', 'perspective(500px) translate3d(' + -movementMatrix.X/8 + 'px, ' + -movementMatrix.Y/8 + 'px, 0) rotateX(' + movementMatrix.degX + ') rotateY(' + movementMatrix.degY + ')');
			that.$background.css('transform', 'perspective(1000px) translate3d(' + movementMatrix.X/2 + 'px, ' + movementMatrix.Y/2 + 'px, -20px)');
		});

		// http://www.albertosarullo.com/blog/javascript-accelerometer-demo-source
	};

	return app;

}(window));
