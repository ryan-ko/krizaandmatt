function Countdown(endtime, $target) {
	this.endtime = endtime;
	this.utils = new Utils();
	this.$target = $target;
}

Countdown.prototype = {
	getTimeRemaining: function(endtime) {
		var t = Date.parse(endtime) - Date.parse(new Date());
		var seconds = Math.floor( (t/1000) % 60 );
		var minutes = Math.floor( (t/1000/60) % 60 );
		var hours = Math.floor( (t/(1000*60*60)) % 24 );
		var days = Math.floor( t/(1000*60*60*24) );

		return {
			'total': t,
			'days': this.utils.convertToTwoDigits(days),
			'hours': this.utils.convertToTwoDigits(hours),
			'minutes': this.utils.convertToTwoDigits(minutes),
			'seconds': this.utils.convertToTwoDigits(seconds)
		};
	},
	initCountdownClock: function() {
		var that = this;
		console.log('that.$target', that.$target.children());
		var timeinterval = setInterval(function(){
			var t = that.getTimeRemaining(that.endtime);
			that.$target.children('.days').html(t.days);
			that.$target.children('.hours').html(t.hours);
			that.$target.children('.mins').html(t.minutes);
			that.$target.children('.secs').html(t.seconds);
			if (t.total <= 0) {
				clearInterval(timeinterval);
			}
		}, 1000);
	}
};

