RKO.LOCK = (function(window) {
	var lock = {
	},
	utils = RKO.UTILS,
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