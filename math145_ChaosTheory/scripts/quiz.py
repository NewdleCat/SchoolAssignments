# 1
# for x in range(0, 71):
# 	# if (x * 77) % 123 == 21:
# 	if (x**2) % 71 == 54:
# 		print(x)

# 5
# S = []
# for k in range(0, 526):
# 	if (k*76) % 1051 > 525:
# 		S.append(k)

# print(S)
# print("Lenght:", len(S))

# 8
print((3**1951) % 12)

# def countPrimes(n):
#       count = 0
#       primes = [False for i in range(n+1)]
#       for i in range(2,n):
#          if primes[i] == False:
#             count+=1
#             j = 2
#             while j*i<n:
#                primes[j*i] = True
#                j+=1
#       return count

# print(countPrimes(96) - countPrimes(85))


# n = 37 * 83
# for x in range(n+1):
# 	if x**2 % n == 0:
# 		print(x)