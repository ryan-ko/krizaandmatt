'use strict';

RKO.APP = (function(window) {

	var app = {
	};

	app.bind = function() {
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

		var swiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			direction: 'vertical',
			slidesPerView: 1,
			paginationClickable: true,
			spaceBetween: 30,
			mousewheelControl: true,
			keyboardControl: true
		});

		var halfW,
			halfH,
			coorX,
			coorY,
			degX,
			degY,
			degXL,
			degYL,
			amountMovedX,
			amountMovedY;

		$('#landing').mousemove(function(e) {
			halfW = ( this.clientWidth / 2 );
			halfH = ( this.clientHeight / 2 );
			coorX = ( halfW - ( event.pageX - this.offsetLeft ) );
			coorY = ( halfH - ( event.pageY - this.offsetTop ) );
			degXL  = ( ( coorY / halfH ) * 20 ) + 'deg';
			degYL  = ( ( coorX / halfW ) * -20 ) + 'deg';

			degX  = ( ( coorY / halfH ) * 15 ) + 'deg';
			degY  = ( ( coorX / halfW ) * -15 ) + 'deg';

			amountMovedX = ((e.pageX * -1 / 2) + halfW / 2) / 8;
			amountMovedY = ((e.pageY * -1 / 2) + halfH / 2) / 8;

			$('#parallax-landing').css('transform', 'translate3d(' + amountMovedX/3 + 'px, ' + amountMovedY/3 + 'px, -200px)');
			$('#landing .km-logo').css('transform', 'translate3d(' + -amountMovedX/12 + 'px, ' + -amountMovedY/12 + 'px, 0) rotateX(' + degXL +') rotateY('+ degYL +')');
		});
	};

	app.isCharacterKeyPress = function (evt) {
		if (typeof evt.which == "undefined") {
			return true;
		} else if (typeof evt.which == "number" && evt.which > 0) {
			return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8;
		}
		return false;
	};

	app.init = function() {
		$('#secretword-input').keydown(function(e) {
			$('#login-error-msg').removeClass('show');
		});

		$(document).keydown(function(e) {
			console.log('doc keydown event');
			if ($('body').hasClass('introMode') && app.isCharacterKeyPress(e) && e.keyCode !== 27) {
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

		var halfW,
			halfH,
			coorX,
			coorY,
			degX,
			degY,
			amountMovedX,
			amountMovedY;

		$('#auth').mousemove(function(e) {
			halfW = ( this.clientWidth / 2 );
			halfH = ( this.clientHeight / 2 );
			coorX = ( halfW - ( event.pageX - this.offsetLeft ) );
			coorY = ( halfH - ( event.pageY - this.offsetTop ) );
			degX  = ( ( coorY / halfH ) * 10 ) + 'deg';
			degY  = ( ( coorX / halfW ) * -10 ) + 'deg';
			amountMovedX = ((e.pageX * -1 / 2) + halfW / 2) / 8;
			amountMovedY = ((e.pageY * -1 / 2) + halfH / 2) / 8;

			$('#parallax-auth').css('transform', 'translate3d(' + amountMovedX/2 + 'px, ' + amountMovedY/2 + 'px, -20px) rotateX(' + degX + ') rotateY(' + degY + ')');
			$('.lock-icon').css('transform', 'translate3d(' + -amountMovedX/6 + 'px, ' + -amountMovedY/6 + 'px, 0) rotateX(' + degX +') rotateY('+ degY +')');
			$('.logo').css('transform', 'translate3d(' + -amountMovedX/10 + 'px, ' + -amountMovedY/10 + 'px, 0) rotateX(' + degX + ') rotateY(' + degY + ')');
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
						app.bind();
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

	return app;

}(window));
