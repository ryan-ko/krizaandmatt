RKO.COUNTDOWN = (function(window) {
	var countdown = {
	},
	utils = RKO.UTILS;

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