from mpl_toolkits import mplot3d
import matplotlib as mpl
import numpy as np
import matplotlib.pyplot as plt
import math

theta = 0
COR = 8

class factory:
	def __init__(self):
		self.FI = 0 	# inventory
		self.FB = 0 	# backlog orders
		self.FPD1 = 0 	# factory delay
		self.FPD2 = 0 	# factory delay
		self.FPR = 0 	# production request
		self.FOS = 0 	# outgoing shipment
		self.FIO = 0 	# incoming orders
		self.FED = 0 	# expected demand
		self.FSL = 0 	# supply line
		self.FS = 0

	def update(self, ROP, Q, a, b):
		tFI = self.FI
		tFB = self.FB

		self.FI = max(0, tFI + self.FPD2 - tFB - self.FIO)
		self.FB = max(0, tFB + self.FIO - tFI - self.FPD2)
		self.FOS = min(tFI + self.FPD2, tFB + self.FIO)
		self.FED = (theta * self.FIO) + ((1 - theta) * self.FED)

		self.FIO = ROP
		self.FPD2 = self.FPD1
		self.FPD1 = self.FPR
		self.FSL = self.FPD1 + self.FPD2
		self.FPR = max(0, self.FED + (a * (Q - self.FI + self.FB - (b * self.FSL))))

		self.FS = self.FI - self.FB

		thing = vars(self)
		for i in thing:
			thing[i] = round(thing[i], 1)

	def getData():
		return this.data

class retailer:
	def __init__(self):
		self.RI = 0 	# inventory
		self.RB = 0 	# backlog orders
		self.RIS = 0 	# incoming shipments
		self.RIO = 0 	# incoming orders
		self.RED = 0 	# expected demand
		self.ROP = 0 	# orders placed
		self.RSL = 0 	# supply line
		self.RS = 0

	def update(self, tFOS, FIO, FB, FOS,Q, a, b):
		tRI = self.RI
		tRB = self.RB
		self.RI = max(0, tRI + self.RIS - tRB - COR)
		self.RB = max(0, tRB + COR - tRI - self.RIS)
		self.RIO = COR
		self.RED = (theta * COR) + ((1 - theta) * self.RED)
		self.RIS = FOS
		self.RSL = self.RIS + FIO + FB + FOS
		self.ROP = max(0, self.RED + (a * (Q - self.RI + self.RB - (b * self.RSL))))

		self.RS = self.RI - self.RB

		thing = vars(self)
		for i in thing:
			thing[i] = round(thing[i], 1)

def main():

	print("----Parameter Values----")
	a = float(input("a: "))
	b = float(input("b: "))
	Q = float(input("Q: "))

	N = 0
	choice = ""
	f = factory()
	r = retailer()
	while choice != 'e':
		printOptions(N)
		choice = input("input your choice: ")
		if choice == 'r':
			print("----Parameter Values----")
			a = float(input("a: "))
			b = float(input("b: "))
			Q = float(input("Q: "))
		if choice == '2d' or choice == '3d':
			start = int(input("starting n val: "))
			end = int(input("ending n val: "))

			while True:
				xaxis = input("X Axis: ")
				if keyCheck(xaxis):
					break

			while True:
				yaxis = input("Y Axis: ")
				if keyCheck(yaxis):
					break

			if choice == '3d':
				while True:
					zaxis = input("Z Axis:")
					if keyCheck(zaxis):
						break

			fg = factory()
			rg = retailer()
			for i in range(start): # skip first n iterations
				update(fg, rg, Q, a, b)
			x = []
			y = []
			z = []
			for i in range(end):
				update(fg, rg, Q, a, b)
				vals = {**fg.__dict__, **rg.__dict__}
				x.append(vals[xaxis])
				y.append(vals[yaxis])
				if choice == '3d':
					z.append(vals[zaxis])

			if choice == '2d':
				ax = plt.axes()
				ax.set_xlabel(xaxis)
				ax.set_ylabel(yaxis)
				plt.plot(x, y, '.',color='black')

			if choice == '3d':
				ax = plt.axes(projection = "3d")
				ax.scatter(x, y, z)
				ax.set_xlabel(xaxis)
				ax.set_ylabel(yaxis)
				ax.set_zlabel(zaxis)

			plt.show()
			plt.clf()

def keyCheck(key):
	tempf = factory()
	tempr = retailer()
	if key in tempf.__dict__.keys() or key in tempr.__dict__.keys():
		return True
	else:
		return False

def update(f, r, Q, a, b):
	tFOS = f.FOS
	f.update(r.ROP, Q, a, b)
	r.update(tFOS, f.FIO, f.FB, f.FOS, Q, a, b)

def printOptions(N):
	print("\nOptions: ")
	print("1) r - reset parameter values")
	print("2) 2d - two dimensional graph")
	print("3) 3d - three dimensional graph")
	print("4) e - exit")

if __name__ == "__main__":
	main()