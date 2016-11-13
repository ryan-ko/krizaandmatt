'use strict';

RKO.APP = (function(window) {

	var app = {
		labels: {
			loadingImages: ['Loading phalange..', 'Grabbing Images..', 'Pixelating..', 'Wait for it..', 'Waterproofing..', 'Ajaxing secrets..'],
			completeLoadingImages: ['Done!', 'Ready!', ':D']
		},
		// Order of this list needs to match the actual DOM Order
		// This is bound to the routes.visitRoute in routes.js
		slideList: ['ContestOfChampions', 'UltimateQuest', 'CampaignApp', 'Cherrypick', 'FilmTV'],
		swiper: undefined,
		lastSlide: undefined,
		prevSlideId: undefined,
		$HeroCarousel: $('.HeroCarousel'),
		$HeroImageHolder: $('.HeroImage-imageHolder'),
		$LaunchBtn: $('.Button--launchIcon'),
		$HomeBtn: $('.Navigation--homeBtn'),
		$Navigation: $('.Navigation'),
		$body: $('body'),
		$Content: $('#Content'),
		heroCarouselIDList: [],
		currentViewInstance: undefined,
		carouselHidingTimeout: undefined,
		mobileGallerySettings: {
			pagination: '.gallery-pagination-mobile',
			slidesPerView: 4,
			paginationClickable: true,
			spaceBetween: 20,
			centeredSlides: true,
			loop: false,
			grabCursor: true,
			loopAdditionalSlides: 3,
			breakpoints: {
				360: {
					slidesPerView: 1,
					spaceBetweenSlides: 0
				},
				620: {
					slidesPerView: 2,
					spaceBetweenSlides: 10
				},
				1040: {
					slidesPerView: 3,
					spaceBetweenSlides: 20
				}
			}
		},
		desktopGallerySettings: {
			pagination: '.gallery-pagination',
			slidesPerView: 1,
			effect: 'fade',
			paginationClickable: true,
			spaceBetween: 0,
			loop: true,
			grabCursor: true
		}
	};

	app.bind = function() {
	};

	app.init = function() {
		app.bind();
	};

	return app;

}(window));
