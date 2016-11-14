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
	};

	app.init = function() {
		app.bind();
	};

	return app;

}(window));
