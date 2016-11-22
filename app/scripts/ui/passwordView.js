rko.passwordView = (function(window) {

	var view = {
		previousModeLabel: undefined,
		modeLabel: 'passwordMode',
		bindables: {
			$passwordInput: $('#password-input'),
			$passwordForm: $('#password-form'),
			$doc: $(document)
		},
		$body: $('body'),
		$passwordErrorMsg: $('#login-error-msg'),
		helloMessages: ['Hello!', '안녕하세요!']
	},
	utils = new Utils(),
	carouselView = rko.carouselView;

	view.bind = function() {
		var that = this,
			pressedKey;

		that.bindables.$passwordInput.keydown(function(e) {
			that.hidePasswordErrorMessage();
		});

		that.bindables.$doc.keydown(function(e) {
			pressedKey = e.keyCode;
			if (that.$body.hasClass(that.previousModeLabel) &&
					utils.isCharacterKeyPress(e) &&
					pressedKey !== utils.keysmap.escape) {
				that.$body.removeClass().addClass(that.modeLabel);
				that.bindables.$passwordInput.focus();
			}

			if (that.$body.hasClass(that.modeLabel)) {
				if (pressedKey === utils.keysmap.escape) {
					that.$body.removeClass().addClass(that.previousModeLabel);
					that.bindables.$passwordInput.val('');
				}
			}
		});

		that.bindables.$passwordForm.submit(function(e) {
			var url = $(this).attr('action'),
				data;

			$.ajax({
				type: 'POST',
				url: url,
				data: $(this).serialize(),
				success: function(data) {
					data = $.parseJSON(data);
					if (data.result === 'success') {
						$('.password-hint').html(view.helloMessages[Math.floor(Math.random() * view.helloMessages.length)]);
						that.unbind();
						carouselView.init(data.html, data.menuHtml);
					} else {
						that.showPasswordErrorMessage();
					}
				}
			});
			e.preventDefault();
		});
	};

	view.unbind = function() {
		var bindables = this.bindables;
		for (var key in bindables) {
			if (bindables.hasOwnProperty(key)) {
				bindables[key].off();
			}
		}
	};

	view.showPasswordErrorMessage = function() {
		this.$passwordErrorMsg.addClass('show');
	};
	view.hidePasswordErrorMessage = function() {
		this.$passwordErrorMsg.removeClass('show');
	};
	view.init = function(previousModeLabel) {
		this.previousModeLabel = previousModeLabel;
		this.bind();
	};

	return view;

}(window));
