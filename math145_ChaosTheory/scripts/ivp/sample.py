# This implementation of the Euler, Heun, midpoint, and RK4 member of the explicit Runge-Kutta methods family for autonomous differential equations on R<sup>n</sup> uses numpy and matplotlib. The states are handled as numpy arrays, which I'll refer to as vectors; orbits are lists of numpy arrays.

import numpy as np

from matplotlib import pyplot as plt 

def vec(*args) :
    return np.array(args)

# Each of the method functions takes a vector field f, which takes a vector as input and returns a vector of the same length; a state vector x; and a time increment dt.

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

# OrbitBuilder is the same discrete time orbit constructor as was used for the beer game. 

def orbitBuilder(f, x, n):
    orbit = [x]
    for i in range(n):
        x = f(x)
        orbit.append(x)
    return orbit

# UpdateOneStep takes an explicit one step method (e.g. one of the four Runge-Kutta methods defined above), an autonomous vector field f, and time step dt as input, and returns a discrete time map. 

def updateOneStep(method, f, dt):
    return lambda x : method(f, x, dt)

# PlotPlanarTrajectory is a bare bones function that creates a single discrete trajectory using an explicit one step method and plots it using the default settings. PlotTrajectory takes as input an explicit one step method, vector field f, initial state x, total time interval t, and time step dt.
# 
# The helper function numSteps determines the number of steps of length dt to take to cover the total interval t. It rounds if t/dt isn't an integer.
# 
# The helper function plotPlanarOrbit is one, probably highly unpythonic, approach to getting a 2D plot from a list of arrays with two components. You are encouraged to find your own preferred ways of plotting orbits!
# 
# The points on the discrete orbit are joined because the discrete orbit is intended to consist of points of a continuous time trajectory.

def plotPlanarOrbit(orbit):
    plt.plot(*np.transpose(np.array(orbit)))

def numSteps(t, dt):
    return (np.divide(t, dt)).astype(int)

def plotPlanarTrajectory(method, f, x, t, dt):
    plotPlanarOrbit(orbitBuilder(updateOneStep(method, f, dt), x, numSteps(t, dt)))            

# Example (harmonic oscillator)
# 
# Using matrix-vector multiplication is arguably overkill here, but I wanted to emphasize the linearity of this example.

def harmonicOscillator(x) :
    return np.matmul(np.array([[0, -1],[1, 0]]), x)


# Plt's default ranges and aspect ratios may be suboptimal for this project. For example, we know that the trajectories of the harmonic oscilator should be circles centered at the origin. 
# 
# The following function plotSetRange displays in a single image multiple planar plots, over a specified range, with a specified aspect ratio. 
# 
# Showing multiple trajectories in one plot, using color, etc, can help you to compare the performance of different methods and/or with different time steps.

def plotSetRange(plots, xRange, yRange, aspectRatio):
    axes = plt.gca()
    plt.xlim(*xRange)
    plt.ylim(*yRange)
    axes.set_aspect(aspectRatio)
    # plt.show(*plots)
    plt.show()

# Example (harmonic oscillator again)


# plotSetRange([plotPlanarTrajectory(euler, harmonicOscillator, vec(1, 0), 15, 0.01), 
#               plotPlanarTrajectory(midpt, harmonicOscillator, vec(1, 0), 15, 0.1)], [-1.1, 1.1], [-1.1, 1.1], 1)

def main():
    # plotPlanarTrajectory(midpt, harmonicOscillator, vec(1, 0), 15, 0.1)
    plotSetRange([plotPlanarTrajectory(euler, harmonicOscillator, vec(1, 0), 10, 0.1)], [-2, 2], [-2, 2], 1)
    plotSetRange([plotPlanarTrajectory(rk4, harmonicOscillator, vec(1, 0), 10, 0.1)], [-2, 2], [-2, 2], 1)

    pass

if __name__ == "__main__":
    main()