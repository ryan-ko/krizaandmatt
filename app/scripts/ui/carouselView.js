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