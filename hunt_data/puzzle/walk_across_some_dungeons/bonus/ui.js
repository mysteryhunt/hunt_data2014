// written for the MIT Mystery Hunt 2014
// author: James Clark (sbj@dimins.com)
var map;
var max = +($.cookie('max') || 1);
var cur = +($.cookie('cur') || 1);
function render() {
    header = 'level: '+cur+'/'+map_data.length;
    if (cur > 1)
	header += ' <a href="javascript:load_map(cur-1);">previous</a>';
    if (cur < max)
	header += ' <a href="javascript:load_map(cur+1);">next</a>';
    $('#h').html(header);
    $('#x').text(map.render());
}
function load_map(id) {
    map = new Map(id, map_data[id-1]);
    cur = id;
    max = Math.max(max, cur);
    $.cookie('max', max, { expires: 365 });
    $.cookie('cur', cur, { expires: 365 });
    render();
}

load_map(cur);

$(document.body).keydown(function(event) {
    if (event.which == 33 && cur < map_data.length) {
	load_map(cur+1);
	return;
    } else if (event.which == 34 && cur > 1) {
	load_map(cur-1);
	return;
    }
    try {
	map.action(event.which);
	render();
    } catch (e) {
	if (e instanceof DeathException) {
	    load_map(cur);
        } else if (e instanceof EscapeException) {
	    load_map(cur+1);
	} else {
	    throw e;
	}
    }
});

