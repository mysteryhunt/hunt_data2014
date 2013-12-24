mh.nav = function() {
    var page = $('#mh-page');
    var outer = $('#mh-nav');
    outer.css('top', page.offset().top + 20);
    outer.css('left', page.offset().left + 20);
    var bg = $('#mh-nav-bg');
    $('#mh-nav-inner').html($('#mh-nav-iframe').contents().find('body').html());
    $('#mh-nav-inner a').each(function() {
	$(this).attr('src', '{{ root }}/' + $(this).attr('src'));
    });
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
