// written for the MIT Mystery Hunt 2014
// author: James Clark (sbj@dimins.com)
function Chomper(ch, loc, speed, initiative) {
    if (initiative < 0) {
	loc = new Location(-loc.c, -loc.r);
	initiative = -initiative;
    }
    this.ch = ch;
    this.loc = loc;
    this.speed = speed;
    this.initiative = initiative;
}

Chomper.prototype.tick = function() {
    if (this.initiative) {
	this.initiative --;
    } else {
	this.initiative = this.speed - 1;
    }
};

Chomper.prototype.act = function(map, settle) {
    if (this.initiative)
	return true;
    this.loc = new Location(-this.loc.c, -this.loc.r);
    if (map.player.loc.equals(this.loc))
	throw new DeathException('player chomped by '+this.ch);
    return true;
};
