import scipy.integrate as inte
import matplotlib.pyplot as plt
import numpy as np
import math

def model(x, t):
	# dxdt = x - x**3
	dxdt = 4*x**2 - 16
	return dxdt

xVals = np.linspace(0, 0.2, 100)
xt2 = inte.odeint(model, 0.1, xVals)

fig, ax = plt.subplots()

ax.plot(xVals , xt2)
plt.show()
