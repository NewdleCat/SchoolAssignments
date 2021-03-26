import numpy as np

class BoostingClassifier:

    def __init__(self):
        # initialize the parameters here
        self.M = []
        self.alpha = []
        self.T = 5
        pass
    

    def fit(self, x, y):
        

        wMul = [1/len(x), 1/len(x)]
        w = [1]*len(x)
        correct = [0] * len(x)        
        t = 0
        errorRate = 0

        # Start of the main loop
        # for t in range(self.T):
        while t < self.T:
            print("-------------------------------")
            print("Iteration: ", t + 1)
            
            # Update the weights
            for i in range(len(w)):
                w[i] = w[i] * wMul[correct[i]]

            # print(w)

            currModel = createClassifier(x, y, w)

            correct = []
            errors = 0
            errorTop, errorBot = 0, 0
            for i in range(len(x)):
                p = x[i]
                v = currModel
                pred = np.sign( useFunction(currModel, p) )
                if pred == y[i]:
                    correct.append(1)
                else:
                    correct.append(0)
                    errors += 1
                    if t > 0:
                        errorTop += w[correctOld[i]]
                
                if t > 0:
                    errorBot += w[correctOld[i]]

            correctOld = correct.copy()

            #Calculating The Error Rate 
            if t == 0:
                errorRate = errors/len(x)
            else:
                errorRate = errorTop/errorBot

            print("Error:", round(errorRate, 4))
            a = (0.5) * np.log( (1-errorRate)/errorRate )
            print("Alpha:", round(a, 4))

            self.M.append(currModel)
            self.alpha.append(a)

            # Set new weight multipliers
            wMul[0] = 1 / (2*errorRate)
            wMul[1] = 1 / (2*(1 - errorRate))
            print("Factor to increase weights =", round(wMul[0], 2))
            print("Factor to decrease weights =", round(wMul[1], 2))

            # print(correct)

            t += 1
            print("-------------------------------")


        print("Testing: ")
        FN, FP = 0, 0
        for i in range(len(x)):
            p = 0

            for t in range(len(self.M)):
                p += self.alpha[t] * useFunction(self.M[t], x[i])
            p = np.sign(p)

            if p != y[i]:
                if p == -1:
                    FN += 1
                else:
                    FP += 1

        print("False positives:", FP)
        print("False negatives:", FN)

        er = ((FP+FN)/len(x)) * 100
        print("Error rate:", round(er, 2))



        pass

        return self

    def predict(self, X):

        pred = np.ones(X.shape[0], dtype=int)
        
        for i in range(len(X)):
            s = 0
            for t in range(len(self.M)):
                s += self.alpha[t] * useFunction(self.M[t], X[i])

            pred[i] = np.sign(s)

        return pred


def useFunction(f, p):
    num = 0
    for i in range(len(f)):
        # print("i: ", i, "----f:", f, "-----p:", p)
        if i == len(f) - 1:
            num = num -f[i]
            break
        else:
            num += p[i] * f[i]

    return num

def createClassifier(x, y, w):
    x1, y1, x2, y2, z1, z2 = 0, 0, 0, 0, 0, 0
    wSum = 0
    pLen = len(x[0])
    for i in range(len(x)):
        p = x[i]
        if y[i] == 1:
            x1 += p[0] * w[i]
            y1 += p[1] * w[i]
            if pLen == 3:
                z1 += p[2] * w[i]
        elif y[i] == -1:
            x2 += p[0] * w[i]
            y2 += p[1] * w[i]
            if pLen == 3:
                z2 += p[2] * w[i]
        wSum += w[i]

    if pLen == 2:
        p1 = divide([x1, y1], wSum) 
        p2 = divide([x2, y2], wSum) 
    else:
        p1 = divide([x1, y1, z1], wSum) 
        p2 = divide([x2, y2, z2], wSum)


    vec = normalize(sub(p1, p2))
    d = add(p1, p2)
    d = divide(d, 2)
    d = dot(vec, d)
    vec.append(d)

    return vec

def sub(v1, v2):
    newPoint = []
    for i in range(len(v1)):
        newPoint.append(v1[i] - v2[i])
    return newPoint

# v1 + v2
def add(v1, v2):
    newPoint = []
    for i in range(len(v1)):
        newPoint.append(v1[i] + v2[i])
    return newPoint

def divide(v, s):
    newPoint = []
    for i in range(len(v)):
        newPoint.append(v[i] / s)
    return newPoint

def magnitude(v):
    return (v[0]**2 + v[1]**2)**0.5
    s = 0
    for i in range(len(v)):
        s += v[i]**2
    s = s ** 0.5
    return s

def normalize(v):
    mag = magnitude(v)
    newPoint = []
    for i in range(len(v)):
        newPoint.append(v[i]/mag)
    return newPoint

def dot(v1, v2):
    s = 0
    for i in range(len(v1)):
        s += v1[i] * v2[i]
    return s