// written for the MIT Mystery Hunt 2014
// author: James Clark (sbj@dimins.com)
function Location(c, r) {
    this.c = c;
    this.r = r;
}

Location.prototype.equals = function(other) {
    return this.r == other.r && this.c == other.c;
};

Location.prototype.index = function(map) {
    if (this.r < 0 || this.c < 0)
	return -1;
    return this.r * map.width + this.c;
};

Location.prototype.add = function(other) {
    if (!other)
	return this;
    return new Location(this.c + other.dc, this.r + other.dr);
};

Location.prototype.sub = function(other) {
    if (!other)
	return this;
    return new Location(this.c - other.dc, this.r - other.dr);
};

Location.prototype.diff = function(other) {
    if (!other)
	return this;
    return new Delta(this.c - other.c, this.r - other.r);
};

Location.prototype.distance = function(other) {
    return Math.abs(this.r - other.r) + Math.abs(this.c - other.c);
};
