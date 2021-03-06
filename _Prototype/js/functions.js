(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego|ipad|playbook|silk).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

var $panZoom = null;

;(function($, window, document, undefined) {
	var $win = $(window);
	var $doc = $(document);
	var $course, $courseBtnMaximize, $courseBtnMinimize, $courseQuestions, $nav, $search;

	/**
	 * Course interactions.
	 * @type {Object}
	 */
	var Course = {};

	/**
	 * Expand the pdf view.
	 * @return
	 */
	Course.maximize = function() {
		$courseBtnMinimize.removeClass('is-hidden');
		$courseBtnMaximize.addClass('is-hidden');
		$course.addClass('course-maximized');
	}

	/**
	 * Collapse the pdf view.
	 * @return
	 */
	Course.minimize = function() {
		$courseBtnMinimize.addClass('is-hidden');
		$courseBtnMaximize.removeClass('is-hidden');
		$course.removeClass('course-maximized');
		setTimeout(function() {
			$courseQuestions.getNiceScroll().resize();
		}, 100);
	}

	/**
	 * Swaps the view on mobile devices.
	 * @return 
	 */
	Course.swap = function() {
		$course.toggleClass('course-swapped');
	}

	/**
	 * Run the app.
	 * @return
	 */
	$doc.ready(function() {
		// cache DOM elements
		$course            = $('.course');
		$courseBtnMinimize = $('.course-control-minimize');
		$courseBtnMaximize = $('.course-control-maximize');
		$courseQuestions   = $('.course-questions-container');
		$nav               = $('.nav-container');
		$search            = $('.search');

		if (!$.browser.mobile) {
			$('.is-scrollable').niceScroll({
				cursorcolor : '#606060',
				cursoropacitymin: 0.3,
				cursorborder: false,
				enablescrollonselection: false,
				railoffset: {
					left: -2
				},
				railpadding: {
					top: 2,
					bottom: 2
				}
			});
		}

		$courseBtnMaximize.on('click', function(e) {
			Course.maximize();
			e.preventDefault();
		});

		$courseBtnMinimize.on('click', function(e) {
			Course.minimize();
			e.preventDefault();
		});

		$('.js-magnify').magnificPopup({
			type: 'image',
			mainClass: 'mfp-pdf'
		});

		if (!$.browser.mobile) {
			$('[data-tip]').tooltipster({
				position: 'right',
				maxWidth: 230,
				functionBefore: function(origin, continueTooltip) {
					origin.tooltipster('content', $(this).data('tip'));
					continueTooltip();
				}
			});
		}

		$('.select').each(function() {
			var $select = $(this);

			$select.selecter({
				label: $select.attr('placeholder')
			});
		});

		$('.nav-toggle').on('click', function(e) {
			$nav.toggleClass('open');
			e.preventDefault();
		});

	    var clearSearchText = function() {
	        $search.find('input').val('');
	    };

	    $('.search-field').on('click', function (e) {
	        $search.toggleClass('search-expanded');
	        clearSearchText();
	        e.preventDefault();
		});

		$('.wrapper').on('click', function(e) {
			var $clicked = $(e.target);

			if (!$clicked.closest($nav).length && !$clicked.is($nav)) {
				$nav.removeClass('open');
			}

			if (!$clicked.closest($search).length && !$clicked.is($search)) {
			    $search.removeClass('search-expanded');
			    clearSearchText();
			}
		});

		// Don't select elements if placeholder is natively supported
		if (!$.support.placeholder) {
			$('input[placeholder], textarea[placeholder]').doPlaceholders();
		}

		$('.course-switch').on('click', function(e) {
		    Course.swap();
		    scrollTo(".course-media-bar");
			e.preventDefault();
		});

		var pdfPreviewLoaded = function () {
		    var $panZoom = $(".course-media-frame-panzoom").panzoom({
	            contain: 'invert',
	            $zoomOut: $('.course-zoom-out'),
	            $zoomIn: $('.course-zoom-in'),
	            //relative: true,
	            //minScale: 1
	        });

	        $panZoom.on('panzoomzoom', function (e, panzoom, matrix, changed) {
	            if (changed) {
	                $('.course-zoom-level').text(Math.round(100 * matrix) + '%');
	            }
	        });

	        $panZoom.parent().on('mousewheel.focal', function (e) {
	            e.preventDefault();
	            var delta = e.delta || e.originalEvent.wheelDelta;

	            var down = delta ? delta < 0 : e.originalEvent.deltaY > 0;
	            $panZoom.panzoom('pan', 0, 15 * (down ? -1 : 1), { relative: true });
	        });

		    $('.course-media-frame .loading').hide();
		}

	    $("img.course-pdf-preview").one("load", function () {
	        pdfPreviewLoaded();
	    }).each(function () {
	        if (this.complete) $(this).load();
	    });

	    $('.help-wrapper button').click(function() {
	        $('#helpClose').toggleClass('open');
	    });
	    $('#helpClose button').click(function () {
	        $('.help-container .open').removeClass('open');
	    });
	    $('.help-container .popup[step] button').click(function () {
	        var step = parseInt($(this).closest('.popup[step]').attr('step'));
	        $('.help-container .popup[step="' + step + '"]:visible').removeClass('open');
	        $('.help-container .popup[step="' + (step + 1) + '"]:visible').addClass('open');
	    });

	    // prototype - bind answer button
		bindAddRemove();

	    // prototype - header login
	    var $header = $('header.header');
	    if (window.location.href.indexOf('index.html') > -1 || window.location.href.substr(window.location.href.length - 1) == '/') {
		    $header.removeClass('logged-in').addClass('logged-out');
		} else {
		    $header.removeClass('logged-out').addClass('logged-in');
		}
	});

    var bindAddRemove = function() {
        $('.test-certificate-form .btn-add').off('click').click(function (e) {
            $(".form-controls").first().clone().appendTo(".form-row");
            e.preventDefault();
            bindAddRemove();
        });
        $('.test-certificate-form .btn-remove').off('click').click(function (e) {
            $(this).parents('.form-controls').hide();
            e.preventDefault();
            bindAddRemove();
        });
    };

	$.fn.doPlaceholders = function() {
		if ($.support.placeholder) {
			return this;
		}

		var $fields = this.filter(function () {
			// Don't re-initialize
			return !$(this).data('didPlaceholders');
		});

		$fields.on('focus blur', function(event) {
			var placeholder = this.getAttribute('placeholder');

			if (event.type === 'focus' && placeholder === this.value) {
				this.value = '';
			} else if (event.type === 'blur' && this.value === '') {
				this.value = placeholder;
			}
		});

		// Set the initial value to the title
		$fields.each(function() {
			if (this.value === '') {
				this.value = this.getAttribute('placeholder');
			}
		});

		// Mark the fields as initialized
		$fields.data('didPlaceholders', true);

		// Alllow
		return $fields;
	};

	$.support.placeholder = (function() {
		return 'placeholder' in document.createElement('input');
	})();
})(jQuery, window, document);


function scrollTo(scrollToElement, scrollingElement) {
    if (!scrollingElement)
        scrollingElement = 'html, body';
    $(scrollingElement).animate({
        scrollTop: $(scrollToElement).offset().top
    }, 200);
};

// Prototype function so jQuery can get at query strings
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}