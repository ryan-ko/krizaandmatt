'use strict';

RKO.APP = (function(window) {

	var app = {
	};

	app.bind = function() {
		$(document).on('click', '#plusone-checkbox', function(e) {
			if ($(e.target).is(':checked')) {
				$('#plusone-checkbox-result').val('Yes')
				$('#plusone-input').show();
			} else {
				$('#plusone-checkbox-result').val('No');
				$('#plusone-input').hide();
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
	};

	app.isCharacterKeyPress = function(evt) {
			if (typeof evt.which == "undefined") {
					// This is IE, which only fires keypress events for printable keys
					return true;
			} else if (typeof evt.which == "number" && evt.which > 0) {
					// In other browsers except old versions of WebKit, evt.which is
					// only greater than zero if the keypress is a printable key.
					// We need to filter out backspace and ctrl/alt/meta key combinations
					return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8;
			}
			return false;
	}

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

		$('#auth').mousemove(function(e) {
			var halfW = ( this.clientWidth / 2 );
			var halfH = ( this.clientHeight / 2 );

			var amountMovedX = ((e.pageX * -1 / 2) + halfW / 2) / 8;
			var amountMovedY = ((e.pageY * -1 / 2) + halfH / 2) / 8;

			console.log('halfW', halfW);
			console.log('halfH', halfH);

			console.log('amountMovedX', amountMovedX);
			console.log('amountMovedY', amountMovedY);

			$('#parallax-auth').css('transform', 'translate3d(' + amountMovedX + 'px, ' + amountMovedY + 'px, 0)');
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
