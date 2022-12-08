import numpy as np
import math
# You need to build your own model here instead of using well-built python packages such as sklearn

# from sklearn.naive_bayes import MultinomialNB
# from sklearn.linear_model import LogisticRegression
# You can use the models form sklearn packages to check the performance of your own models

class HateSpeechClassifier(object):
    """Base class for classifiers.
    """
    def __init__(self):
        pass
    def fit(self, X, Y):
        """Train your model based on training set
        
        Arguments:
            X {array} -- array of features, such as an N*D shape array, where N is the number of sentences, D is the size of feature dimensions
            Y {type} -- array of actual labels, such as an N shape array, where N is the nu,ber of sentences
        """
        pass
    def predict(self, X):
        """Predict labels based on your trained model
        
        Arguments:
            X {array} -- array of features, such as an N*D shape array, where N is the number of sentences, D is the size of feature dimensions
        
        Returns:
            array -- predict labels, such as an N shape array, where N is the nu,ber of sentences
        """
        pass


class AlwaysPreditZero(HateSpeechClassifier):
    """Always predict the 0
    """
    def predict(self, X):
        return [0]*len(X)

# TODO: Implement this
class NaiveBayesClassifier(HateSpeechClassifier):
    """Naive Bayes Classifier
    """
    def __init__(self):
        self.classArray1 = 0
        self.classArray2 = 0
        self.prob1 = 0
        self.prob2 = 0
        pass
        
    def fit(self, X, Y, words): #added the unigram dict
        self.classArray1 = np.zeros(X[0].size)
        self.classArray2 = np.zeros(X[0].size)
        num1, num2 = 0, 0

        print(X[0].size)

        for i in range(len(X)):
            if Y[i] == 1:
                self.classArray1 += X[i]
                num1 += 1
            else:
                self.classArray2 += X[i]
                num2 += 1

        self.prob1 = num1/(num1 + num2)
        self.prob2 = num2/(num1 + num2)
        laplace = self.classArray2.size
        self.classArray1 = (self.classArray1 + 1)/(np.sum(self.classArray1) + laplace)
        self.classArray2 = (self.classArray2 + 1)/(np.sum(self.classArray2) + laplace)
    
        # --- Top Words Thing ---
        setting = "max" #change to min to change result
        thing = self.classArray1/self.classArray2
        topList = [] #list that will contain the words
        otherList = [] #list that contains respective ratios
        while True:
            if setting == "max":
                result = np.where(thing == np.amax(thing))
                num = np.amax(thing)
            else:
                result = np.where(thing == np.amin(thing))
                num = np.amin(thing)
            # Add all found words into list
            for r in result[0]:
                topList.append(r)
                otherList.append(num)
                if len(topList) == 10: break
                if setting == "max": thing[r] = 0
                else: thing[r] = 999
            if len(topList) == 10: break
        print(topList)

        keys = list(words.keys())
        vals = list(words.values())
        temp = 0
        for i in topList:
            print(keys[vals.index(i)], "=", otherList[temp])
            temp += 1
        # ---------


    def predict(self, X):
        prediction = []
        for i in range(len(X)):
            prob1 = math.log(self.prob1) + np.sum(np.log(self.classArray1)*X[i])
            prob2 = math.log(self.prob2) + np.sum(np.log(self.classArray2)*X[i])
            
            if prob1 > prob2: prediction.append(1)
            else: prediction.append(0)

        return prediction

# TODO: Implement this
class LogisticRegressionClassifier(HateSpeechClassifier):
    """Logistic Regression Classifier
    """
    def __init__(self):
        self.learnRate = 0.1
        self.weightArray = 0
        self.bias = 0
        self.alpha = 10
        pass
        
    def sigmoid(self, v, w):
        return (1/(1 + math.exp(-(np.dot(v,w) + self.bias))))

    def fit(self, X, Y, words):
        self.weightArray = np.zeros(X[0].size)

        # --- Schocastic Descent ---
        for n in range(40):
            print("training run:", n)
            for i in range(len(X)):
                # --- Without L2---
                # gradient = (Y[i] - self.sigmoid(X[i], self.weightArray))
                # self.bias += gradient * self.learnRate
                # self.weightArray += (gradient * X[i]) - (self.alpha * self.weightArray*2)

                # with L2
                gradient = self.sigmoid(X[i], self.weightArray) - Y[i]
                self.bias -= gradient * self.learnRate
                L2 = self.alpha * self.weightArray
                self.weightArray -= self.learnRate * ((gradient* X[i]) + L2)



        print(self.weightArray)
    
    def predict(self, X):
        prediction = []
        for i in range(len(X)):
            prob = self.sigmoid(X[i], self.weightArray)
            # prob -= self.alpha * np.sum(self.weightArray**2)
            if prob > 0.5: prediction.append(1)
            else: prediction.append(0)
        return prediction


# you can change the following line to whichever classifier you want to use for bonus
# i.e to choose NaiveBayes classifier, you can write
# class BonusClassifier(NaiveBayesClassifier):
class BonusClassifier(NaiveBayesClassifier):
    def __init__(self):
        super().__init__()
