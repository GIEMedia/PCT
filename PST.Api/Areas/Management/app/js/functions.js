;(function($, window, document, undefined) {
	var $win = $(window);
	var $doc = $(document);

	$doc.ready(function() {
		// Admin button
		$('.admin').on('mouseenter', function() {
			$(this).addClass('hovered');
		}).on('mouseleave', function() {
			$(this).removeClass('hovered');
		});

		// Button plus
	    $('.btn-plus-main, .btn-plus-inner').on('mouseenter', function () {
			$(this).addClass('hovered');
		}).on('mouseleave', function() {
			$(this).removeClass('hovered');
		});

		$('.btn-plus').on('click', function () {
		    $(this).children('.btn-plus-main');
			$(this).toggleClass('clicked');
		});

		$doc.mouseup(function (e) {
			var container = $(".btn-plus");
			if (container.has(e.target).length === 0) { container.find('.btn-plus-inner').parent().removeClass('clicked'); }
		});

		$('.file-trigger').on('click', function(e) {
			$(this).parent().find('.field-file').trigger('click');

			e.preventDefault();
		});


		$('.icon-rename').on('click', function (e) {
		    $(this).parents('tr').addClass('editing');
		    $(this).closest('tr').find('.section-name .field').focus();

		    $('.editing .name-edit .fa').on('click', function (e) {
		        console.log($(this).closest('tr'));
		        $(this).closest('tr').removeClass('editing');

		        e.preventDefault();
		    });

	        e.preventDefault();
		});

		// Table questions
		$('.custom-table-questions .table-row').on('mouseenter', function() {
			if (!$(this).hasClass('expanded')) {
				$(this).addClass('hovered');
			};
		}).on('mouseleave', function() {
			$(this).removeClass('hovered');
		});
	    $('.custom-table-questions .table-row .table-col.col-size-1, .custom-table-questions .table-row .foot').on('mouseenter', function () {
		    $(this).addClass('hovered');
		}).on('mouseleave', function () {
		    $(this).removeClass('hovered');
		});

	    var sliding = false;
	    $('.custom-table-questions .table-row .col-size-1, .custom-table-questions .icon-chevron-down, .custom-table-questions .icon-chevron-up').on('click', function (e) {
	        if (sliding) return;
	        if ($(this).hasClass('table-col') && $(this).closest('.table-row').hasClass('expanded')) return;
	        sliding = true;
	        $(this).parents('.table-row').toggleClass('expanded').toggleClass('hovered');
	        if ($(this).parents('.table-row').hasClass('expanded')) {
	            $(this).parents('.table-row').find('.table-row-expand').slideDown(200, function () { sliding = false; });
	        } else {
	            $(this).parents('.table-row').find('.table-row-expand').slideUp(200, function () { sliding = false; });
	        }
	        e.preventDefault();
	    });

		$('.expand-all').on('click', function(e) {
			$(this).parents('.custom-table-questions, .custom-table-tests').find('.table-row').addClass('expanded');
			$(this).parents('.custom-table-questions, .custom-table-tests').find('.table-row').find('.table-row-expand').slideDown(200);

			e.preventDefault();
		});

		$('.collapse-all').on('click', function(e) {
			$(this).parents('.custom-table-questions, .custom-table-tests').find('.table-row').removeClass('expanded');
			$(this).parents('.custom-table-questions, .custom-table-tests').find('.table-row').find('.table-row-expand').slideUp(200);

			e.preventDefault();
		});

		$('.answer-icons .fa-arrows').on('mousedown', function (e) {

	        $('.collapse-all').trigger('click');

	        e.preventDefault();
	    });

		$('.table-row-expand .col-1 .inner').on('mouseenter', function() {
			$(this).addClass('hovered');
		}).on('mouseleave', function() {
			$(this).removeClass('hovered');
		});

		// Table tests
		$('.custom-table-tests .table-row').on('mouseenter', function() {
			if (!$(this).hasClass('expanded')) {
				$(this).addClass('hovered');
			};
		}).on('mouseleave', function() {
			$(this).removeClass('hovered');
		});

		$('.custom-table-tests .table-row .inner').on('click', function () {
		    $(this).parent('.table-row').toggleClass('expanded').find('.table-row-expand').slideToggle(200);
		});

	});
})(jQuery, window, document);
