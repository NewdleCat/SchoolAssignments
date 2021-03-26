import numpy as np

def run(Xtrain_file, Ytrain_file, test_file, pred_file):
	print("--------------Starting Run Function--------------")
	k, t = 0, 0
	T = 1

	x = np.loadtxt(Xtrain_file, delimiter=',')
	y = np.loadtxt(Ytrain_file, delimiter=',')
	# xTest = np.loadtxt(test_file, delimiter=',')

	xTest = x.copy()
	yTest = y.copy()

	# x = x[:450]
	# xTest = xTest[450:]

	# y = y[:450]
	# yTest = yTest[450:]

	print("x length: ", len(x))
	print("x instance length: ", len(x[0]))
	print("y length: ", len(y))

	# c = [0]*len(x)*T
	# w = [[0]*len(x[0])]*len(x)*T
	c = np.zeros((len(x)*T, 1))
	w = np.zeros((len(x)*T, len(x[0])))

	y2 = y.copy()
	for i in range(len(y2)):
		if y2[i] == 0:
			y2[i] = -1
		if y2[i] == 1:
			y2[i] = 1

	print(y[0], "|", y[0].dtype)

	print("--------------Entering While loop--------------")
	# k = 0
	while t <= T:
		for i in range(len(x)):
			if i > len(w)/T:
				break
			if np.sign(np.dot(w[k], x[i])) != y2[i]:
				w[k+1] = np.add(w[k], (x[i] * y2[i]))
				c[k+1] = 1
				k += 1
			else:
				c[k] += 1
		print("t:", t)
		t += 1

	print("k:", k)

	yHat = []
	count = 0
	print("--------------Testing--------------")
	for i in range(len(xTest)):
		s = 0
		for j in range(k):
			s += c[j] * np.sign(np.dot(w[j], xTest[i]))

		s = sign(s)
		if s > 0:
			yHat.append(1)
		else:
			yHat.append(0)
		count += 1

	np.savetxt(pred_file, yHat, delimiter=",", fmt='%d')

	errorCount = 0
	for i in range(len(yTest)):
		if yHat[i] != yTest[i]:
			errorCount += 1

	print("Accuracy: ", round( (len(yTest) - errorCount)/len(yTest), 2 ) * 100 )

def main():
	print("fuck your mom")
	Xtrain_file = "./ref/Xtrain.csv"
	Ytrain_file = "./ref/Ytrain.csv"
	# test_file = "./ref/Xtest.csv"
	test_file = "./ref/Xtrain.csv"
	pred_file = "./ref/prediction.csv"  

	run(Xtrain_file, Ytrain_file, test_file, pred_file)

	print("DONE")

def sign(num):
	if num > 0:
		return 1
	else:
		return -1


if __name__ == "__main__":
	main()