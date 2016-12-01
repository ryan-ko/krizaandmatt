function Utils() {
	this.keysmap = {
		escape: 27
	}
}

Utils.prototype = {
	convertToTwoDigits: function(value) {
		if (value < 10) {
			return '0' + value;
		} else {
			return value;
		}
	},
	isCharacterKeyPress: function (evt) {
		if (typeof evt.which === 'undefined') {
			return true;
		} else if (typeof evt.which === 'number' && evt.which > 0) {
			return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8;
		}
		return false;
	},
	isTouchDevice: function() {
		return typeof window.ontouchstart !== 'undefined';
	},
	disableDefaultTouch: function() {
		// Mimic native iOS UI interactions
		// http://stackoverflow.com/questions/10238084/ios-safari-how-to-disable-overscroll-but-allow-scrollable-divs-to-scroll-norma
		var that = this;
		$(document).on('touchmove',function(e){
			e.preventDefault();
		});

		var scrolling = false;
		// Uses body because jquery on events are called off of the element they are
		// added to, so bubbling would not work if we used document instead.
		$('body').on('touchstart', '.scrollable',function(e) {
			// Only execute the below code once at a time
			if (!scrolling) {
				scrolling = true;
				if (e.currentTarget.scrollTop === 0) {
					e.currentTarget.scrollTop = 1;
				} else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
					e.currentTarget.scrollTop -= 1;
				}
				scrolling = false;
			}
		});

		// Prevents preventDefault from being called on document if it sees a scrollable div
		$('body').on('touchmove','.scrollable',function(e) {
			e.stopPropagation();
		});
	}
};