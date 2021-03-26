------------------------
Lab 4: Roman Numeral Conversion
CMPE 012 Spring 2019

Tee, Nicholas
ntee
------------------------

Can you validly represent the decimal value 1098 with Roman numerals using only I, V, X, and C?
CCCCCCCCCXCVIII

What was your approach for recognizing an invalid program argument?
Each letter only had a couple of other letters than could be next to it. For instance, I could only
have X, V, I or null in front of it. If the letter was invalid then I would print the error message.
Then I had a bunch of if statements to check for unique cases that didn't work with that method such as
IVI or LXC there were about 13 special cases that I had to look for including ones that had the letter D

What did you learn in this lab?
I learnt how to properly use roman numerals and how to use arrays in MIPS. I also had a lot of practice with
creating branches and loops when programming the lab

Did you encounter any issues? Were there parts of this lab you found enjoyable?
The lab wasn't too difficult. However, it was rather difficult to picture in my head in the beginning
I think the hardest part for me was doing the binary conversion. Because the array method that I used
required to use syscall 1 in order to print it's contents I had to come up with another way to print
the integers without using the forbidden syscall.

How would you redesign this lab to make it better?
Perhaps explain a little more the way program arguments work because I had a hard time figuring out 
how to access the input. Also perhaps banning the use of syscall 1 is unnessecary because it is
just another pointless roadblock that students have to worry about

What resources did you use to complete this lab?
I googles around to find out how to access the program arguments because the document that was given
to us didn't really help much. I also googled on how to make arrays in MIPS because the textbook 
chapter was rather confusing and didn't help much

Did you work with anyone on the labs? Describe the level of collaboration.
I didn't technically work with anyone other than asking my friends if my pseudocode and diagram where
alright