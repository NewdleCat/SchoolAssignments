import matplotlib.pyplot as plt
import numpy as np
import math
R = np.linspace(1.5,4,40000)

X = []
Y = []

for r in R:
	for i in range(3):
		x = np.random.random()
		print(x)
		for n in range(100):
			# x = r * math.cos(x)
			x = r * x * (1 - x)

		for n in range(100):
			x = r * x * (1 - x)

		X.append(r)
		Y.append(x)

plt.plot(X, Y, ls='', marker=',', markersize=0.15)
# plt.plot(X, Y, '.', alpha = 0.5, markersize=0.15)
plt.show()