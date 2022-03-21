from mpl_toolkits import mplot3d
import matplotlib as mpl
import numpy as np
import matplotlib.pyplot as plt
import math


def euler(f, x, dt):
	return(x + dt * f(x))

def heun(f, x, dt):
    return(x + dt/2 * (f(x) + f(euler(f, x, dt))))

def midpt(f, x, dt):
    return(x + dt * f(euler(f, x, dt/2)))

def rk4(f, x, dt):
    k1 = f(x)
    k2 = f(x + dt/2 * k1)
    k3 = f(x + dt/2 * k2)
    k4 = f(x + dt * k3)
    return(x + dt/6 * (k1 + 2 * k2 + 2 * k3 + k4))

def createGraph(f, x_0, y_0, h, part = 2, intervalEnd = 1):
	def X_2(x): return ((10**(-2)) * x) # part2 x'
	def Y_2(y): return (-300 * y) # part2 y'
	xList = []
	yList = []
	x = x_0
	y = y_0
	i = 0
	if part == 2 or part == 5:
		xList.append(x)
		yList.append(y)
	else:
		xList.append(i)
		if part == 3: yList.append(C(x,y))
		if part == 4: yList.append(E(x,y))

	while i < intervalEnd:
		if part == 2:
			x = f(X_2, x, h)
			y = f(Y_2, y, h)
			xList.append(x)
			yList.append(y)
			if y > 10: break
		i = round(i + h, 5)

	return xList, yList

def part2():
	x_0 = 1
	y_0 = 0.01
	h = 0.1
	x, y = createGraph(euler, x_0, y_0, h)
	x1, y1 = createGraph(heun, x_0, y_0, h)
	x2, y2 = createGraph(midpt, x_0, y_0, h)
	x3, y3 = createGraph(rk4, x_0, y_0, h)
	ax = plt.axes()
	ax.set_xlabel("x '")
	ax.set_ylabel("y '")
	ax.set_ylim([-25, 25])
	ax.set_xlim([1, 1.002])
	# print(x)
	# print(x1)
	print("Euler: ", y)
	print("Heun:", y1)
	print("midpoint:", y2)
	print("RK4:", y3)
	# plt.yticks([1, 2, 3,4 , 5, 6])
	plt.plot(x, y, color='black', label="Euler")
	plt.plot(x1, y1, color='green', label="Heun")
	plt.plot(x2, y2, color='red', label="MidPoint")
	plt.plot(x3, y3, color='blue', label="RK4")

	def X(t): return math.exp(t/100)
	def Y(t): return math.exp(-300*t)
	
	i = 0
	xList = []
	yList = []
	while i < 1:
		x = X(i)
		y = Y(i)
		if y > 20:
			break
		xList.append(x)
		yList.append(y)
		i += h

	print("THING: ", yList)
	plt.plot(xList, yList, color='purple', label="Actual")
	plt.legend()
	plt.show()

def harmonicOscillator():
	def euler(f, x, y, dt): return(x + dt * f(y))
	def X(y): return y
	def Y(x): return -x
	def rk4(f, x, y, dt):
	    k1 = f(y)
	    k2 = f(y + dt/2 * k1)
	    k3 = f(y + dt/2 * k2)
	    k4 = f(y + dt * k3)
	    return(x + dt/6 * (k1 + 2 * k2 + 2 * k3 + k4))
	x = 1
	y = 0
	x1 = 1
	y1 = 0
	h = 0.01
	xList = []
	yList = []
	xList1 = []
	yList1 = []
	i = 0
	while True:
		xList.append(x)
		yList.append(y)
		xList1.append(x1)
		yList1.append(y1)
		if i > 10: break
		temp = x
		temp1 = x1
		x = euler(X, x, y, h)
		y = euler(Y, y, temp, h)
		x1 = rk4(X, x1, y1, h)
		y1 = rk4(Y, y1, temp1, h)
		i += h
	
	plt.plot(xList, yList, color='black', label="euler")
	plt.plot(xList1, yList1, color='green', label="rk4")

	ax = plt.gca()
	ax.set_ylim([-2, 2])
	ax.set_xlim([-2, 2])
	ax.set_aspect(1)
	plt.legend()

def doubleWell():
	def X(y): return y
	def Y(x): return x - x**3
	def euler(f, x, y, dt): return(x + dt * f(y))
	def rk4(f, x, y, dt):
		# print("test")
		k1 = f(y)
		k2 = f(y + dt/2 * k1)
		k3 = f(y + dt/2 * k2)
		k4 = f(y + dt * k3)
		return(x + dt/6 * (k1 + 2 * k2 + 2 * k3 + k4))
	x = 0.1
	y = 0.1
	x1 = 0.1
	y1 = 0.1
	h = 0.01
	xList = []
	yList = []
	xList1 = []
	yList1 = []
	i = 0
	while True:
		xList.append(x)
		yList.append(y)
		xList1.append(x1)
		yList1.append(y1)
		if i > 10: break
		temp = x
		temp1 = x1
		x = euler(X, x, y, h)
		y = euler(Y, y, temp, h)
		x1 = rk4(Y, x1, y1, h)
		y1 = rk4(Y, y1, temp1, h)
		i += h
		# print(x)
	# print(yList)
	plt.plot(xList, yList, color='black', label="euler")
	plt.plot(xList1, yList1, color='red', label="rk4")

	ax = plt.gca()
	ax.set_ylim([-5, 5])
	ax.set_xlim([-5, 5])
	ax.set_aspect(1)
	plt.legend()

def main():
	# part2()
	# harmonicOscillator()
	doubleWell()
	plt.show()
	
if __name__ == "__main__":
	main()