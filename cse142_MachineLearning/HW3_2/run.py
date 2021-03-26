import numpy as np

def run(Xtrain_file, Ytrain_file, test_file, pred_file, k):
	# print("HELLOO")
	x = np.loadtxt(Xtrain_file, delimiter=',')
	y = np.loadtxt(Ytrain_file, delimiter=',')
	xTest = np.loadtxt(test_file, delimiter=',')
	# xTest = x.copy()
	xTest = np.array( [xTest[9], xTest[19], xTest[29], xTest[39]] )
	x = np.delete(x, 39, 0)
	x = np.delete(x, 29, 0)
	x = np.delete(x, 19, 0)
	x = np.delete(x, 9, 0)
	# print(len(x))

	trainData = {}
	for i in range(len(x)):
		trainData[i] = {"point": x[i], "label":y[i]}
	
	# k = 1
	# for p in x:
	# 	print(p)

	prediction = []
	for p in xTest:
		# print("--------------NewPoint--------------")
		distances = []
		for i in range(k):
			distances.append({"d": 0, "label": 0})

		for i in trainData:
			d = distance(trainData[i]["point"], p)
			currPoint = trainData[i]["point"]
			currLabel = trainData[i]["label"]
			temp = {"d": d, "label": currLabel}
			# print(temp)
			for i in range(k):
				# print(temp)
				if distances[i]["d"] > d:
					distances.insert(i, temp)
					# print("case2")
					break
				if distances[i]["label"] == 0:
					distances[i] = temp
					# print("case1")
					break
				

		# print("----------Distances----------")
		# for i in range(len(distances)):
		# 	print("i:", i, " = ", distances[i])

		labelCount = [0] * 11
		for i in range(k):
			labelCount[int(distances[i]["label"])] += 1

		m = 0
		mi = 0
		for i in range(len(labelCount)):
			if labelCount[i] > m:
				m = labelCount[i]
				mi = i

		prediction.append(float(mi)) 

		# print(labelCount)
	# print(prediction)

	correct = 0
	for i in range(len(prediction)):
		if prediction[i] == i+1:
			correct += 1

	print("k:",k," ----- Accuracy:",correct,"/ 4")

	np.savetxt(pred_file, prediction, delimiter=",", fmt='%1.1f')




def distance(v1, v2):
	return np.linalg.norm(np.subtract(v1,v2))

def main():
	Xtrain_file = "./ref/Xtrain.csv"
	Ytrain_file = "./ref/Ytrain.csv"

	# test_file = "./ref/Xtest.csv"
	test_file = "./ref/Xtrain.csv"
	
	pred_file = "./ref/prediction.csv"

	for i in range(1, 11):
		run(Xtrain_file, Ytrain_file, test_file, pred_file, i) 

if __name__ == "__main__":
	main()