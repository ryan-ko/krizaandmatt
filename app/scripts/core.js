RKO.CORE = (function(window) {
	var core = {
		swiper: undefined,
		swiperGallery: undefined,
		krizaTimeline: undefined,
		swiperLock: undefined
	},
	countdown = RKO.COUNTDOWN;

	core.bind = function() {

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
			core.krizaTimeline.reverse();
			core.krizaTimeline.timeScale(14);
		}, function () {
			core.krizaTimeline.stop();
			core.krizaTimeline.timeScale(1);
		});

		$('.gallery-movingDown-area').hover(function () {
			core.krizaTimeline.play();
			core.krizaTimeline.timeScale(14);
		}, function () {
			core.krizaTimeline.stop();
			core.krizaTimeline.timeScale(1);
		});

		$('.gallery-movingUp-area').mousedown(function () {
			core.krizaTimeline.timeScale(60);
			console.log('hit');
		});

		$('.gallery-movingUp-area').mouseup(function () {
			core.krizaTimeline.timeScale(14);
			console.log('hit');
		});

		$('.gallery-movingDown-area').mousedown(function () {
			core.krizaTimeline.timeScale(60);
			console.log('hit');
		});

		$('.gallery-movingDown-area').mouseup(function () {
			core.krizaTimeline.timeScale(14);
			console.log('hit');
		});

		core.swiper = new Swiper('.swiper-container', {
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
					if (typeof core.krizaTimeline === 'undefined') {
						core.krizaTimeline = new TimelineLite();
						core.krizaTimeline.to($('.gallery-scroller'), 300, {y:'-100%'});
						core.krizaTimeline.stop();
					} else {
						core.krizaTimeline.restart();
						core.krizaTimeline.stop();
					}
				} else {
					$('.kriza-gallery-container .gallery-scroller').removeAttr('style');
					if (typeof core.krizaTimeline !== 'undefined') {
						core.krizaTimeline.stop();
						core.krizaTimeline.restart();
					}
				}
				swiper.disableMousewheelControl();
			},
			onSlideChangeEnd: function(swiper) {
				if (swiper.activeIndex === 2) {
					if (typeof core.swiperGallery === 'undefined') {
						core.swiperGallery = new Swiper('.swiper-container-gallery', {
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

				core.swiperLock = setTimeout(function() {
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

		countdown.initCountdownClock('2017-06-23');
	};

	return core;

}(window));