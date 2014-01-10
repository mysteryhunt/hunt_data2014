var mh = {};
(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .css('user-drag', 'none')
                 .on('selectstart', false);
    };
})(jQuery);
$('#mh-controls, #mh-controls > *').disableSelection();
mh.set_iframe_location = function(id, location) {
    var iframe = $('#'+id)[0];
    var iframe_window = iframe.contentWindow || iframe.contentDocument.defaultView;
    iframe_window.location.replace(location);
};
