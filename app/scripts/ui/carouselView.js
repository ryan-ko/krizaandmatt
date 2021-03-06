rko.carouselView = (function(window) {

	var view = {
		swiper: undefined,
		swiperGallery: undefined,
		krizaTimeline: undefined,
		swiperLock: undefined,
		bindables: {
		},
		weddingCountdown: undefined,
		krizaPhotoTimeline: undefined,
		mattPhotoTimeline: undefined,
		currentSlideId: undefined
	},
	utils = new Utils();

	view.init = function() {

		$('body').removeClass().addClass('carouselMode');

		// Temp solution
		$(document).on('keyup keypress', function(e) {
			var keyCode = e.keyCode || e.which;
			if (keyCode === 13) {
				e.preventDefault();
				return false;
			}
		});

		var that = this,
			maxHeight;

		// $('#landing').imagesLoaded(function() {
		setTimeout(function() {
			$('#main').removeClass('loading');
		}, 100);

		if (utils.isTouchDevice()) {
			$('#main').removeClass('entranceMode');
			that.bind();
		} else {
			$('#landing .km-logo').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
				if (e.type === 'transitionend') {
					$('#main').removeClass('entranceMode');
					that.bind();
				}
			});
		}
		$('#kriza .gallery-scroller').imagesLoaded( function() {
			maxHeight = -$('#kriza .gallery-scroller').innerHeight() + ($(window).innerHeight());
			that.krizaPhotoTimeline = new TimelineLite({paused: true});
			that.krizaPhotoTimeline.to($('#kriza .gallery-scroller'), 300, { y: maxHeight + 'px', force3D: true, ease: Linear.easeNone });
		});
		$('#matt .gallery-scroller').imagesLoaded( function() {
			maxHeight = -$('#matt .gallery-scroller').innerHeight() + ($(window).innerHeight());
			that.mattPhotoTimeline = new TimelineLite({paused: true});
			that.mattPhotoTimeline.to($('#matt .gallery-scroller'), 300, { y: maxHeight + 'px', force3D: true, ease: Linear.easeNone });
		});
	};

	view.unbindRSVPForm = function() {
		this.bindables.$plusOneCheckbox.off();
		this.bindables.$rsvpForm.off();
	};

	view.handleCarouselSlideChangeStart = function(swiper) {
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

	view.handleCarouselSlideChangeEnd = function(swiper) {
		if (swiper.activeIndex == (swiper.slides.length -1)) {
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

		view.swiperLock = setTimeout(function() {
			swiper.enableMousewheelControl();
		}, 600);
	};

	view.setupCarousel = function() {
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
			onInit: function(swiper) {
				setTimeout(function() {
					$('.swiper-pagination').addClass('active');
				}, 10);
			},
			onSlideChangeStart: function(swiper) {
				that.handleCarouselSlideChangeStart(swiper);
			},
			onSlideChangeEnd: function(swiper) {
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
		this.setupCarousel();

		if (!utils.isTouchDevice()) {
			this.setupParallaxEffects();
			this.weddingCountdown = new Countdown('2017-06-23', $('#invitation .countdown'));
		}

		$('#backToTop').on('click', function() {
			view.swiper.slideTo(0, 2000);
		});

		$('#menu-btn, #slider-menu-btn').on('click', function() {
			if ($('body').hasClass('menuMode')) {
				$('body').removeClass('menuMode');
			} else {
				$('#menu').scrollTop(0);
				$('body').addClass('menuMode');
			}
		});

		$('.rsvp-button-external').on('click', function() {
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

}(window));