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

	app.init = function() {
		$('#secretword-input').keydown(function(e) {
			$('#login-error-msg').removeClass('show');
		});
		$(document).keydown(function(e) {
			if ($('body').hasClass('introMode')) {
				$('body').removeClass('introMode').addClass('passwordMode');
				$('#secretword-input').focus();
				console.log('Into password mode, leaving introMode');
			}

			if ($('body').hasClass('passwordMode')) {
				if (e.keyCode === 27) {
					$('body').addClass('introMode').removeClass('passwordMode');
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
					console.log('Login result:', data);
					console.log('Login result(html):', data.html);
					if (data.result === 'success') {
						$('#main').html(data.html);
						app.bind();
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
