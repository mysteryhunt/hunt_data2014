// written for the MIT Mystery Hunt 2014
// author: James Clark (sbj@dimins.com)
function Arrow(ch, loc, delta) {
    this.ch = ch;
    this.loc = loc;
    this.delta = delta;
}

Arrow.prototype.tick = function() {};

Arrow.prototype.act = function(map, settle) {
    if (map.actor_push(this, this.delta, true, true))
	return true;
    map.enemies.splice(map.enemies.indexOf(this), 1);
    return true;
};

function Archer(ch, loc, delta, speed, initiative) {
    this.ch = ch;
    this.loc = loc;
    this.delta = delta;
    this.speed = speed;
    this.initiative = initiative;
}

Archer.prototype.tick = function() {
    if (this.initiative) {
	this.initiative --;
    } else {
	this.initiative = this.speed - 1;
    }
};

Archer.prototype.act = function(map, settle) {
    if (this.initiative)
	return true;
    var loc2 = this.loc.add(this.delta);
    if (!map.floor_at(loc2).is_walkable())
	return true;
    var e = map.enemy_at(loc2);
    if (e && e.ch != 'a' && e.ch != '#')
	return true;
    var a = new Arrow('a', loc2, this.delta);
    map.enemies.push(a);
    if (map.player.loc.equals(a.loc))
	throw new DeathException('player hit at point blank range by '+a.ch);
    return true;
};
