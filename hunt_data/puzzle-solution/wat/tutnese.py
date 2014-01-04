import sys
import re

r = []
for x in sys.stdin.readlines():
    x = re.sub(r'([a-z])\1', r'*\1', x)
    for y in x.lower():
        if y == "*":
            r.append("squa")
        elif y == "b":
            r.append("bub")
        elif y == "c":
            r.append("cash")
        elif y == "d":
            r.append("dud")
        elif y == "f":
            r.append("fuf")
        elif y == "g":
            r.append("gug")
        elif y == "h":
            r.append("hash")
        elif y == "j":
            r.append("jay")
        elif y == "k":
            r.append("kuck")
        elif y == "l":
            r.append("lul")
        elif y == "m":
            r.append("mum")
        elif y == "n":
            r.append("nun")
        elif y == "p":
            r.append("pub")
        elif y == "q":
            r.append("quack")
        elif y == "r":
            r.append("rug")
        elif y == "s":
            r.append("sus")
        elif y == "t":
            r.append("tut")
        elif y == "v":
            r.append("vuv")
        elif y == "w":
            r.append("wack")
        elif y == "x":
            r.append("ex")
        elif y == "y":
            r.append("yub")
        elif y == "z":
            r.append("zub")
        else:
            r.append(y)
print(''.join(r))
