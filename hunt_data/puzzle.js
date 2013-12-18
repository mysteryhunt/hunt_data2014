mh.submit_answer = function() {
    var page = $('#mh-page');
    var outer = $('#mh-submit-answer');
    outer.css('top', page.offset().top + 20);
    outer.css('left', page.offset().left + page.innerWidth() - 20 - outer.outerWidth());
    var bg = $('#mh-submit-answer-bg');
    var inner = $('#mh-submit-answer-inner');
    bg.stop(true, true);
    outer.stop(true, true);
    if (outer.is(':visible')) {
	bg.fadeTo('slow', 0, function() {
	    bg.hide();
        });
        outer.fadeToggle('slow', function() {
	    mh.set_iframe_location('mh-submit-answer-iframe', 'javascript: void 0;');
        });
    } else {
	mh.set_iframe_location('mh-submit-answer-iframe', '{{ root }}/dynamic/submit/puzzle/{{ puzzle.puzzle.url }}/');
	bg.fadeTo('slow', 0.5);
        outer.fadeToggle('slow');
    }
};
$('#mh-submit-answer-bg').click(mh.submit_answer);
