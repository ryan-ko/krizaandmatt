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
	};

	view.init = function(html, menuHtml) {
		$('#main').html(html);
		$('#menu').html(menuHtml);

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
		$('#landing .logo').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
			$('#main').removeClass('entranceMode');
			that.bind();
		});
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
	};

	view.setupRSVPForm = function() {
		var $plusOneCheckbox = $('#plusone-checkbox-result'),
			$plusOneInput = $('#plusone-input'),
			$rsvpForm = $('#rsvp-form'),
			$plusOneCheckboxInput = $('#plusone-checkbox');

		$plusOneCheckboxInput.on('click', function(e) {
			if ($(e.target).is(':checked')) {
				$plusOneCheckbox.val('Yes');
				$plusOneInput.removeClass('hidden');
			} else {
				$plusOneCheckbox.val('No');
				$plusOneInput.addClass('hidden');
			}
		});

		$rsvpForm.submit(function(e) {
			var url = $(this).attr('action'), data;
			$.ajax({
				type: 'POST',
				url: url,
				data: $(this).serialize(),
				success: function(data) {
					data = $.parseJSON(data);
					if (data.result === 'success') {
						$('#rsvp-thankyou').addClass('show');
						setTimeout(function() {
							$('#rsvp-thankyou').removeClass('show');
						}, 5000);
						$('#rsvp-submit-btn').hide();
						$('#rsvp-form input').prop('disabled', true);
						$('#rsvp-form').addClass('disabled');
					}
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
			$carouselPagination = $('.swiper-pagination'),
			$menuBtn = $('#menu-btn'),
			$menu = $('#menu');

		view.currentSlideId = $currentSlide[0].id;

		if ($currentSlide.hasClass('light-mode') || $currentSlide.hasClass('no-pagination')) {
			$menuBtn.addClass('light-mode');
			$menu.addClass('light-mode');
		} else {
			$menuBtn.removeClass('light-mode');
			$menu.removeClass('light-mode');
		}

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
			} else {
				view.swiperGallery.startAutoplay();
			}
		} else {
			if (typeof view.swiperGallery !== 'undefined') {
				view.swiperGallery.stopAutoplay();
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
			speed: 700,
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

		$('#menu-btn').on('click', function() {
			console.log('hit');
			if($('body').hasClass('menuMode')) {
				$('body').removeClass('menuMode');
			} else {
				$('body').addClass('menuMode');
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