mh.nav = function() {
    var page = $('#mh-page');
    var outer = $('#mh-nav');
    outer.css('top', page.offset().top + 20);
    outer.css('left', page.offset().left + 20);
    var bg = $('#mh-nav-bg');
    var inner = $('#mh-nav-inner');
    bg.stop(true, true);
    outer.stop(true, true);
    if (outer.is(':visible')) {
	bg.fadeTo('fast', 0, function() {
	    bg.hide();
        });
        outer.fadeToggle('slow');
    } else {
	bg.fadeTo('slow', 0.5);
        outer.fadeToggle('slow');
    }
};
$('#mh-nav-bg').click(mh.nav);