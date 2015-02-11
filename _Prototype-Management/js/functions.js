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
		$('.btn-plus').on('mouseenter', function() {
			if (!$(this).hasClass('clicked')) {
				$(this).addClass('hovered');
			};
		}).on('mouseleave', function() {
			$(this).removeClass('hovered');
		});

		$('.btn-plus').on('click', function() {
			$(this).removeClass('hovered').toggleClass('clicked');
		});

		$('.btn-plus-inner').on('mouseenter', function() {
			$(this).addClass('hovered');
		}).on('mouseleave', function() {
			$(this).removeClass('hovered');
		});

		$doc.mouseup(function (e) {
			var container = $(".btn-plus");
			if (container.has(e.target).length === 0) { container.find('.btn-plus-inner').parent().removeClass('clicked'); }
		});

		$('.file-trigger').on('click', function(e) {
			$(this).parent().find('.field-file').trigger('click');

			e.preventDefault();
		});

		// Table states dropdown
		$('.table-states .arrow-circle-down').on('click', function(e) {
			$('.table-states').find('.table-expand').stop(true, true).slideDown(200);

			e.preventDefault();
		});

		$('.table-states .arrow-circle-up').on('click', function(e) {
			$('.table-states').find('.table-expand').stop(true, true).slideUp(200);

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

		$('.answer-icons .arrow-circle-down-blue').on('click', function(e) {
			$(this).parents('.table-row').addClass('expanded');
			$(this).parents('.table-row').find('.table-row-expand').slideDown(200);

			e.preventDefault();
		});

		$('.question-icons .arrow-circle-up').on('click', function(e) {
			$(this).parents('.table-row').removeClass('expanded');
			$(this).parents('.table-row').find('.table-row-expand').slideUp(200);

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

		$('.custom-table-tests .arrow-circle-down').on('click', function() {
			$(this).parents('.table-row').toggleClass('expanded').find('.table-row-expand').slideToggle(200);
		});

		// Custom selectbox
		if ($('select').length) {
			$('select').selectBoxIt({
				autoWidth: false,
				showFirstOption: false
			});
		};

		// Popup
		$(".popup-open").fancybox({
			maxWidth	: 750,
			width		: 'auto',
			height		: 'auto',
			fitToView	: false,
			autoSize	: false,
			closeClick	: false
		});
	});
})(jQuery, window, document);
