class Countdown {

	constructor(endtime, $target) {
		this.endtime = endtime;
		this.$target = $target;
		this.utils = new Utils();
		this.timeinterval = undefined;
	}

	getTimeRemaining(endtime) {
		let t = Date.parse(endtime) - Date.parse(new Date());
		let seconds = Math.floor( (t/1000) % 60 );
		let minutes = Math.floor( (t/1000/60) % 60 );
		let hours = Math.floor( (t/(1000*60*60)) % 24 );
		let days = Math.floor( t/(1000*60*60*24) );

		return {
			'total': t,
			'days': this.utils.convertToTwoDigits(days),
			'hours': this.utils.convertToTwoDigits(hours),
			'minutes': this.utils.convertToTwoDigits(minutes),
			'seconds': this.utils.convertToTwoDigits(seconds)
		}
	}

	render() {
		let t = this.getTimeRemaining(this.endtime);
		this.$target.children('.days').html(t.days);
		this.$target.children('.hours').html(t.hours);
		this.$target.children('.mins').html(t.minutes);
		this.$target.children('.secs').html(t.seconds);
		if (t.total <= 0) {
			clearInterval(this.timeinterval);
			this.$target.hide();
		}
	}

	initCountdownClock() {
		this.render();
		this.timeinterval = setInterval(function() {
			this.render();
		}.bind(this), 1000);

		setTimeout(function() {
			this.$target.removeClass('hidden');
		}.bind(this), 500);
	}

	destroy() {
		clearInterval(this.timeinterval);
		this.$target.addClass('hidden');
	}
}
