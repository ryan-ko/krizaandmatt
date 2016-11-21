function Utils() {
	this.keysmap = {
		escape: 27
	}
}

Utils.prototype = {
	convertToTwoDigits: function(value) {
		if (value < 10) {
			return '0' + value;
		} else {
			return value;
		}
	},
	isCharacterKeyPress: function (evt) {
		if (typeof evt.which === 'undefined') {
			return true;
		} else if (typeof evt.which === 'number' && evt.which > 0) {
			return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8;
		}
		return false;
	}
};
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

function Countdown(endtime, $target) {
	this.endtime = endtime;
	this.utils = new Utils();
	this.$target = $target;
	this.timeinterval = undefined;
}

Countdown.prototype = {
	getTimeRemaining: function(endtime) {
		var t = Date.parse(endtime) - Date.parse(new Date());
		var seconds = Math.floor( (t/1000) % 60 );
		var minutes = Math.floor( (t/1000/60) % 60 );
		var hours = Math.floor( (t/(1000*60*60)) % 24 );
		var days = Math.floor( t/(1000*60*60*24) );

		return {
			'total': t,
			'days': this.utils.convertToTwoDigits(days),
			'hours': this.utils.convertToTwoDigits(hours),
			'minutes': this.utils.convertToTwoDigits(minutes),
			'seconds': this.utils.convertToTwoDigits(seconds)
		};
	},
	initCountdownClock: function() {
		var that = this;
		console.log('that.$target', that.$target.children());
		that.timeinterval = setInterval(function(){
			var t = that.getTimeRemaining(that.endtime);
			that.$target.children('.days').html(t.days);
			that.$target.children('.hours').html(t.hours);
			that.$target.children('.mins').html(t.minutes);
			that.$target.children('.secs').html(t.seconds);
			if (t.total <= 0) {
				clearInterval(that.timeinterval);
				this.$target.hide();
			}
		}, 1000);
	},
	destory: function() {
		var that = this;
		clearInterval(that.timeinterval);
	}
};


rko.carouselView = (function(window) {
	var view = {
		swiper: undefined,
		swiperGallery: undefined,
		krizaTimeline: undefined,
		swiperLock: undefined,
		bindables: {
			$plusOneCheckbox: $('#plusone-checkbox'),
			$rsvpForm: $('#rsvp-form')
		},
		mainCarouselConfig: {
			pagination: '.swiper-pagination',
			direction: 'vertical',
			slidesPerView: 1,
			paginationClickable: true,
			spaceBetween: 0,
			mousewheelControl: true,
			keyboardControl: true,
			simulateTouch: false,
			mousewheelForceToAxis: true,
			mousewheelInvert: true,
			mousewheelSensitivity: 0.5,
			onSlideChangeStart: function(swiper) {
				that.handleCarouselSlideChangeStart(swiper);
			},
			onSlideChangeEnd: function(swiper) {
				that.handleCarouselSlideChangeEnd(swiper);
			}
		},
		weddingCountdown: undefined
	};

	view.init = function(html) {
		$('#main').html(html);
		$('body').removeClass().addClass('carouselMode');
		this.bind();
	};

	view.setupRSVPForm = function() {
		var $plusOneCheckbox = $('#plusone-checkbox-result'),
			$plusOneInput = $('#plusone-input');

		this.bindables.$plusOneCheckbox.on('click', function(e) {
			if ($(e.target).is(':checked')) {
				$plusOneCheckbox.val('Yes');
				$plusOneInput.removeClass('hidden');
			} else {
				$plusOneCheckbox.val('No');
				$plusOneInput.addClass('hidden');
			}
		});

		this.bindables.$rsvpForm.submit(function(e) {
			var url = $(this).attr('action');
			$.ajax({
				type: 'POST',
				url: url,
				data: $(this).serialize(),
				success: function(data) {
					console.log('RSVP result:', data);
				}
			});
			e.preventDefault();
		});
	};

	view.unbindRSVPForm = function() {
		this.bindables.$plusOneCheckbox.off();
		this.bindables.$rsvpForm.off();
	};

	view.handleCarouselSlideChangeStart = function(swiper) {
		if (swiper.activeIndex === 1) {
			$('.swiper-pagination').addClass('light-mode');
		} else {
			if ($('.swiper-pagination').hasClass('light-mode')) {
				$('.swiper-pagination').removeClass('light-mode');
			}
		}

		if (swiper.activeIndex === 3) {
			if (typeof view.krizaTimeline === 'undefined') {
				view.krizaTimeline = new TimelineLite();
				view.krizaTimeline.to($('.gallery-scroller'), 300, {y:'-100%'});
				view.krizaTimeline.stop();
			} else {
				view.krizaTimeline.restart();
				view.krizaTimeline.stop();
			}
		} else {
			$('.kriza-gallery-container .gallery-scroller').removeAttr('style');
			if (typeof view.krizaTimeline !== 'undefined') {
				view.krizaTimeline.stop();
				view.krizaTimeline.restart();
			}
		}
		swiper.disableMousewheelControl();
	};

	view.handleCarouselSlideChangeEnd = function(swiper) {
		if (swiper.activeIndex === 2) {
			if (typeof view.swiperGallery === 'undefined') {
				view.swiperGallery = new Swiper('.swiper-container-gallery', {
					pagination: '.swiper-pagination-gallery',
					direction: 'horizontal',
					slidesPerView: 1,
					effect: 'fade',
					paginationClickable: true,
					spaceBetween: 0,
					simulateTouch: false,
					keyboardControl: true,
					mousewheelControl: true,
					mousewheelForceToAxis: true,
					mousewheelInvert: true
				});
			}

			$('.swiper-pagination').addClass('transparent-mode');
		} else {
			if ($('.swiper-pagination').hasClass('transparent-mode')) {
				$('.swiper-pagination').removeClass('transparent-mode');
			}
		}

		view.swiperLock = setTimeout(function() {
			swiper.enableMousewheelControl();
		}, 400);
	};

	view.setupCarousel = function() {
		var that = this;
		view.swiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			direction: 'vertical',
			slidesPerView: 1,
			paginationClickable: true,
			spaceBetween: 0,
			mousewheelControl: true,
			keyboardControl: true,
			simulateTouch: false,
			mousewheelForceToAxis: true,
			mousewheelInvert: true,
			mousewheelSensitivity: 0.5,
			onSlideChangeStart: function(swiper) {
				that.handleCarouselSlideChangeStart(swiper);
			},
			onSlideChangeEnd: function(swiper) {
				that.handleCarouselSlideChangeEnd(swiper);
			}
		});
	};

	view.setupParallaxEffects = function() {
		var parallaxFactory = new ParallaxFactory(5),
			movementMatrix,
			that = this;

		$('#landing').mousemove(function(e) {
			movementMatrix = parallaxFactory.getMatrix(this, e);

			$('#parallax-landing').css('transform', 'translate3d(' + movementMatrix.X/2 + 'px, ' + movementMatrix.Y/2 + 'px, -200px)');
			$('#landing .km-logo').css('transform', 'perspective(200px) translate3d(' + -movementMatrix.X/12 + 'px, ' + -movementMatrix.Y/12 + 'px, 0)');
		});
	};

	view.bind = function() {
		var that = this;
		this.setupRSVPForm();
		this.setupCarousel();
		this.setupParallaxEffects();
		this.weddingCountdown = new Countdown('2017-06-23', $('#invitation .countdown'));
		this.weddingCountdown.initCountdownClock();

		$('.gallery-movingUp-area').hover(function () {
			view.krizaTimeline.reverse();
			view.krizaTimeline.timeScale(14);
		}, function () {
			view.krizaTimeline.stop();
			view.krizaTimeline.timeScale(1);
		});

		$('.gallery-movingDown-area').hover(function () {
			view.krizaTimeline.play();
			view.krizaTimeline.timeScale(14);
		}, function () {
			view.krizaTimeline.stop();
			view.krizaTimeline.timeScale(1);
		});

		$('.gallery-movingUp-area').mousedown(function () {
			view.krizaTimeline.timeScale(60);
			console.log('hit');
		});

		$('.gallery-movingUp-area').mouseup(function () {
			view.krizaTimeline.timeScale(14);
			console.log('hit');
		});

		$('.gallery-movingDown-area').mousedown(function () {
			view.krizaTimeline.timeScale(60);
			console.log('hit');
		});

		$('.gallery-movingDown-area').mouseup(function () {
			view.krizaTimeline.timeScale(14);
			console.log('hit');
		});

		$('.gallery-movingDown-area').on('click', function() {
		});
	};

	return view;

}(window));
rko.passwordView = (function(window) {

	var view = {
		previousModeLabel: undefined,
		modeLabel: 'passwordMode',
		bindables: {
			$passwordInput: $('#password-input'),
			$passwordForm: $('#password-form'),
			$doc: $(document)
		},
		$body: $('body'),
		$passwordErrorMsg: $('#login-error-msg')
	},
	utils = new Utils(),
	carouselView = rko.carouselView;

	view.bind = function() {
		var that = this,
			pressedKey;

		that.bindables.$passwordInput.keydown(function(e) {
			that.hidePasswordErrorMessage();
		});

		that.bindables.$doc.keydown(function(e) {
			pressedKey = e.keyCode;
			if (that.$body.hasClass(that.previousModeLabel) &&
					utils.isCharacterKeyPress(e) &&
					pressedKey !== utils.keysmap.escape) {
				that.$body.removeClass().addClass(that.modeLabel);
				that.bindables.$passwordInput.focus();
			}

			if (that.$body.hasClass(that.modeLabel)) {
				if (pressedKey === utils.keysmap.escape) {
					that.$body.removeClass().addClass(that.previousModeLabel);
					that.bindables.$passwordInput.val('');
				}
			}
		});

		that.bindables.$passwordForm.submit(function(e) {
			var url = $(this).attr('action'),
				data;

			$.ajax({
				type: 'POST',
				url: url,
				data: $(this).serialize(),
				success: function(data) {
					data = $.parseJSON(data);
					if (data.result === 'success') {
						that.unbind();
						carouselView.init(data.html);
					} else {
						that.showPasswordErrorMessage();
					}
				}
			});
			e.preventDefault();
		});
	};

	view.unbind = function() {
		var bindables = this.bindables;
		for (var key in bindables) {
			if (bindables.hasOwnProperty(key)) {
				bindables[key].off();
			}
		}
	};

	view.showPasswordErrorMessage = function() {
		this.$passwordErrorMsg.addClass('show');
	};
	view.hidePasswordErrorMessage = function() {
		this.$passwordErrorMsg.removeClass('show');
	};
	view.init = function(previousModeLabel) {
		this.previousModeLabel = previousModeLabel;
		this.bind();
	};

	return view;

}(window));

rko.app = (function(window) {

	var app = {
		previousMode: undefined,
		modeLabel: 'introMode',
		$lockIcon: $('.lock-icon'),
		$logo: $('.logo'),
		$background: $('#parallax-auth'),
		$viewContainer: $('#auth')
	},
	passwordView = rko.passwordView;

	app.init = function() {
		passwordView.init(this.modeLabel);
		this.setupParallaxEffects();
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
	};

	return app;

}(window));
