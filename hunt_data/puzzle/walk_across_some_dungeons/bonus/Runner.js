// written for the MIT Mystery Hunt 2014
// author: James Clark (sbj@dimins.com)
function Runner(ch, loc, speed) {
    this.ch = ch;
    this.loc = loc;
    this.speed = speed;
}

Runner.prototype.tick = function() {};
Runner.prototype.act = function(map, settle) {
    if (this.act_inner(map, settle)) {
	for (var i = 1; i < this.speed; i ++) {
	    this.act_inner(map, settle);
	}
	return true;
    }
    return false;
};

Runner.prototype.act_inner = function(map, settle) {
    var d = map.player.loc.diff(this.loc);
    var h = Math.abs(d.dr) > Math.abs(d.dc);
    d.dc = d.dc < 0 ? -1 : d.dc > 0 ? 1 : 0;
    d.dr = d.dr < 0 ? -1 : d.dr > 0 ? 1 : 0;
    if (h) {
	if (d.dr == 0 || map.actor_push(this, new Delta(0, d.dr)))
	    return true;
    } else {
	if (d.dc == 0 || map.actor_push(this, new Delta(d.dc, 0)))
	    return true;
    }
    if (!settle)
	return false;
    if (!h) {
	if (d.dr)
	    map.actor_push(this, new Delta(0, d.dr));
    } else {
	if (d.dr)
	    map.actor_push(this, new Delta(d.dc, 0));
    }
    return true;
};
