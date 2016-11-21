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
	render: function() {
		var t = this.getTimeRemaining(this.endtime);
		this.$target.children('.days').html(t.days);
		this.$target.children('.hours').html(t.hours);
		this.$target.children('.mins').html(t.minutes);
		this.$target.children('.secs').html(t.seconds);
		if (t.total <= 0) {
			clearInterval(this.timeinterval);
			this.$target.hide();
		}
	},
	initCountdownClock: function() {
		var that = this;
		console.log('that.$target', that.$target.children());
		that.render();
		that.timeinterval = setInterval(function() {
			that.render();
		}, 1000);

		setTimeout(function() {
			that.$target.removeClass('hidden');
		}, 500);
	},
	destroy: function() {
		var that = this;
		clearInterval(that.timeinterval);
		this.$target.addClass('hidden');
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
		weddingCountdown: undefined,
		krizaPhotoTimeline: undefined,
		mattPhotoTimeline: undefined,
		currentSlideId: undefined
	};

	view.init = function(html) {
		$('#main').html(html);
		$('body').removeClass().addClass('carouselMode');

		var that = this,
			maxHeight;

		$('#kriza .gallery-scroller').imagesLoaded( function() {
			maxHeight = -$('#kriza .gallery-scroller').innerHeight() + ($(window).innerHeight());
			that.krizaPhotoTimeline = new TimelineLite({paused: true});
			that.krizaPhotoTimeline.to($('#kriza .gallery-scroller'), 300, { y: maxHeight + 'px', force3D: true, ease: Quad.easeInOut });
		});
		$('#matt .gallery-scroller').imagesLoaded( function() {
			maxHeight = -$('#matt .gallery-scroller').innerHeight() + ($(window).innerHeight());
			that.mattPhotoTimeline = new TimelineLite({paused: true});
			that.mattPhotoTimeline.to($('#matt .gallery-scroller'), 300, { y: maxHeight + 'px', force3D: true, ease: Quad.easeInOut });
		});

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
		var $currentSlide = $('.carousel-slide-active'),
			$carouselPagination = $('.swiper-pagination');

		view.currentSlideId = $currentSlide[0].id;

		$currentSlide.hasClass('light-mode') ? $carouselPagination.addClass('light-mode') : $carouselPagination.removeClass('light-mode');
		$currentSlide.hasClass('no-pagination') ? $carouselPagination.addClass('transparent-mode') : $carouselPagination.removeClass('transparent-mode');

		if (view.currentSlideId === 'invitation') {
			view.weddingCountdown.initCountdownClock();
		} else {
			view.weddingCountdown.destroy();
		}

		swiper.disableMousewheelControl();
	};

	view.handleCarouselSlideChangeEnd = function(swiper) {

		if (view.currentSlideId === 'gallery') {
			if (typeof view.swiperGallery === 'undefined') {
				view.swiperGallery = new Swiper('.swiper-container-gallery', {
					pagination: '.swiper-pagination-gallery',
					direction: 'horizontal',
					slidesPerView: 1,
					effect: 'fade',
					paginationClickable: true,
					slideActiveClass: 'gallery-slide-active',
					spaceBetween: 0,
					simulateTouch: false,
					keyboardControl: true,
					mousewheelControl: true,
					mousewheelForceToAxis: true,
					nextButton: '.swiper-button-next',
					prevButton: '.swiper-button-prev'
				});
			}
		}

		view.swiperLock = setTimeout(function() {
			swiper.enableMousewheelControl();
		}, 600);
	};

	view.setupCarousel = function() {
		var that = this;
		view.swiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			direction: 'vertical',
			slidesPerView: 1,
			slideActiveClass: 'carousel-slide-active',
			paginationClickable: true,
			spaceBetween: 0,
			mousewheelControl: true,
			keyboardControl: true,
			simulateTouch: false,
			mousewheelForceToAxis: true,
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

		$('#quote').mousemove(function(e) {
			movementMatrix = parallaxFactory.getMatrix(this, e);

			$('#quote-landing').css('transform', 'perspective(600px) translate3d(' + movementMatrix.X/2 + 'px, ' + movementMatrix.Y/2 + 'px, -10px)');
			$('#quote cite').css('transform', 'perspective(600px) translate3d(' + -movementMatrix.X/12 + 'px, ' + -movementMatrix.Y/12 + 'px, 0)');
		});

		$('#location').mousemove(function(e) {
			movementMatrix = parallaxFactory.getMatrix(this, e);

			$('#location-landing').css('transform', 'perspective(600px) translate3d(' + movementMatrix.X/2 + 'px, ' + movementMatrix.Y/2 + 'px, -10px)');
		});

		$('#seeyou').mousemove(function(e) {
			movementMatrix = parallaxFactory.getMatrix(this, e);

			$('#seeyou-landing').css('transform', 'perspective(600px) translate3d(' + movementMatrix.X/5 + 'px, ' + movementMatrix.Y/5 + 'px, -10px)');
		});
	};

	view.bind = function() {
		var that = this;
		this.setupRSVPForm();
		this.setupCarousel();
		this.setupParallaxEffects();
		this.weddingCountdown = new Countdown('2017-06-23', $('#invitation .countdown'));

		$('#matt .gallery-movingUp-area').hover(function () {
			view.mattPhotoTimeline.reverse();
			view.mattPhotoTimeline.timeScale(44);
		}, function () {
			view.mattPhotoTimeline.stop();
			view.mattPhotoTimeline.timeScale(1);
		});

		$('#kriza .gallery-movingUp-area').hover(function () {
			view.krizaPhotoTimeline.reverse();
			view.krizaPhotoTimeline.timeScale(44);
		}, function () {
			view.krizaPhotoTimeline.stop();
			view.krizaPhotoTimeline.timeScale(1);
		});

		$('#matt .gallery-movingDown-area').hover(function () {
			view.mattPhotoTimeline.play();
			view.mattPhotoTimeline.timeScale(44);
		}, function () {
			view.mattPhotoTimeline.stop();
			view.mattPhotoTimeline.timeScale(1);
		});

		$('#kriza .gallery-movingDown-area').hover(function () {
			view.krizaPhotoTimeline.play();
			view.krizaPhotoTimeline.timeScale(44);
		}, function () {
			view.krizaPhotoTimeline.stop();
			view.krizaPhotoTimeline.timeScale(1);
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
