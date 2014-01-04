import sys
import re
import os

stack = []

def call(parent_env, path, prog):
    # generate a new dynamic scope
    env = dict()
    env["_parent_"] = parent_env
    eval(env, path, prog)

def eval(env, path, prog):
    if type(prog) != list:
        raise Exception("cannot eval "+str(prog))
    i = 0
    while i < len(prog):
        t = prog[i]
        i += 1
        if t[0:8] == "&#x2039;": # push identifier
            stack.append(t[8:-8])
        elif t == "print": # for debugging
            a = stack.pop()
            print(a)
        elif t == "plead": # import
            n = stack.pop()
            if type(n) != str:
                raise Exception("invalid argument to "+t+": "+str(n))
            evalfile(env, os.path.join(path, n+".wl"))
        elif t == "callay": # declare variable
            env[stack.pop()] = 0
        elif t == "uff": # assign variable
            n = stack.pop()
            if type(n) != str:
                raise Exception("invalid argument to "+t+": "+str(n))
            v = stack.pop()
            e = env
            while e and n not in e and "_parent_" in e:
                e = e["_parent_"]
            if n in e:
                e[n] = v
            else:
                raise Exception("undeclared: "+str(v))
        elif t == "mome": # eval
            call(env, "__", stack.pop())
        elif t == "gyre": # if
            c = stack.pop()
            if type(c) != bool:
                raise Exception("invalid argument to "+t+": "+str(n))
            b = stack.pop()
            a = stack.pop()
            if c:
                call(env, "__", a)
            else:
                call(env, "__", b)
        elif t == "gimble": # append
            b = stack.pop()
            a = stack.pop()
            stack.append(a + [b])
        elif t == "whiffle": # concat
            b = stack.pop()
            a = stack.pop()
            stack.append(a + b)
        elif t == "grend": # extract
            b = stack.pop()
            a = stack.pop()
            stack.append(a[b]) # 0-indexed
        elif t == "munch": # subarray
            c = stack.pop()
            b = stack.pop()
            a = stack.pop()
            stack.append(a[b:b+c]) # 0-indexed
        elif t == "frabjion": # length
            a = stack.pop()
            if type(a) != list:
                raise Exception("invalid argument to "+t+": "+str(n))
            stack.append(len(a))
        elif t == "&#x261E;": # begin cpmment
            count = 1
            while count > 0:
                t = prog[i]
                i += 1
                if t == "&#x261E;":
                    count += 1
                elif t == "&#x261C;":
                    count -= 1
        elif t == "&#x00AB;": # begin code block
            count = 1
            block = []
            while count:
                t = prog[i]
                i += 1
                if t == "&#x00AB;":
                    count += 1
                elif t == "&#x00BB;":
                    count -= 1
                if count:
                    block.append(t)
            stack.append(block)
        elif t == "&#x2660;": # add
            b = stack.pop()
            a = stack.pop()
            stack.append(a + b)
        elif t == "&#x2663;": # subtract
            b = stack.pop()
            a = stack.pop()
            stack.append(a - b)
        elif t == "&#x2665;": # multiply
            b = stack.pop()
            a = stack.pop()
            stack.append(a * b)
        elif t == "&#x2601;": # modulo
            b = stack.pop()
            a = stack.pop()
            stack.append(a % b)
        elif t == "&#x260A;": # less than
            b = stack.pop()
            a = stack.pop()
            stack.append(a < b)
        elif t == "&#x260B;": # greater than
            b = stack.pop()
            a = stack.pop()
            stack.append(a > b)
        elif t == "&#x263A;": # equals
            b = stack.pop()
            a = stack.pop()
            stack.append(a == b)
        elif t == "&#x2205;": # empty list
            stack.append([])
        elif re.match("[0A23456789TJQK]+", t): # numbers base 14 using playing card digits
            v = 0
            for d in t:
                if d == "A":
                    v = v * 14 + 1
                elif d == "T":
                    v = v * 14 + 10
                elif d == "J":
                    v = v * 14 + 11
                elif d == "Q":
                    v = v * 14 + 12
                elif d == "K":
                    v = v * 14 + 13
                else:
                    v = v * 14 + int(d)
            stack.append(v)
        else:
            e = env
            while e and t not in e and "_parent_" in e:
                e = e["_parent_"]
            if t in e:
                stack.append(e[t])
            else:
                raise Exception("undeclared: "+str(t))

def evalfile(env, file):
    # read file, strip html tags, split into tokens
    prog = re.sub("<.*?>","",open(file, 'r').read()).split()
    eval(env, os.path.dirname(file), prog)

evalfile(dict(), sys.argv[1])
print (str(stack))
