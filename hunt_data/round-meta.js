mh.submit_answer = function() {
    var outer = $('#mh-submit-answer');
    var inner = $('#mh-submit-answer-inner');
    outer.stop(true, true);
    if (outer.is(':visible')) {
        outer.fadeToggle('slow', function() {
            inner.html('');
        });
    } else {
        inner.html('<iframe src="{{ root }}/dynamic/submit/metapuzzle/{{ round.round.url }}/" id="mh-submit-answer-iframe"></iframe>');
        outer.fadeToggle('slow');
    }
};
