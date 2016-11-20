RKO.UTILS = (function(window) {
	var utils = {
	};

	utils.convertToTwoDigits = function(value) {
		if (value < 10) {
			return '0' + value;
		} else {
			return value;
		}
	};

	utils.isCharacterKeyPress = function (evt) {
		if (typeof evt.which == "undefined") {
			return true;
		} else if (typeof evt.which == "number" && evt.which > 0) {
			return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8;
		}
		return false;
	};

	return utils;
}(window));