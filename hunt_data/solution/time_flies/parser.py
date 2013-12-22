#!/usr/bin/env python


## Parser for "Time Flies" puzzle
## Simply run the program; the rules and lexicon are embedded.


# count number of parses in sentence, given grammar and start node
def parse(sentence, grammar, start):

    # helper function, takes left index, right index, and root node of subtree
    def helper(left, right, root):
        if (left, right, root) not in num: # not already computed
            total = 0
            for rule in grammar: 
                if rule[0] == root: # if left-hand side of rule matches root
                    if len(rule) == 2: # if unary rule (including lexicon)
                        total += helper(left, right, rule[1])
                    elif len(rule) == 3: # if binary rule
                        for split_point in range(left+1, right):
                            parses_left = helper(left, split_point, rule[1])
                            parses_right = helper(split_point, right, rule[2])
                            total += parses_left*parses_right
            num[(left, right, root)] = total
        return num[(left, right, root)]

    # split sentence into words
    words = sentence.split()         

    # dictionary for memoizing
    num = {}
    for index, word in enumerate(words):
        num[(index, index+1, word)] = 1 # terminal nodes have one unique parse
 
    return helper(0, len(words), start)


# sentences
sentences = [
 "an american flag was hanging in front of every building",
 "buffalo buffalo buffalo buffalo buffalo buffalo buffalo buffalo",
 "colorless green ideas sleep furiously",
 "daddy what did you bring that book that i don't want to be read to out of up for",
 "every farmer who owns a donkey beats it",
 "flying planes can be dangerous",
 "the gostak distims the doshes",
 "the horse raced past the barn fell",
 "i saw the man with the binoculars",
 "james while john had had had had had had had had had had had a better effect on the teacher"
]


# grammar
grammar = filter(lambda x: len(x) > 0 and x[0]!='#', map(lambda x: x.split(),
        """
S  AP EP
S  BP
S  CP UP
S  DP EP
S  EP UP
S  FP VP
S  GP XP
S  HP
S  IP VP
S  JP IP

AP WP YP

BP A
BP A BP

CP B YP

DP A IP

EP C EP
EP C XP

FP A JP

GP UP A

HP UP YP

IP B EP
IP B IP

JP A JP
JP UP UP

UP VP
UP X

VP WP
VP X

WP X

XP X
XP XP XP

YP X YP
YP YP Y
YP ZP

ZP Z
ZP Z YP
ZP ZP Y

A  buffalo
A  daddy
A  flying
A  gostak
A  had
A  james
A  john
A  planes
A  while

B  book
B  bring
B  colorless
B  did
B  don't
B  effect
B  i
B  that
B  what
B  you

C  every
C  farmer
C  of
C  on
C  out
C  saw
C  to
C  up
C  want
C  who

X  a
X  an
X  be
X  beats
X  better
X  binoculars
X  building
X  can
X  dangerous
X  distims
X  donkey
X  doshes
X  flag
X  for
X  furiously
X  hanging
X  it
X  man
X  owns
X  past
X  raced
X  read
X  teacher
X  the
X  was
X  with

Y  fell
Y  front
Y  sleep

Z  american
Z  barn
Z  green
Z  horse
Z  ideas
Z  in
""".split('\n')))


# start node/root (S for sentence)
start = 'S'


# parse sentences and give A=1... mapping
print "(count)\t(A=1)\t(sentence)"
for sentence in sentences:
    num_parses = parse(sentence, grammar, start)
    letter = chr(num_parses+ord('A')-1) if 1<=num_parses<=26 else None
    print "%s\t%s\t%s" % (num_parses, letter, sentence)
