a = 0
b = 1
c = -1
d = 1

sol = []
for x in range(-20, 21):
	t = (a - x)*(d - x) - (c*b)
	if t == 0:
		sol.append(x)

print(sol)


det = (a*d)-(b*c)
tr = a + d
s = f"(det, tr) = ({det},{tr})"
print(s)
eq = tr**2 - (4*det)
if det < 0:
	print("Saddle Point")
elif eq > 0:
	print("Node")
elif eq < 0:
	print("Spiral")
else:
	print("Star or Degenerate Node")

if tr < 0:
	print("Stable")
elif tr > 0:
	print("Unstable")
else:
	print("Center")

sols = []
for x in range(-10, 11):
	for y in range(-10, 11):
		one = (4*x) + (-3*y)
		two = (8*x) + (-6*y)
		if one == 0 and two == 0:
			sols.append((x,y))
print("sols:", sols)
