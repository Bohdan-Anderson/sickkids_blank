(function($) {

	$.fn.pullSlider = function(options) {
		var settings = $.extend({
			display: false,
			animationSlideTime: 500,
			inmode: true,
			location: "top",
			//doesn't matter if you change these when you load in the options...
			element: this,
			accel: 0,
			last: 0,
			height: 0,
			windowHeight: 0,
			toggelbutton: false,
			tbheight: 0,
			selected: false,
			debug: false,
			animatting: false
		}, options);


		settings.toggelbutton = $(this.children()[this.children().length - 1]);

		if (settings.inmode) {
			if (!this.hasClass("pull-slider")) {
				this.addClass('pull-slider');
			}
			resetHeight();
			putToPosistion(true);
		}

		this.disable = function() {
			if (settings.debug) {
				console.log("disable");
			}
			if (settings.inmode) {
				settings.element.removeClass('pull-slider');
				settings.element.css({
					height: "auto",
					top: "0px"
				});
				settings.inmode = false;
			}
		}

		this.enable = function() {
			if (settings.debug) {
				console.log("enable");
			}
			if (!settings.inmode) {
				settings.element.addClass('pull-slider');
				resetHeight();
				putToPosistion(true);
				settings.inmode = true;
			}
		}

		this.refindHeight = function() {
			if (settings.debug) {
				console.log("refindHeight");
			}
			resetHeight();
			settings.display = false;
			settings.element.removeClass('slider-active');
			putToPosistion();
		}

		$(window).resize(function() {
			if (settings.inmode) {
				resetHeight();
				putToPosistion(true);
			}
		});
		//toggle for the desktop and other devices which do not support the touch movements
		settings.toggelbutton.on("click", function() {
			if (settings.debug) {
				console.log("toggleButton click");
			}
			if (settings.inmode) {
				if (settings.display) {
					settings.display = false;
					settings.element.removeClass('slider-active');
				} else {
					settings.display = true;
					settings.element.addClass('slider-active');
				}
				putToPosistion();
			}
		});
		//enable the rest of the touch inputs to work by enabling settings.selected
		settings.toggelbutton.on("touchstart", function() {
			if (settings.debug) {
				console.log("touchStart ");
			}
			if (settings.inmode) {
				event.preventDefault();
				settings.toggelbutton.addClass('selected');
				settings.selected = true;
				settings.last = settings.element.offset().top;
				settings.height = settings.element.height();
				return false;
			}
		})
		//as the user moves over the screen the element follows their touch, by preventing default we do not allow click to be triggered, we also do the math for the acceleration of the menu
		if (window.addEventListener) {
			window.addEventListener("touchmove", function(event) {
				if (settings.debug) {
					console.log("touchMove");
				}
				if (settings.selected) {
					event.preventDefault();
					var touched = event["targetTouches"]["0"];
					var thispos = settings.element.offset().top;
					settings.accel = settings.last - thispos;
					settings.last = thispos;
					var tLoc = 0;
					tLoc = touched["clientY"] - settings.height + (settings.tbheight);

					if (touched["clientY"] - settings.height + (settings.tbheight) < 0 && touched["clientY"] - settings.height > -settings.height) {
						settings.element.css("top", tLoc);
					}
					return false;
				}
				if (settings.display) {
					event.preventDefault();
					return false;
				}
			});
		}
		//from the acceleration calced in the touchmove we send the navigation bar to where it needs to end up
		$(window).on("touchend", function() {
			if (settings.debug) {
				console.log("touchEnd");
			}
			if (settings.selected) {
				event.preventDefault();
				toggleAnimation(true);

				if (settings.accel <= 0) {
					settings.display = true;
					settings.element.addClass('slider-active');
				} else {
					settings.display = false;
					settings.element.removeClass('slider-active');
				}


				putToPosistion();
				settings.toggelbutton.removeClass('selected');
				settings.selected = false;
				return false;
			}
			// scrollToBottom();
		})

		//set the height of the slider to either the window height if it's greater than it, or to it self, adding the full height style if needed
		function resetHeight() {
			if (settings.debug) {
				console.log("restHeight");
			}
			settings.windowHeight = $(window).outerHeight();
			settings.element.height("auto");
			settings.height = settings.element.height();
			toggleSliderWindow();
			settings.tbheight = settings.toggelbutton.outerHeight(true);
		}

		function toggleSliderWindow() {
			if (settings.debug) {
				console.log("toggleSliderWindow");
			}
			if (settings.height >= settings.windowHeight) {
				settings.element.height(settings.windowHeight);
				if (!settings.element.hasClass('slider-window-height')) {
					settings.element.addClass('slider-window-height');
				}
			} else {
				settings.element.height(settings.height);
				if (settings.element.hasClass('slider-window-height')) {
					settings.element.removeClass('slider-window-height');
				}
			}
		}
		//slide either up or down the element based on the animation
		function putToPosistion(noscroll) {
			if (settings.debug) {
				console.log("putToPosition");
			}
			if (settings.inmode) {
				if (settings.display) {
					if (noscroll == undefined || !noscroll) {
						toggleAnimation(true);
					}
					settings.element.css("top", "0");
				} else {
					if (noscroll == undefined || !noscroll) {
						toggleAnimation(true)
					};
					if (settings.windowHeight <= settings.height) {
						settings.element.css("top", -settings.height + settings.tbheight);
					} else {
						settings.element.css("top", -settings.height + settings.tbheight);
					}
				}
			}
		}
		//toggle the animation class, but if set to true, add it and then remove it after the sliding animation time, if false remove it
		function toggleAnimation(toggleTo) {
			if (settings.debug) {
				console.log("toggleAnimation");
			}
			if (!settings.element.hasClass('slider-animation') || toggleTo) {
				settings.element.addClass('slider-animation');
				settings.animatting = true;
				setTimeout(function() {
					toggleAnimation(false);
				}, settings.animationSlideTime);
			} else if (settings.element.hasClass('slider-animation') || !toggleTo) {
				settings.element.removeClass('slider-animation');
				settings.animatting = false;
			}
			scrollToBottom();
		}
		//scroll the element to the bottom of the page
		function scrollToBottom() {
			if (settings.debug) {
				console.log("scrollToBottom");
			}
			settings.element.scrollTop(settings.element[0].scrollHeight + 999);
		}
		this.toBottom = scrollToBottom;

		this.clickable = function() {
			return settings.animatting;
		}
		this.manualResize = function() {
			settings.height = settings.element.height();
		}

		return this
	};
}(jQuery));