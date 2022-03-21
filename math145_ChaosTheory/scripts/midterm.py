# tempList = []
# p = 17
# i = 8
# k = 1
# while True:
# 	s = f"{i}: {(i**k)%p}"
# 	print(s)

# 	if (i**k) % p == 1:
# 		tempList.append(k)
# 		break
# 	k += 1
# print(tempList)


# def f(x):
# 	return x**2 + 6

# for i in range(100):
# 	if f(i) % 7 == 0:
# 		s = f"{i} --> {i % 7}"
# 		print(s)


# for x in range(55):
# 	if (x**2) % 55 == 20:
# 		print(x, "  ", (x**2) % 55)

# import math
# def phi(x):
# 	total = 0
# 	for i in range(1, x):
# 		if math.gcd(i, x) == 1:
# 			total += 1
# 	return total

# print(phi(63))

# import math
# h = 36
# k = 21
# print(h/(math.gcd(h, k)))
# thing = []
# for a in range(-10000, 10001):
# 	for b in range(-1000, 1001):
# 		if b % 55 == (a**39) % 55:
# 			# print(a, b)
# 			thing.append((a,b))

# for d in range(31):
# 	test = True
# 	for t in thing:
# 		a = t[0]
# 		b = t[1]
# 		if a % 55 == (b**d) % 55:
# 			pass
# 		else:
# 			test = False
# 			break

# 	if test == True:
# 		print("d:", d, "PASSED")
# 	else:
# 		print("d:", d, "FAIL")

n = 2000000
primes = []

for i in range(2, n + 1):
	for j in range(2, int(i ** 0.5) + 1):
 		if i%j == 0:
 			break
	else:
		primes.append(i)

print(primes)

passed = []
for p in primes:
	if (2**p) % p == 1:
		print("p:", p, "PASS")
		passed.append(p)
	else:
		print("p:", p, "FAIL")

print("YAY: ", passed)