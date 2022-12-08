string = "({{;},5}) = {;,{{;}},{5},{{;},5}}"

s = ""
for c in string:
	if c == '{' or c == '}':
		s = s + '\\'
	if c == ';':
		s = s + "\\emptyset"
		continue
	s = s + c

print(s)


