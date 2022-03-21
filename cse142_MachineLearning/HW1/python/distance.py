import math

def MinkowskiDistance(x, y, p):
	if len(x) != len(y):
		print("x and y vectors are not equal length")

	sum = 0
	for i in range(0, len(x)):
		sum  = sum + (abs(x[i] - y[i]) ** p)

	sum = sum ** (1/p)
	print("Distance L", p, ":", sum)

# v + a 
def add(v, a): 
	if len(v) != len(a):
		print("v and a vectors are not equal length")	

	for i in range(0, len(v)):
		v[i] = v[i] + a[i]

	print("Vector after addition:", v)
	return v

def mul(v, s):
	for i in range(0, len(v)):
		v[i] = v[i] * s

	print("Vector after multiplication: ", v)
	return v

def main():

	# x and y are the feature vectors and p is the power
	x = [33.6, 30.6, 4.8, 6.8, 1.22, 2.11, 3.0]
	y = [36.7, 27.0, 4.7, 11.3, 1.0, 1.67, 3.83]
	pList = [1, 2, 10, 100]

	# c = [5, 5, 2, 2, 0.5, 0.1, 1]
	# x = add(x, c)
	# y = add(y, c)

	# x = mul(x, 2)
	# y = mul(y, 2)

	for p in pList:
		MinkowskiDistance(x, y, p)

if __name__ == "__main__":
	main()

