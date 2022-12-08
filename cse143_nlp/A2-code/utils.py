# from nltk.tokenize import regexp_tokenize
import numpy as np

class FeatureExtractor(object):
    def __init__(self):
        pass
    def fit(self, text_set, alpha):
        pass
    def transform_list(self, text_set):
        pass

class UnigramFeature(FeatureExtractor):
    def __init__(self):
        self.dict = {}
        
    def fit(self, text_set: list, alpha):
        for line in text_set:
            for i in range(0, len(line)):
                key = line[i]
                if key not in self.dict:
                    self.dict[key] = 1
                else:
                    self.dict[key] += 1

        unk = 0
        unkKeys = []
        for k in self.dict:
            if self.dict[k] < 3:
                unk += self.dict[k]
                unkKeys.append(k)

        self.dict["<UNK>"] = unk
        for k in unkKeys:
            self.dict.pop(k) 

        for k in self.dict:
            self.dict[k] += alpha

class BigramFeature(FeatureExtractor):

    def __init__(self):
        self.dict = {}
    
    def fit(self, text_set, alpha, unigram):
        for line in text_set:
            for i in range(0, len(line)):
                if i > 0:
                    front = line[i] if line[i] in unigram.dict else "<UNK>"
                    back = line[i-1] if line[i-1] in unigram.dict else "<UNK>"
                    key = back + " " + front

                    if key not in self.dict:
                        self.dict[key] = 1
                    else:
                        self.dict[key] += 1

        for k in self.dict:
            self.dict[k] += alpha

class TrigramFeature(FeatureExtractor):
   
    def __init__(self):
        self.dict = {}
    def fit(self, text_set, alpha, unigram):
        for line in text_set:
            for i in range(0, len(line)):
                if i > 1:
                    first = line[i] if line[i] in unigram.dict else "<UNK>"
                    second = line[i-1] if line[i-1] in unigram.dict else "<UNK>"
                    third = line[i-2] if line[i-2] in unigram.dict else "<UNK>"
                    key = third + " " + second + " " + first
                    
                    if key not in self.dict:
                        self.dict[key] = 1
                    else:
                        self.dict[key] += 1

        for k in self.dict:
            self.dict[k] += alpha
