var mh = {};
(function() {
    $('#mh-controls > *').css('opacity',0).css('top',20).animate({
	opacity: 1,
	top: 0
    }, 1000).mouseenter(function(e) {
	$(e.target).animate({ top: -2 }, 100, 'linear').animate({ top: 0 }, 100, 'linear');
    });
    mh.plain_toggle = function() {
	$(document.body).toggleClass('mh-plain mh-fancy');
	var b = $('#mh-plain-toggle');
	b.text(b.text() == 'Back' ? 'Printable' : 'Back');
    };
})();
