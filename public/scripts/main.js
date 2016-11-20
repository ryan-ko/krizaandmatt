function Utils() {}

Utils.prototype = {
	convertToTwoDigits: function(value) {
		if (value < 10) {
			return '0' + value;
		} else {
			return value;
		}
	},
	isCharacterKeyPress: function (evt) {
		if (typeof evt.which == "undefined") {
			return true;
		} else if (typeof evt.which == "number" && evt.which > 0) {
			return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8;
		}
		return false;
	}
};
RKO.PARALLAX_FACTORY = (function(window) {
	var parallax = {
		amountMovedX: undefined,
		amountMovedY: undefined,
		degX: undefined,
		degY: undefined
	};

	parallax.onMove = function(context, e, maxDeg) {
		var halfW = ( context.clientWidth / 2 );
		var halfH = ( context.clientHeight / 2 );
		var coorX = ( halfW - ( e.pageX - context.offsetLeft ) );
		var coorY = ( halfH - ( e.pageY - context.offsetTop ) );
		parallax.degX  = ( ( coorY / halfH ) * maxDeg ) + 'deg';
		parallax.degY  = ( ( coorX / halfW ) * -(maxDeg) ) + 'deg';
		parallax.amountMovedX = ((e.pageX * -1 / 2) + halfW / 2) / 8;
		parallax.amountMovedY = ((e.pageY * -1 / 2) + halfH / 2) / 8;
	};

	return parallax;
}(window));
RKO.COUNTDOWN = (function(window) {
	var countdown = {
	},
	utils = new Utils();

	countdown.initCountdownClock = function(endtime) {
		var timeinterval = setInterval(function(){
			var t = countdown.getTimeRemaining(endtime);
			$('#invitation .days').html(t.days);
			$('#invitation .hours').html(t.hours);
			$('#invitation .mins').html(t.minutes);
			$('#invitation .secs').html(t.seconds);
			if (t.total <= 0) {
				clearInterval(timeinterval);
			}
		}, 1000);
	};

	countdown.getTimeRemaining = function(endtime) {
		var t = Date.parse(endtime) - Date.parse(new Date());
		var seconds = Math.floor( (t/1000) % 60 );
		var minutes = Math.floor( (t/1000/60) % 60 );
		var hours = Math.floor( (t/(1000*60*60)) % 24 );
		var days = Math.floor( t/(1000*60*60*24) );

		return {
			'total': t,
			'days': utils.convertToTwoDigits(days),
			'hours': utils.convertToTwoDigits(hours),
			'minutes': utils.convertToTwoDigits(minutes),
			'seconds': utils.convertToTwoDigits(seconds)
		};
	};

	return countdown;

}(window));
RKO.CORE = (function(window) {
	var core = {
		swiper: undefined,
		swiperGallery: undefined,
		krizaTimeline: undefined,
		swiperLock: undefined
	};

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
		countdown = RKO.COUNTDOWN;
		countdown.initCountdownClock('2017-06-23');
	};

	return core;

}(window));
RKO.LOCK = (function(window) {
	var lock = {
	},
	utils = new Utils(),
	core = RKO.CORE;

	lock.bind = function() {
		$('#secretword-input').keydown(function(e) {
			$('#login-error-msg').removeClass('show');
		});

		$(document).keydown(function(e) {
			if ($('body').hasClass('introMode') && utils.isCharacterKeyPress(e) && e.keyCode !== 27) {
				$('body').removeClass().addClass('passwordMode');
				$('#secretword-input').focus();
				console.log('Into password mode, leaving introMode');
			}

			if ($('body').hasClass('passwordMode')) {
				if (e.keyCode === 27) {
					$('body').removeClass().addClass('introMode');
					$('#secretword-input').val('');
					console.log('Into introMode, leaving passwordMode');
				}
			}
		});

		$('#login-form').submit(function(e) {
			var url = $(this).attr('action');
			$.ajax({
				type: 'POST',
				url: url,
				data: $(this).serialize(),
				success: function(data) {
					var data = $.parseJSON(data);
					if (data.result === 'success') {
						$('#main').html(data.html);
						core.bind();
						$('body').removeClass().addClass('invitationMode');
						$(document).unbind('keydown');
					} else {
						$('#login-error-msg').addClass('show');
					}
				}
			});
			e.preventDefault();
		});
	};

	lock.init = function() {
		lock.bind();
	};

	return lock;
}(window));
RKO.APP = (function(window) {

	var app = {},
	lock = RKO.LOCK,
	parallaxFactory = RKO.PARALLAX_FACTORY;

	app.init = function() {
		lock.init();

		$('#auth').mousemove(function(e) {
			parallaxFactory.onMove(this, e, 5);

			$('#parallax-auth').css('transform', 'perspective(1000px) translate3d(' + parallaxFactory.amountMovedX/2 + 'px, ' + parallaxFactory.amountMovedY/2 + 'px, -20px)');
			$('.lock-icon').css('transform', 'perspective(40px) translate3d(' + -parallaxFactory.amountMovedX/4 + 'px, ' + -parallaxFactory.amountMovedY/4 + 'px, 0) rotateX(' + parallaxFactory.degX +') rotateY('+ parallaxFactory.degY +')');
			$('.logo').css('transform', 'perspective(500px) translate3d(' + -parallaxFactory.amountMovedX/8 + 'px, ' + -parallaxFactory.amountMovedY/8 + 'px, 0) rotateX(' + parallaxFactory.degX + ') rotateY(' + parallaxFactory.degY + ')');
		});
	};

	return app;

}(window));
