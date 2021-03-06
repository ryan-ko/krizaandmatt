'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
	function Utils() {
		_classCallCheck(this, Utils);

		this.keysmap = {
			escape: 27
		};
	}

	_createClass(Utils, [{
		key: 'convertToTwoDigits',
		value: function convertToTwoDigits(value) {
			if (value < 10) {
				return '0' + value;
			} else {
				return value;
			}
		}
	}, {
		key: 'isCharacterKeyPress',
		value: function isCharacterKeyPress(evt) {
			if (typeof evt.which === 'undefined') {
				return true;
			} else if (typeof evt.which === 'number' && evt.which > 0) {
				return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8;
			}
			return false;
		}
	}, {
		key: 'isTouchDevice',
		value: function isTouchDevice() {
			return typeof window.ontouchstart !== 'undefined';
		}
	}, {
		key: 'isValidateEmail',
		value: function isValidateEmail(email) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		}
	}, {
		key: 'isValidateFirstAndLastName',
		value: function isValidateFirstAndLastName(name) {
			var spaceCount = name.split(' ').length;
			if (spaceCount === 1) {
				return false;
			} else {
				return true;
			}
		}
	}, {
		key: 'disableDefaultTouch',
		value: function disableDefaultTouch() {
			// Mimic native iOS UI interactions
			// http://stackoverflow.com/questions/10238084/ios-safari-how-to-disable-overscroll-but-allow-scrollable-divs-to-scroll-norma
			$(document).on('touchmove', function (e) {
				e.preventDefault();
			});

			var scrolling = false;
			// Uses body because jquery on events are called off of the element they are
			// added to, so bubbling would not work if we used document instead.
			$('body').on('touchstart', '.scrollable', function (e) {
				// Only execute the below code once at a time
				if (!scrolling) {
					scrolling = true;
					if (e.currentTarget.scrollTop === 0) {
						e.currentTarget.scrollTop = 1;
					} else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
						e.currentTarget.scrollTop -= 1;
					}
					scrolling = false;
				}
			});

			// Prevents preventDefault from being called on document if it sees a scrollable div
			$('body').on('touchmove', '.scrollable', function (e) {
				e.stopPropagation();
			});
		}
	}]);

	return Utils;
}();

var ParallaxFactory = function () {
	function ParallaxFactory(maxDeg) {
		_classCallCheck(this, ParallaxFactory);

		this.parallaxPackage = {};
		this.maxDeg = maxDeg;
	}

	_createClass(ParallaxFactory, [{
		key: 'getMatrix',
		value: function getMatrix(context, e) {
			var that = this;
			var halfW = context.clientWidth / 2;
			var halfH = context.clientHeight / 2;
			var coorX = halfW - (e.pageX - context.offsetLeft);
			var coorY = halfH - (e.pageY - context.offsetTop);
			that.parallaxPackage.degX = coorY / halfH * that.maxDeg + 'deg';
			that.parallaxPackage.degY = coorX / halfW * -that.maxDeg + 'deg';
			that.parallaxPackage.X = (e.pageX * -1 / 2 + halfW / 2) / 8;
			that.parallaxPackage.Y = (e.pageY * -1 / 2 + halfH / 2) / 8;

			return that.parallaxPackage;
		}
	}]);

	return ParallaxFactory;
}();

var Countdown = function () {
	function Countdown(endtime, $target) {
		_classCallCheck(this, Countdown);

		this.endtime = endtime;
		this.$target = $target;
		this.utils = new Utils();
		this.timeinterval = undefined;
	}

	_createClass(Countdown, [{
		key: 'getTimeRemaining',
		value: function getTimeRemaining(endtime) {
			var t = Date.parse(endtime) - Date.parse(new Date());
			var seconds = Math.floor(t / 1000 % 60);
			var minutes = Math.floor(t / 1000 / 60 % 60);
			var hours = Math.floor(t / (1000 * 60 * 60) % 24);
			var days = Math.floor(t / (1000 * 60 * 60 * 24));

			return {
				'total': t,
				'days': this.utils.convertToTwoDigits(days),
				'hours': this.utils.convertToTwoDigits(hours),
				'minutes': this.utils.convertToTwoDigits(minutes),
				'seconds': this.utils.convertToTwoDigits(seconds)
			};
		}
	}, {
		key: 'render',
		value: function render() {
			var t = this.getTimeRemaining(this.endtime);
			this.$target.children('.days').html(t.days);
			this.$target.children('.hours').html(t.hours);
			this.$target.children('.mins').html(t.minutes);
			this.$target.children('.secs').html(t.seconds);
			if (t.total <= 0) {
				clearInterval(this.timeinterval);
				this.$target.hide();
			}
		}
	}, {
		key: 'initCountdownClock',
		value: function initCountdownClock() {
			this.render();
			this.timeinterval = setInterval(function () {
				this.render();
			}.bind(this), 1000);

			setTimeout(function () {
				this.$target.removeClass('hidden');
			}.bind(this), 500);
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			clearInterval(this.timeinterval);
			this.$target.addClass('hidden');
		}
	}]);

	return Countdown;
}();

rko.carouselView = function (window) {

	var view = {
		swiper: undefined,
		swiperGallery: undefined,
		krizaTimeline: undefined,
		swiperLock: undefined,
		bindables: {},
		weddingCountdown: undefined,
		krizaPhotoTimeline: undefined,
		mattPhotoTimeline: undefined,
		currentSlideId: undefined
	},
	    utils = new Utils();

	view.init = function () {

		$('body').removeClass().addClass('carouselMode');

		// Temp solution
		$(document).on('keyup keypress', function (e) {
			var keyCode = e.keyCode || e.which;
			if (keyCode === 13) {
				e.preventDefault();
				return false;
			}
		});

		var that = this,
		    maxHeight;

		// $('#landing').imagesLoaded(function() {
		setTimeout(function () {
			$('#main').removeClass('loading');
		}, 100);

		if (utils.isTouchDevice()) {
			$('#main').removeClass('entranceMode');
			that.bind();
		} else {
			$('#landing .km-logo').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (e) {
				if (e.type === 'transitionend') {
					$('#main').removeClass('entranceMode');
					that.bind();
				}
			});
		}
		$('#kriza .gallery-scroller').imagesLoaded(function () {
			maxHeight = -$('#kriza .gallery-scroller').innerHeight() + $(window).innerHeight();
			that.krizaPhotoTimeline = new TimelineLite({ paused: true });
			that.krizaPhotoTimeline.to($('#kriza .gallery-scroller'), 300, { y: maxHeight + 'px', force3D: true, ease: Linear.easeNone });
		});
		$('#matt .gallery-scroller').imagesLoaded(function () {
			maxHeight = -$('#matt .gallery-scroller').innerHeight() + $(window).innerHeight();
			that.mattPhotoTimeline = new TimelineLite({ paused: true });
			that.mattPhotoTimeline.to($('#matt .gallery-scroller'), 300, { y: maxHeight + 'px', force3D: true, ease: Linear.easeNone });
		});
	};

	view.unbindRSVPForm = function () {
		this.bindables.$plusOneCheckbox.off();
		this.bindables.$rsvpForm.off();
	};

	view.handleCarouselSlideChangeStart = function (swiper) {
		var $currentSlide = $('.carousel-slide-active'),
		    $carouselPagination = $('.swiper-pagination'),
		    $menuBtn = $('#menu-btn'),
		    $menu = $('#menu');

		view.currentSlideId = $currentSlide[0].id;

		if ($currentSlide.hasClass('light-mode')) {
			$menuBtn.addClass('light-mode');
			$menu.addClass('light-mode');
		} else {
			$menuBtn.removeClass('light-mode');
			$menu.removeClass('light-mode');
		}

		if ($currentSlide.hasClass('light-mode-mobile')) {
			$menuBtn.addClass('light-mode-mobile');
			$menu.addClass('light-mode-mobile');
		} else {
			$menuBtn.removeClass('light-mode-mobile');
			$menu.removeClass('light-mode-mobile');
		}

		if ($currentSlide.hasClass('dark-mode-mobile')) {
			$menuBtn.addClass('dark-mode-mobile');
			$menu.addClass('dark-mode-mobile');
		} else {
			$menuBtn.removeClass('dark-mode-mobile');
			$menu.removeClass('dark-mode-mobile');
		}

		$currentSlide.hasClass('light-mode') ? $carouselPagination.addClass('light-mode') : $carouselPagination.removeClass('light-mode');
		$currentSlide.hasClass('no-pagination') ? $carouselPagination.addClass('transparent-mode') : $carouselPagination.removeClass('transparent-mode');

		if (view.currentSlideId === 'invitation') {
			if (typeof view.weddingCountdown !== 'undefined') {
				view.weddingCountdown.initCountdownClock();
			}
		} else {
			if (typeof view.weddingCountdown !== 'undefined') {
				view.weddingCountdown.destroy();
			}
		}

		swiper.disableMousewheelControl();

		if (view.currentSlideId === 'kriza') {
			view.mattPhotoTimeline.stop();
		}

		if (view.currentSlideId === 'matt') {
			view.krizaPhotoTimeline.stop();
		}
	};

	view.handleCarouselSlideChangeEnd = function (swiper) {
		if (swiper.activeIndex == swiper.slides.length - 1) {
			$('#backToTop').addClass('show');
		} else {
			$('#backToTop').removeClass('show');
		}

		if (view.currentSlideId === 'gallery') {
			view.swiperGallery.startAutoplay();
		} else {
			view.swiperGallery.stopAutoplay();
		}

		if (view.currentSlideId === 'kriza') {
			view.personalGallery.startAutoplay();
		} else {
			view.personalGallery.stopAutoplay();
		}

		if (view.currentSlideId === 'matt') {
			view.personalGallery2.startAutoplay();
		} else {
			view.personalGallery2.stopAutoplay();
		}

		view.swiperLock = setTimeout(function () {
			swiper.enableMousewheelControl();
		}, 600);
	};

	view.setupCarousel = function () {
		var that = this;

		view.personalGallery = new Swiper('.swiper-container-personalGallery', {
			direction: 'horizontal',
			slidesPerView: 1,
			effect: 'fade',
			slideActiveClass: 'gallery-slide-active',
			spaceBetween: 0,
			speed: 700,
			autoplay: 3000,
			autoplayDisableOnInteraction: false,
			simulateTouch: false,
			keyboardControl: false,
			loop: true,
			noSwiping: true,
			mousewheelForceToAxis: true
		});

		view.personalGallery.stopAutoplay();

		view.personalGallery2 = new Swiper('.swiper-container-personalGallery2', {
			direction: 'horizontal',
			slidesPerView: 1,
			effect: 'fade',
			paginationClickable: true,
			slideActiveClass: 'gallery-slide-active',
			spaceBetween: 0,
			speed: 700,
			autoplay: 3000,
			autoplayDisableOnInteraction: false,
			simulateTouch: false,
			keyboardControl: false,
			noSwiping: true,
			loop: true,
			mousewheelForceToAxis: true
		});

		view.personalGallery2.stopAutoplay();

		view.swiperGallery = new Swiper('.swiper-container-gallery', {
			pagination: '.swiper-pagination-gallery',
			direction: 'horizontal',
			slidesPerView: 1,
			effect: 'fade',
			paginationClickable: true,
			slideActiveClass: 'gallery-slide-active',
			spaceBetween: 0,
			speed: 700,
			autoplay: 3000,
			autoplayDisableOnInteraction: false,
			simulateTouch: false,
			keyboardControl: true,
			mousewheelControl: true,
			mousewheelForceToAxis: true,
			nextButton: '.swiper-button-next',
			prevButton: '.swiper-button-prev'
		});

		view.swiperGallery.stopAutoplay();

		view.swiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			direction: 'vertical',
			slidesPerView: 1,
			slideActiveClass: 'carousel-slide-active',
			paginationClickable: true,
			spaceBetween: 0,
			speed: 700,
			mousewheelControl: true,
			keyboardControl: true,
			simulateTouch: false,
			mousewheelForceToAxis: true,
			mousewheelSensitivity: 0.5,
			onInit: function onInit(swiper) {
				setTimeout(function () {
					$('.swiper-pagination').addClass('active');
				}, 10);
			},
			onSlideChangeStart: function onSlideChangeStart(swiper) {
				that.handleCarouselSlideChangeStart(swiper);
			},
			onSlideChangeEnd: function onSlideChangeEnd(swiper) {
				that.handleCarouselSlideChangeEnd(swiper);
			}
		});

		// view.krizaMobileSwiperGallery = new Swiper('.kriza-mobile-gallery', {
		// 	pagination: '.swiper-pagination-gallery',
		// 	direction: 'horizontal',
		// 	slidesPerView: 3,
		// 	effect: 'fade',
		// 	paginationClickable: true,
		// 	spaceBetween: 30,
		// 	speed: 700,
		// 	autoplayDisableOnInteraction: false,
		// 	simulateTouch: false,
		// 	keyboardControl: true,
		// 	mousewheelForceToAxis: true
		// });
	};

	view.setupParallaxEffects = function () {
		var parallaxFactory = new ParallaxFactory(5),
		    movementMatrix,
		    that = this;

		$('#landing').mousemove(function (e) {
			movementMatrix = parallaxFactory.getMatrix(this, e);

			$('#parallax-landing').css('transform', 'translate3d(' + movementMatrix.X / 2 + 'px, ' + movementMatrix.Y / 2 + 'px, -200px)');
			$('#landing .km-logo').css('transform', 'perspective(200px) translate3d(' + -movementMatrix.X / 12 + 'px, ' + -movementMatrix.Y / 12 + 'px, 0)');
		});

		$('#quote').mousemove(function (e) {
			movementMatrix = parallaxFactory.getMatrix(this, e);

			$('#quote-landing').css('transform', 'perspective(600px) translate3d(' + movementMatrix.X / 2 + 'px, ' + movementMatrix.Y / 2 + 'px, -10px)');
		});

		$('#location').mousemove(function (e) {
			movementMatrix = parallaxFactory.getMatrix(this, e);

			$('#location-landing').css('transform', 'perspective(600px) translate3d(' + movementMatrix.X / 2 + 'px, ' + movementMatrix.Y / 2 + 'px, -10px)');
		});

		$('#seeyou').mousemove(function (e) {
			movementMatrix = parallaxFactory.getMatrix(this, e);

			$('#seeyou-landing').css('transform', 'perspective(600px) translate3d(' + movementMatrix.X / 5 + 'px, ' + movementMatrix.Y / 5 + 'px, -10px)');
		});
	};

	view.bind = function () {
		var that = this;
		this.setupCarousel();

		if (!utils.isTouchDevice()) {
			this.setupParallaxEffects();
			this.weddingCountdown = new Countdown('2017-06-23', $('#invitation .countdown'));
		}

		$('#backToTop').on('click', function () {
			view.swiper.slideTo(0, 2000);
		});

		$('#menu-btn, #slider-menu-btn').on('click', function () {
			if ($('body').hasClass('menuMode')) {
				$('body').removeClass('menuMode');
			} else {
				$('#menu').scrollTop(0);
				$('body').addClass('menuMode');
			}
		});

		$('.rsvp-button-external').on('click', function () {
			if (!$('body').hasClass('menuMode')) {
				$('#menu-btn').trigger('click');
			}
		});

		$('#matt .gallery-movingUp-area').hover(function () {
			view.mattPhotoTimeline.reverse();
			view.mattPhotoTimeline.timeScale(25);
		}, function () {
			view.mattPhotoTimeline.stop();
			view.mattPhotoTimeline.timeScale(1);
		});

		$('#kriza .gallery-movingUp-area').hover(function () {
			view.krizaPhotoTimeline.reverse();
			view.krizaPhotoTimeline.timeScale(25);
		}, function () {
			view.krizaPhotoTimeline.stop();
			view.krizaPhotoTimeline.timeScale(1);
		});

		$('#matt .gallery-movingDown-area').hover(function () {
			view.mattPhotoTimeline.play();
			view.mattPhotoTimeline.timeScale(25);
		}, function () {
			view.mattPhotoTimeline.stop();
			view.mattPhotoTimeline.timeScale(1);
		});

		$('#kriza .gallery-movingDown-area').hover(function () {
			view.krizaPhotoTimeline.play();
			view.krizaPhotoTimeline.timeScale(25);
		}, function () {
			view.krizaPhotoTimeline.stop();
			view.krizaPhotoTimeline.timeScale(1);
		});
	};

	return view;
}(window);
rko.app = function (window) {

	var app = {
		previousMode: undefined,
		modeLabel: 'introMode',
		$lockIcon: $('.lock-icon'),
		$logo: $('.logo'),
		$background: $('#parallax-auth'),
		$viewContainer: $('#lock'),
		helloMessages: ['Hello!', '안녕하세요!']
	},
	    carouselView = rko.carouselView,
	    utils = new Utils();

	app.init = function () {
		utils.disableDefaultTouch();

		setTimeout(function () {
			app.$viewContainer.removeClass('loading');
		}, 100);

		setTimeout(function () {
			$('.password-hint').html(app.helloMessages[Math.floor(Math.random() * app.helloMessages.length)]);
			carouselView.init();
			document.activeElement.blur();
		}, 4000);

		var that = this;
	};

	return app;
}(window);