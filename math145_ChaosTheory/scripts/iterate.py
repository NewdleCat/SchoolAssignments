import matplotlib as mpl
import numpy as np
import matplotlib.pyplot as plt
import math

plt.style.use('_mpl-gallery')

def f(x):
	y = 3 * x - x**3
	return y

# Initial Value
x_0 = 2.1
n = 2
pointSets = np.zeros((2*n + 1, 2))
print(pointSets)
pointSets[0,0] = x_0
pointSets[0,1] = 0

x = x_0

for i in range(1, n + 1):
	y = f(x)
	pointSets[2 * i - 1, 0] = x
	pointSets[2 * i - 1, 1] = y
	pointSets[2 * i, 0] = y
	pointSets[2 * i, 1] = y
	x = y

fig, ax = plt.subplots()
ax.plot(pointSets[:,0], pointSets[:,1])

# x = np.linspace(-2.1,2.1,101)
x = (np.linspace(-5,5,350))
print(x)
y1 = f(x)
y2 = x
ax.plot(x,y1)
ax.plot(x,y2)

ax.plot(x_0, 0, 'o')
ax.plot(pointSets[2*n, 0], pointSets[2*n, 1], 'o', color='black')
plt.show()