function Countdown(endtime, $target) {
	this.endtime = endtime;
	this.utils = new Utils();
	this.$target = $target;
	this.timeinterval = undefined;
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
	render: function() {
		var t = this.getTimeRemaining(this.endtime);
		this.$target.children('.days').html(t.days);
		this.$target.children('.hours').html(t.hours);
		this.$target.children('.mins').html(t.minutes);
		this.$target.children('.secs').html(t.seconds);
		if (t.total <= 0) {
			clearInterval(this.timeinterval);
			this.$target.hide();
		}
	},
	initCountdownClock: function() {
		var that = this;
		console.log('that.$target', that.$target.children());
		that.render();
		that.timeinterval = setInterval(function() {
			that.render();
		}, 1000);

		setTimeout(function() {
			that.$target.removeClass('hidden');
		}, 500);
	},
	destroy: function() {
		var that = this;
		clearInterval(that.timeinterval);
		this.$target.addClass('hidden');
	}
};

