// written for the MIT Mystery Hunt 2014
// author: James Clark (sbj@dimins.com)
function Actor(ch, loc) {
    this.ch = ch;
    this.loc = loc;
}

Actor.prototype.tick = function() {
};

Actor.prototype.act = function(map, settle) {
    return true;
};
