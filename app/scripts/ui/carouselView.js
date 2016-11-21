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

		this.krizaPhotoTimeline = new TimelineLite({paused: true});
		this.krizaPhotoTimeline.to($('#kriza .gallery-scroller'), 300, { y: '-100%' });

		this.mattPhotoTimeline = new TimelineLite({paused: true});
		this.mattPhotoTimeline.to($('#matt .gallery-scroller'), 300, { y: '-100%' });

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

		swiper.disableMousewheelControl();
	};

	view.handleCarouselSlideChangeEnd = function(swiper) {
		// var $currentSlide = $('.carousel-slide-active'),
		// 	$carouselPagination = $('.swiper-pagination'),
		// 	currentSlideId = $currentSlide[0].id;

		// if (currentSlideId === 'kriza') {
		// 	$('.gallery-scroller').removeAttr('style');
		// 	view.mattPhotoTimeline.restart();
		// 	view.mattPhotoTimeline.stop();
		// }

		// if (currentSlideId === 'matt') {
		// 	$('.gallery-scroller').removeAttr('style');
		// 	view.krizaPhotoTimeline.restart();
		// 	view.krizaPhotoTimeline.stop();
		// }

		if (swiper.activeIndex === 2) {
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
					mousewheelInvert: true
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
			if (view.currentSlideId === 'kriza') {
				view.krizaPhotoTimeline.reverse();
				view.krizaPhotoTimeline.timeScale(14);
			} else if (view.currentSlideId === 'matt') {
				view.mattPhotoTimeline.reverse();
				view.mattPhotoTimeline.timeScale(14);
			}
		}, function () {
			if (view.currentSlideId === 'kriza') {
				view.krizaPhotoTimeline.stop();
				view.krizaPhotoTimeline.timeScale(1);
			} else if (view.currentSlideId === 'matt') {
				view.mattPhotoTimeline.stop();
				view.mattPhotoTimeline.timeScale(1);
			}
		});

		$('.gallery-movingDown-area').hover(function () {
			if (view.currentSlideId === 'kriza') {
				view.krizaPhotoTimeline.play();
				view.krizaPhotoTimeline.timeScale(14);
			} else if (view.currentSlideId === 'matt') {
				view.mattPhotoTimeline.play();
				view.mattPhotoTimeline.timeScale(14);
			}
		}, function () {
			if (view.currentSlideId === 'kriza') {
				view.krizaPhotoTimeline.stop();
				view.krizaPhotoTimeline.timeScale(1);
			} else if (view.currentSlideId === 'matt') {
				view.mattPhotoTimeline.stop();
				view.mattPhotoTimeline.timeScale(1);
			}
		});
	};

	return view;

}(window));