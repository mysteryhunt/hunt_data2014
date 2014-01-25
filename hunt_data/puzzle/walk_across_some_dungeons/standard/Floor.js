// written for the MIT Mystery Hunt 2014
// author: James Clark (sbj@dimins.com)
function Floor(ch) {
    this.ch = ch;
}

Floor.prototype.is_walkable = function() {
    return ' >%$()'.indexOf(this.ch) >= 0;
};

Floor.WALL = new Floor('+');

Floor.SPACE = new Floor(' ');
