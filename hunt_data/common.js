var mh = {};
(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .css('user-drag', 'none')
                 .on('selectstart', false)
    };
})(jQuery);
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
$('#mh-controls, #mh-controls > *').disableSelection();
mh.set_iframe_location = function(id, location) {
    var iframe = $('#'+id)[0];
    var iframe_window = iframe.contentWindow || iframe.contentDocument.defaultView;
    iframe_window.location.replace(location);
};
