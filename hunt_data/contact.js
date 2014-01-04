mh.submit_contact = function() {
    var page = $('#mh-page, #mh-surface');
    var outer = $('#mh-submit-contact');
    outer.css('top', page.offset().top + 20);
    outer.css('left', page.offset().left + page.innerWidth() - 20 - outer.outerWidth());
    var bg = $('#mh-submit-contact-bg');
    var inner = $('#mh-submit-contact-inner');
    bg.stop(true, true);
    outer.stop(true, true);
    if (outer.is(':visible')) {
	bg.fadeTo('fast', 0, function() {
	    bg.hide();
        });
        outer.fadeToggle('slow', function() {
	    mh.set_iframe_location('mh-submit-contact-iframe', 'javascript: void 0;');
        });
    } else {
	mh.set_iframe_location('mh-submit-contact-iframe', '{{ root }}/dynamic/submit/contact/');
	bg.fadeTo('slow', 0.5);
        outer.fadeToggle('slow');
    }
};
$('#mh-submit-contact-bg').click(mh.submit_contact);
