;(function($, window, document, undefined) {
	var $win = $(window);
	var $doc = $(document);
	var scrollTop = $win.scrollTop();
	var winH = window.innerHeight;
	var winW = window.innerWidth;
	var $header, $sectionContent;
	var $nav, $navToggle, $navClose;

	$doc.ready(function() {
		$header = $('.header');
		$sectionContent = $('.section-content');

		headerBackground();

		$win
			.on('resize', function() {
				winH = window.innerHeight;
				winW = window.innerWidth;

				if( winW >= 1150 ) {
					$('.dropdown').attr('style', '');
				}
			})
			.on('scroll', function() {
				scrollTop = $win.scrollTop();
			})
			.on('load scroll resize', headerBackground);

		var $countdown = $('#countdown');

		if( $countdown.length ) {
			var countdownInterface = new CountDownInterface($countdown);

			var timer = new countdown(new Date($countdown.data('end')), function(timespan) {
				countdownInterface.update(timespan);
			}, countdown.MOUNTHS, countdown.DAYS & countdown.HOURS & countdown.MINUTES & countdown.SECONDS, NaN, 2);
		}

		var $sliders = $('.slider');

		if( $sliders.length ) {
			$sliders
				.each(function() {
					var $slider = $(this);

					if( $slider.hasClass('slider-intro') ) {
						var $slides = $slider.find('.slide');

						$slides
							.each(function() {
								var $slide = $(this);
								var $image = $slide.find('img');

								$slide.css({
									backgroundImage: 'url(' + $image.attr('src') + ')'
								});

								$image.remove();
							});

						$slider.find('.slides').slick({
							accessibility: false,
							autoplay: true,
							autoplaySpeed: 15000,
							arrows: false,
							dots: false,
							//appendDots: $('.intro-body .shell'),
							draggable: false,
							fade: true,
							pauseOnFocus: false,
							pauseOnHover: false,
							speed: 7500,
							swipe: false,
							touchMove: false
						});
					} else if( $slider.hasClass('slider-lineup') ) {
						var $slides = $slider.find('.slide');
						var $leftClones = $($slides.parent().html()).addClass('slide-clone');
						var $rightClones = $($slides.parent().html()).addClass('slide-clone');
						var startingPoint = $slides.length;

						$slider.find('.slides').prepend($leftClones).append($rightClones);

						$slider.find('.slides').slick({
							accessibility: false,
							infinite: false,
							appendArrows: $slider,
							draggable: true,
							initialSlide: startingPoint,
							slidesToShow: 3,
							slidesToScroll: 1,
							speed: 600,
							swipeToSlide: false,
							touchMove: false,
							responsive: [
								{
									breakpoint: 993,
									settings: {
										slidesToShow: 2,
										slidesToScroll: 1,
										draggable: true,
										swipeToSlide: true,
										touchMove: true
									}
								},
								{
									breakpoint: 599,
									settings: {
										slidesToShow: 1,
										slidesToScroll: 1,
										draggable: true,
										swipeToSlide: true,
										touchMove: true
									}
								}
							]
						}).on('afterChange', function(event, slick, currentSlide) {
							var target;

							if( currentSlide < startingPoint - 1 ) {
								target = currentSlide + startingPoint;
							} else if( currentSlide > startingPoint * 2 - 1 ) {
								target = currentSlide - startingPoint;
							}

							if( typeof target !== 'undefined' ) {
								$slider.addClass('slider-no-transition');

								setTimeout(function() {
									$slider.find('.slides').slick('slickGoTo', target, true);

									setTimeout(function() {
										$slider.removeClass('slider-no-transition');
									});
								});
							}
						});
					}
				});
		}

		$nav = $('.nav');
		$navToggle = $('#nav-toggle');
		$navClose = $('#nav-close');

		$navToggle
			.on('click', function(event) {
				event.preventDefault();

				$header.toggleClass('nav-open');
			});

		$navClose
			.on('click', function(event) {
				event.preventDefault();

				$header.removeClass('nav-open');
			});

		$nav.find('.has-dropdown > a')
			.on('click', function(event) {
				if( winW < 1024 ) {
					event.preventDefault();

					$(this).siblings('.dropdown').slideToggle(300);
				}
			});

		var lastTouchPoint = 0;

		addEventListener('touchstart', function(event) {
			var $target = $(event.target);

			if( $header.hasClass('nav-open') && !$target.hasClass('nav') && !$target.parents('.nav').length ) {
				event.preventDefault();

				$header.removeClass('nav-open');
			}

			lastTouchPoint = event.touches[0].pageY;

		}, supportsPassive ? { passive: false } : false);

		addEventListener('touchmove', function(event) {
			var touchPoint = event.touches[0].pageY;

			if( winW < 1024 && $header.hasClass('nav-open') && (touchPoint > lastTouchPoint && $nav.scrollTop() <= 0 || touchPoint < lastTouchPoint && $nav.scrollTop() + $nav.outerHeight() >= $nav.prop('scrollHeight')) ) {
				event.preventDefault();
			}

			lastTouchPoint = touchPoint;
		}, supportsPassive ? { passive: false } : false);

		var $tabs = $('.tabs');

		if( $tabs.length ) {
			$tabs
				.each(function() {
					var $tabsContainer = $(this);
					var $tabsNav = $tabsContainer.find('.tabs-nav');
					var $tabsBody = $tabsContainer.find('.tabs-body');

					if( !$tabsNav.find('.current').length ) {
						$tabsNav.find('li:eq(0)').addClass('current');
						$tabsBody.find('.tab:eq(0)').addClass('current');
					}

					$tabsNav
						.find('a')
						.on('click', function(event) {
							event.preventDefault();

							var $link = $(this);

							if( !$link.parent().hasClass('current') ) {
								$link.parent().addClass('current').siblings('.current').removeClass('current');
								$tabsBody.find($link.attr('href')).addClass('current').siblings('.current').removeClass('current');
							}
						});
				});
		}

		var $listSponsors = $('.list-sponsors');

		if( $listSponsors.length ) {
			var sponsorItemsCount = $listSponsors.find('li').length;
			var delimiter = winW < 768 ? 3 : 2;
			var sponsorsWidth = Math.ceil(sponsorItemsCount / delimiter) * $listSponsors.find('li:eq(0)').outerWidth(true);
			var sponsorsScrollDistance = winW - sponsorsWidth;
			var sponsorsStartOffset = $listSponsors.offset().top + $listSponsors.outerHeight() - winH;
			var sponsorsEndOffset = $listSponsors.offset().top;

			$win
				.on('load', function() {
					delimiter = winW < 768 ? 3 : 2;
					sponsorsWidth = Math.ceil(sponsorItemsCount / delimiter) * $listSponsors.find('li:eq(0)').outerWidth(true);
					sponsorsScrollDistance = winW - sponsorsWidth;
					sponsorsStartOffset = $listSponsors.offset().top + $listSponsors.outerHeight() - winH;
					sponsorsEndOffset = $listSponsors.offset().top;
				})
				.on('resize', function() {
					delimiter = winW < 768 ? 3 : 2;
					sponsorsWidth = Math.ceil(sponsorItemsCount / delimiter) * $listSponsors.find('li:eq(0)').outerWidth(true);
					sponsorsScrollDistance = winW - sponsorsWidth;
					sponsorsStartOffset = $listSponsors.offset().top + $listSponsors.outerHeight() - winH;
					sponsorsEndOffset = $listSponsors.offset().top;
				})
				.on('scroll', function() {
					if( scrollTop >= sponsorsStartOffset && scrollTop <= sponsorsEndOffset ) {
						var offset = (scrollTop - sponsorsStartOffset) / (sponsorsEndOffset - sponsorsStartOffset) * sponsorsScrollDistance;

						$listSponsors
							.css({
								transform: 'translateX(' + offset + 'px)'
							});
					}
				});
		}

		var $accordions = $('.accordion');

		if( $accordions.length ) {
			$accordions
				.each(function() {
					var $accordion = $(this);
					var $items = $accordion.find('.accordion-item');

					$items
						.each(function() {
							var $item = $(this);
							var $itemHead = $item.find('.accordion-item-head');
							var $itemBody = $item.find('.accordion-item-body');

							$itemHead
								.on('click', function(event) {
									var $target = $(event.target);

									if( !$target.hasClass('btn') && !$item.hasClass('accordion-item-expanded') && !$accordion.find('.accordion-item-body:animated').length ) {
										$itemBody.slideDown(400, function() {
											$item.addClass('accordion-item-expanded');
										});

										$item.siblings('.accordion-item-expanded').find('.accordion-item-body').slideUp(400, function() {
											$(this).parents('.accordion-item-expanded:eq(0)').removeClass('accordion-item-expanded');
										});
									}
								});
						});
				});
		}
	});

	function headerBackground() {
		if( $sectionContent.length ) {
			$header.toggleClass('header-dark', inViewport($sectionContent));
		}
	}

	function inViewport($element) {
		return scrollTop + $header.outerHeight() >= $element.offset().top && scrollTop - $header.outerHeight() + winH <= $element.offset().top + $element.outerHeight();
	}

	function CountDownInterface($container) {
		this.$container = $container;
		this.$months;
		this.$days;
		this.$hours;
		this.$minutes;
		this.$seconds;

		this.init();
	}

	CountDownInterface.prototype.init = function() {
		this.$months = $('<div />').addClass('countdown-unit countdown-months').text('Month').prepend('<strong />');
		this.$days = $('<div />').addClass('countdown-unit countdown-days').text('Days').prepend('<strong />');
		this.$hours = $('<div />').addClass('countdown-unit countdown-hours').text('Hours').prepend('<strong />');
		this.$minutes = $('<div />').addClass('countdown-unit countdown-minutes').text('Mins').prepend('<strong />');
		this.$seconds = $('<div />').addClass('countdown-unit countdown-seconds').text('Secs').prepend('<strong />');

		this.$container.append(this.$months);
		this.$container.append(this.$days);
		this.$container.append(this.$hours);
		this.$container.append(this.$minutes);
		this.$container.append(this.$seconds);

		this.$months = this.$months.find('strong');
		this.$days = this.$days.find('strong');
		this.$hours = this.$hours.find('strong');
		this.$minutes = this.$minutes.find('strong');
		this.$seconds = this.$seconds.find('strong');
	}

	CountDownInterface.prototype.update = function(timespan) {
		this.$months.text(optionalLeadingZero(timespan.months));
		this.$days.text(optionalLeadingZero(timespan.days));
		this.$hours.text(optionalLeadingZero(timespan.hours));
		this.$minutes.text(optionalLeadingZero(timespan.minutes));
		this.$seconds.text(optionalLeadingZero(Math.floor(timespan.seconds)));
	}

	function optionalLeadingZero(number) {
		return number.toString().length < 2 ? '0' + number.toString() : number;
	}

	var supportsPassive = false;
	try {
		var opts = Object.defineProperty({}, 'passive', {
			get: function() {
				supportsPassive = true;
			}
		});
		window.addEventListener("test", null, opts);
	} catch (e) {}
	
	$("#gallery-btn").click(function(){
        	$('html, body').animate({
				scrollTop: $(".section.section-gallery").offset().top
			}, 2000);
		});
})(jQuery, window, document);

$(document).ready(function() {
	$("#toggle-mission").on('click touch', function() {
    var elem = $("#toggle-mission").text();
    if (elem == "Read More") {
      //Stuff to do when btn is in the read more state
      $("#toggle-mission").text("Read Less");
      $("#text-mission").slideDown();
    } else {
      //Stuff to do when btn is in the read less state
      $("#toggle-mission").text("Read More");
      $("#text-mission").slideUp();
    }
  });
  $("#toggle-do").on('click touch', function() {
    var elem = $("#toggle-do").text();
    if (elem == "Read More") {
      //Stuff to do when btn is in the read more state
      $("#toggle-do").text("Read Less");
      $("#text-do").slideDown();
    } else {
      //Stuff to do when btn is in the read less state
      $("#toggle-do").text("Read More");
      $("#text-do").slideUp();
    }
  });
  $("#toggle-vision").on('click touch', function() {
    var elem = $("#toggle-vision").text();
    if (elem == "Read More") {
      //Stuff to do when btn is in the read more state
      $("#toggle-vision").text("Read Less");
      $("#text-vision").slideDown();
    } else {
      //Stuff to do when btn is in the read less state
      $("#toggle-vision").text("Read More");
      $("#text-vision").slideUp();
    }
  });
  $("#toggle1").on('click touch', function() {
    var elem = $("#toggle1").text();
    if (elem == "Read More") {
      //Stuff to do when btn is in the read more state
      $("#toggle1").text("Read Less");
      $("#text1").slideDown();
    } else {
      //Stuff to do when btn is in the read less state
      $("#toggle1").text("Read More");
      $("#text1").slideUp();
    }
  });
  $("#toggle2").on('click touch', function() {
    var elem = $("#toggle2").text();
    if (elem == "Read More") {
      //Stuff to do when btn is in the read more state
      $("#toggle2").text("Read Less");
      $("#text2").slideDown();
    } else {
      //Stuff to do when btn is in the read less state
      $("#toggle2").text("Read More");
      $("#text2").slideUp();
    }
  });
  $("#toggle3").on('click touch', function() {
    var elem = $("#toggle3").text();
    if (elem == "Read More") {
      //Stuff to do when btn is in the read more state
      $("#toggle3").text("Read Less");
      $("#text3").slideDown();
    } else {
      //Stuff to do when btn is in the read less state
      $("#toggle3").text("Read More");
      $("#text3").slideUp();
    }
  });
  $("#toggle4").on('click touch', function() {
    var elem = $("#toggle4").text();
    if (elem == "Read More") {
      //Stuff to do when btn is in the read more state
      $("#toggle4").text("Read Less");
      $("#text4").slideDown();
    } else {
      //Stuff to do when btn is in the read less state
      $("#toggle4").text("Read More");
      $("#text4").slideUp();
    }
  });
  $("#toggle5").on('click touch', function() {
    var elem = $("#toggle5").text();
    if (elem == "Read More") {
      //Stuff to do when btn is in the read more state
      $("#toggle5").text("Read Less");
      $("#text5").slideDown();
    } else {
      //Stuff to do when btn is in the read less state
      $("#toggle5").text("Read More");
      $("#text5").slideUp();
    }
  });
  $("#toggle6").on('click touch', function() {
    var elem = $("#toggle6").text();
    if (elem == "Read More") {
      //Stuff to do when btn is in the read more state
      $("#toggle6").text("Read Less");
      $("#text6").slideDown();
    } else {
      //Stuff to do when btn is in the read less state
      $("#toggle6").text("Read More");
      $("#text6").slideUp();
    }
  });
    $("#toggle7").on('click touch', function() {
    var elem = $("#toggle7").text();
    if (elem == "Read More") {
      //Stuff to do when btn is in the read more state
      $("#toggle7").text("Read Less");
      $("#text7").slideDown();
    } else {
      //Stuff to do when btn is in the read less state
      $("#toggle7").text("Read More");
      $("#text7").slideUp();
    }
  });
    $("#toggle8").on('click touch', function() {
    var elem = $("#toggle8").text();
    if (elem == "Read More") {
      //Stuff to do when btn is in the read more state
      $("#toggle8").text("Read Less");
      $("#text8").slideDown();
    } else {
      //Stuff to do when btn is in the read less state
      $("#toggle8").text("Read More");
      $("#text8").slideUp();
    }
  });
});
