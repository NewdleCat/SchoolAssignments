# import pandas as pd
from utils import *
import numpy as np
import time
import argparse
import math

def main():

    def calculatePerplexity(text, mode):
        # mode = 0 --> unigram
        # mode = 1 --> bigram
        # mode = 2 --> trigram
        # mode = 3 --> linear interpolation
        N = 0
        for w in unigram.dict:
            if w == "<START>": continue
            N += unigram.dict[w]

        total = 0
        test = 1
        V = len(unigram.dict)
        M = 0
        skip = False
        for s in text:
            for i in range(len(s)):
                x, y, z = 0, 0, 0
                if (i > 1 and mode > 1) or (i > 1 and mode == 3): #trigram
                    first = s[i] if s[i] in unigram.dict else "<UNK>"
                    second = s[i-1] if s[i-1] in unigram.dict else "<UNK>"
                    third = s[i-2] if s[i-2] in unigram.dict else "<UNK>"

                    key = third + " " + second + " " + first
                    back = third + " " + second

                    if key in trigram.dict: top = trigram.dict[key]
                    else: 
                        skip = True
                        continue
                    if back in bigram.dict: bot = bigram.dict[back]
                    else: 
                        skip = True
                        continue

                    z = top/(bot + (V * alpha))
                    total += math.log2(z)

                    if mode < 3: 
                        M += 1
                        continue
                
                if (i > 0 and mode > 0) or (i > 0 and mode == 3): #bigram
                    front = s[i] if s[i] in unigram.dict else "<UNK>"
                    back = s[i-1] if s[i-1] in unigram.dict else "<UNK>"
                    key = back + " " + front

                    if key in bigram.dict: top = bigram.dict[key]
                    else: 
                        skip = True #comment this line to remove the infinities
                        continue
                    if back in unigram.dict: bot = unigram.dict[back]
                    else:
                        skip = True
                        continue
                    
                    y = top/(bot + (V * alpha))
                    total += math.log2(y)

                    if mode < 3: 
                        M += 1
                        continue
                
                if i == 0 or mode == 0 or mode == 3: #unigram
                    key = s[i]
                    if key == "<START>": continue
                    if key in unigram.dict:
                        x = unigram.dict[key]/(N + (V*alpha))
                    else:
                        x = unigram.dict["<UNK>"]/(N + (V*alpha))
                    total += math.log2(x)
                    if mode < 3: 
                        M += 1
                        continue
                
                if mode == 3: 
                    M += 1
                    if i == 1:
                        z = y

                    test += math.log2((0.1*x) + (0.3*y) + (0.6*z))

        if mode == 3: 
            l = test / (M)
        else: l = total / M
        
        if skip:
            perplexity = math.inf #you can also comment out this line to get rid of infinities
        else:
            perplexity = 2**(-l)

        op = ["unigram", "bigram", "trigram", "interpolation"]
        print("%s: %f" % (op[mode], perplexity))
        return perplexity
    
    parser = argparse.ArgumentParser()
    parser.add_argument('--smoothing', '-s', type=int, default=0)
    args = parser.parse_args()
    alpha = args.smoothing
    
    with open('data/1b_benchmark.train.tokens') as f:
        lines = f.readlines()
    text = tokenize(lines)

    unigram = UnigramFeature()
    bigram = BigramFeature()
    trigram = TrigramFeature()


    print("--- Fitting Text ---")
    unigram.fit(text, alpha)
    bigram.fit(text, alpha, unigram)
    trigram.fit(text, alpha, unigram)
    print("unigram:", len(unigram.dict))
    print("bigram:", len(bigram.dict))
    print("trigram:", len(trigram.dict))
    print("--------------------")

    # with open('test') as f:
    #     lines = f.readlines()
    # print("--- HDTV Set ---")
    # text = tokenize(lines)
    # x = calculatePerplexity(text, 0)
    # y = calculatePerplexity(text, 1)
    # z = calculatePerplexity(text, 2)
    # j = calculatePerplexity(text, 3)
    # print("-----------------")

    with open('data/1b_benchmark.train.tokens') as f:
        lines = f.readlines()
    text = tokenize(lines)
    print("--- Train Set ---")
    calculatePerplexity(text, 0)
    calculatePerplexity(text, 1)
    calculatePerplexity(text, 2)
    calculatePerplexity(text, 3)
    print("-----------------")

    with open('data/1b_benchmark.dev.tokens') as f:
        lines = f.readlines()
    text = tokenize(lines)
    print("---  Dev Set  ---")
    calculatePerplexity(text, 0)
    calculatePerplexity(text, 1)
    calculatePerplexity(text, 2)
    calculatePerplexity(text, 3)
    print("-----------------")

    with open('data/1b_benchmark.test.tokens') as f:
        lines = f.readlines()
    text = tokenize(lines)
    print("--- Test Set ---")
    calculatePerplexity(text, 0)
    calculatePerplexity(text, 1)
    calculatePerplexity(text, 2)
    calculatePerplexity(text, 3)
    print("-----------------")

def tokenize(lines):
    text = []
    for line in lines:
        temp = line.split()
        temp.append("<STOP>")
        temp.insert(0, "<START>")
        text.append(temp)
    return text

if __name__ == '__main__':
    main()