rko.app = (function(window) {

	var app = {
		previousMode: undefined,
		modeLabel: 'introMode',
		$lockIcon: $('.lock-icon'),
		$logo: $('.logo'),
		$background: $('#parallax-auth'),
		$viewContainer: $('#lock'),
		helloMessages: ['Hello!', '안녕하세요!'],
	},
	carouselView = rko.carouselView,
	utils = new Utils();

	app.init = function() {
		utils.disableDefaultTouch();

		setTimeout(function() {
			app.$viewContainer.removeClass('loading');
		}, 100);

		setTimeout(function() {
			$('.password-hint').html(app.helloMessages[Math.floor(Math.random() * app.helloMessages.length)]);
			carouselView.init();
			document.activeElement.blur();
		}, 4000);

		var that = this;
	};

	return app;

}(window));
