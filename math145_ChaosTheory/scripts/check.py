# Question 1 
# import math as m
p = 19
tempList = []
for i in range(1, p):
	k = 1
	# if i == 3 or i == 5 or i == 6 or i == 9 or i == 10 or i == 12:
	# 	tempList.append(0)
	# 	continue
	while True:
		s = f"{i}: {(i**k)%p}"
		print(s)

		if (i**k) % p == 1:
			tempList.append(k)
			break
		k += 1
print(tempList)


# Question 3
# import math as m
# count = 0
# for i in range(1, 29):
# 	if 28 % i == 0:
# 		temp = 0
# 		for n in range(1, i + 1):
# 			if m.gcd(n, i) == 1:
# 				count += 1
# 				temp += 1
# 		s = f"phi({i}) = {temp}"
# 		print(s)
# print(count)

# Question 4
# import math as m
# n = 7 * 11
# phi = 0
# for i in range(1, n + 1):
# 	if m.gcd(i, n) == 1:
# 		phi += 1

# print("phi:", phi)
# print((3**(phi - 1)) % n)
# print((26 * 3) % n)

# Question 5
# import math
# letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' ']
# msg = [12, 50, 63, 41, 4, 68, 63, 31]
# msg2 = []
# print(msg)
# for i in msg:
# 	for m in range(54):				
# 		if (m**7) % 77 == i:
# 			msg2.append(m)
# print(msg2)
# msg3 = []
# msg4 = []
# for m in msg2:
# 	msg3.append(math.floor((m - 1)/2))
# 	msg4.append(math.floor(m/2))
# print("----------")
# print(msg3)
# print(msg4)
# msg5 = []
# msg6 = []
# for i in range(len(msg3)):
# 	msg5.append(letters[msg3[i]])
# 	msg6.append(letters[msg4[i]])
# print(msg5)
# print(msg6)

# def f(x):
# 	return ((x**2) + 1)


# thing = []
# for i in range(-100, 101):
# 	if f(i) % 7 == 0:
# 		thing.append(i)
# print(thing)