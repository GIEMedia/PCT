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
		$('.file-trigger').on('click', function(e) {
			$(this).parent().find('.field-file').trigger('click');

			e.preventDefault();
		});

		// Table questions

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
