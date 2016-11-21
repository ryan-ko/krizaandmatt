rko.carouselView = (function(window) {
	var view = {
		swiper: undefined,
		swiperGallery: undefined,
		krizaTimeline: undefined,
		swiperLock: undefined
	};

	view.bind = function() {

		var $plusOneCheckbox = $('#plusone-checkbox-result'),
			$plusOneInput = $('#plusone-input');

		$(document).on('click', '#plusone-checkbox', function(e) {
			if ($(e.target).is(':checked')) {
				$plusOneCheckbox.val('Yes');
				$plusOneInput.removeClass('hidden');
			} else {
				$plusOneCheckbox.val('No');
				$plusOneInput.addClass('hidden');
			}
		});

		$('#rsvp-form').submit(function(e) {
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
			},
			onSlideChangeEnd: function(swiper) {
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
			}
		});

		$('.gallery-movingDown-area').on('click', function() {
		});

		$('#landing').mousemove(function(e) {
			var halfW = ( this.clientWidth / 2 );
			var halfH = ( this.clientHeight / 2 );
			var coorX = ( halfW - ( event.pageX - this.offsetLeft ) );
			var coorY = ( halfH - ( event.pageY - this.offsetTop ) );

			var degX  = ( ( coorY / halfH ) * 15 ) + 'deg';
			var degY  = ( ( coorX / halfW ) * -15 ) + 'deg';

			var amountMovedX = ((e.pageX * -1 / 2) + halfW / 2) / 8;
			var amountMovedY = ((e.pageY * -1 / 2) + halfH / 2) / 8;

			$('#parallax-landing').css('transform', 'translate3d(' + amountMovedX/2 + 'px, ' + amountMovedY/2 + 'px, -200px)');
			$('#landing .km-logo').css('transform', 'perspective(200px) translate3d(' + -amountMovedX/12 + 'px, ' + -amountMovedY/12 + 'px, 0)');
		});

		var countdown = new Countdown('2017-06-23', $('#invitation .countdown'));
		countdown.initCountdownClock();
	};

	view.init = function(html) {
		$('#main').html(html);
		this.bind();
		$('body').removeClass().addClass('carouselMode');
	};

	return view;

}(window));