// written for the MIT Mystery Hunt 2014
// author: James Clark (sbj@dimins.com)
function Golem(ch, loc, delta, speed, initiative) {
    this.ch = ch;
    this.loc = loc;
    this.delta = delta;
    this.speed = speed;
    this.initiative = initiative;
}

Golem.prototype.tick = function() {
    if (this.initiative) {
	this.initiative --;
    } else {
	this.initiative = this.speed - 1;
    }
};

Golem.prototype.act = function(map, settle) {
    if (!this.initiative)
	map.actor_push(this, this.delta);
    return true;
};
