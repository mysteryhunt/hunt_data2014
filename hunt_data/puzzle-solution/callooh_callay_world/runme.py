def deficious():
    global seed
    seed = (seed * 10001 + 12345) % 65536
    return seed

seed = 42
sword = []
for i in range(18):
    sword.append(deficious())
sword = sorted(sword)

def snack(n):
    global jabberwock
    print(jabberwock[:n])
    jabberwock = jabberwock[n:]

def frolick():
    global jabberwock
    for i in range(len(jabberwock)):
        jabberwock[i] = ((jabberwock[i] + sword[i] - 1) % 26) + 1

def tweedle():
    global jabberwock
    jabberwock = list(reversed(jabberwock))

def modge():
    global jabberwock
    a = []
    b = []
    for i in range(len(jabberwock)):
        if i % 2 == 0:
            a.append(jabberwock[i])
        else:
            b.append(jabberwock[i])
    jabberwock = a + b

def priot():
    for i in reversed(range(1, len(jabberwock))):
        t = jabberwock[i] - jabberwock[i-1]
        if t < 1:
            t = t + 26
        jabberwock[i] = t

jabberwock = [20, 8, 5, 3, 25, 18, 16, 5, 5, 10, 17, 19, 24, 24, 5, 5, 11, 4, 9, 25, 2]

snack(3)

tweedle()
frolick()
snack(6)

tweedle()
modge()
frolick()
snack(2)

tweedle()
modge()
priot()
frolick()
snack(10)

