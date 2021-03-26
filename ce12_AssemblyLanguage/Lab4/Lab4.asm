##########################################################################
# Created by:  Tee, Nicholas
#              ntee
#              17 May 2019
#
# Assignment:  Lab 4: Roman Numeral Conversion
#              CMPE 012, Computer Systems and Assembly Language
#              UC Santa Cruz, Spring 2019
# 
# Description: This program converts roman numerals into binary representation
# 
# Notes:       This program is intended to be run from the MARS IDE.
#
# Pseudocode:  read user input
#              print user input
#              for(int i = 0; i < array length; i++)
#                 if (letter is invalid)
#                    print error message
#                 Special case if statements checking for inputs such as IXI, IVI, LXC, etc
#                 if (letter I && next letter is not V, X or null || has appeared more than 3 times)
#                    print error message
#                 if (letter X && next letter is D or invalid letter || has appeared more than 3 times)
#                    print error message
#                 if (letter C && has appeared more than 3 times)
#                    print error message
#                 if (letter V && has appeared more than once)
#                    print error message
#                 if (letter L && has appeared more than once)
#                    print error message
#               end loop
#               for(int i = 0l i < array length; i++)
#                 if (array[i] >= array [i + 1])
#                    add value to running sum
#                 else subtract value form sum
#               end loop
#               for(int i = 0; i < array length; i++)
#                  sum / 2
#                  add remainder to array
#               end loop
#               print array backwards
# RRGISTER USAGE
# $t0: Holds adress of the word input 
# $t1: Holds adress of the character
# $t2: Holds character than is being looked at
# $t3: Holds next character
# $t4: Number of times V appears
# $t5: Number of times L appears
# $t6: Number of times I appears
# $t7: Number of times X appears
# $t8: Number of times C appears
# $t9: Numver of times D appears
# $s0: Final sum of the roman numerals
# $s1: Holds length of input
##########################################################################
.data
	array:          .space 56
	prompt:	        .asciiz "You entered the Roman numerals:" 
	newLine:        .asciiz "\n"
	errorMsg:       .asciiz "Error: Invalid program argument."
	binaryPrompt:   .asciiz "The binary representation is:"
	binary:         .asciiz "0b"
	one:            .asciiz "1"
	zero:           .asciiz "0"
.text
        la $t0 ($a1)
        lw $t1 ($t0)
lStart: 
        lb $t2 ($t1)            # calculates length of the input
        addi $s1 $s1 1
        addi $t1 $t1 1
        beq $t2 $zero lEnd      
        j lStart

lEnd:
        subi $s1 $s1 1          # subtracts 1 to account for the null terminator

        li $v0 4                # prompt is printed
        la $a0 prompt		
        syscall
	
        li $v0 4
        la $a0 newLine          # print a new line
        syscall

        la $t0 ($a1)            # loads adress of program argument into $t0
        lw $t1 ($t0)            # loads word of value at the adress stored in $t0
	
        li $v0 4                # prints input
        move $a0 $t1
        syscall
	
        li $v0 4
        la $a0 newLine          # print a new line
        syscall	

start:     
        lb $t2 ($t1)            # loads character at index $t1
        lb $t3 1($t1)
        bge $s1 3 specialOne    
        j loopStart
specialOne:                     
        beq $t2 'V' next1       # checks for special case of VIX
        j specialTwo
next1:
        beq $t3 'I' next2
        j specialTwo
next2:
        lb $t3 2($t1)
        beq $t3 'X' error

specialTwo:      
        lb $t2 ($t1)            # loads character at index $t1
        lb $t3 1($t1)           # checks for special case of IIV and IIIV                    
        beq $t2 'I' Next1
        j specialThree
Next1:
        beq $t3 'I' Next2
        j specialThree
Next2:
        lb $t3 2($t1)
        beq $t3 'V' error

specialThree:      
        lb $t2 ($t1)            # loads character at index $t1
        lb $t3 1($t1)           # checks for special case of LXC                    
        beq $t2 'L' next_1
        j specialFour
next_1:
        beq $t3 'X' next_2
        j specialFour
next_2:
        lb $t3 2($t1)
        beq $t3 'C' error

specialFour:      
        lb $t2 ($t1)            # loads character at index $t1
        lb $t3 1($t1)           # checks for special case of XXC and XXXC                    
        beq $t2 'X' Next_1
        j specialFive
Next_1:
        beq $t3 'X' Next_2
        j specialFive
Next_2:
        lb $t3 2($t1)
        beq $t3 'C' error
        
specialFive:      
        lb $t2 ($t1)            # loads character at index $t1
        lb $t3 1($t1)           # checks for special case of XXL                    
        beq $t2 'X' Next__1
        j specialSix
Next__1:
        beq $t3 'X' Next__2
        j specialSix
Next__2:
        lb $t3 2($t1)
        beq $t3 'L' error
        
specialSix:      
        lb $t2 ($t1)            # loads character at index $t1
        lb $t3 1($t1)           # checks for special case of IIX                    
        beq $t2 'I' next__1
        j specialSeven
next__1:
        beq $t3 'I' next__2
        j specialSeven
next__2:
        lb $t3 2($t1)
        beq $t3 'X' error

specialSeven:      
        lb $t2 ($t1)            # loads character at index $t1
        lb $t3 1($t1)           # checks for special case of IXI                    
        beq $t2 'I' nxt1
        j specialEight
nxt1:
        beq $t3 'X' nxt2
        j specialEight
nxt2:
        lb $t3 2($t1)
        beq $t3 'I' error
        
specialEight:      
        lb $t2 ($t1)            # loads character at index $t1
        lb $t3 1($t1)           # checks for special case of IVI                    
        beq $t2 'I' nxt_1
        j specialNine
nxt_1:
        beq $t3 'V' nxt_2
        j specialNine
nxt_2:
        lb $t3 2($t1)
        beq $t3 'I' error

specialNine:      
        lb $t2 ($t1)            # loads character at index $t1
        lb $t3 1($t1)           # checks for special case of XCX                    
        beq $t2 'X' Nxt_1
        j specialTen
Nxt_1:
        beq $t3 'C' Nxt_2
        j specialTen
Nxt_2:
        lb $t3 2($t1)
        beq $t3 'X' error

specialTen:      
        lb $t2 ($t1)            # loads character at index $t1
        lb $t3 1($t1)           # checks for special case of IXX                    
        beq $t2 'I' nxtOne
        j specialEleven
nxtOne:
        beq $t3 'X' nxtTwo
        j specialEleven
nxtTwo:
        lb $t3 2($t1)
        beq $t3 'X' error

specialEleven:      
        lb $t2 ($t1)            # loads character at index $t1
        lb $t3 1($t1)           # checks for special case of XCC                    
        beq $t2 'X' nxt_One
        j specialTwelve
nxt_One:
        beq $t3 'C' nxt_Two
        j specialTwelve
nxt_Two:
        lb $t3 2($t1)
        beq $t3 'C' error

specialTwelve:      
        lb $t2 ($t1)            # loads character at index $t1
        lb $t3 1($t1)           # checks for special case of CCD                    
        beq $t2 'C' next_One
        j specialThirteen
next_One:
        beq $t3 'C' next_Two
        j specialThirteen
next_Two:
        lb $t3 2($t1)
        beq $t3 'D' error
        
specialThirteen:      
        lb $t2 ($t1)            # loads character at index $t1
        lb $t3 1($t1)           # checks for special case of CCD                    
        beq $t2 'C' Next_One
        j loopStart
Next_One:
        beq $t3 'D' Next_Two
        j loopStart
Next_Two:
        lb $t3 2($t1)
        beq $t3 'C' error


loopStart: 
        lb $t2 ($t1)            # loads character at index $t1
        lb $t3 1($t1)           # loads next character into $t3
        
        beq $t2 'I' letterI     # if statements to check if character is a
        beq $t2 'V' letterV     # valid roman numeral character
        beq $t2 'X' letterX
        beq $t2 'L' letterL
        beq $t2 'C' letterC
        beq $t2 'D' letterD
        j error                 # jumps to error message if chacter is not a vlid character

letterI:
        addi $t6 $t6 1          # increments I occurences by one
        beq $t6 4 error         # if I appears more than 4 times error occurs
        beq $t3 'I' addI        # if next letter is I add I
        beq $t3 'V' subI        # if next letter is V subtract I
        beq $t3 'X' subI        # if next letter is X subtract I
        beq $t3 $zero addI      # if next letter is null add I
        j error

letterV:
        addi $t4 $t4 1
        beq $t4 2 error         # if V appears more than once invalid input occurs
        beq $t3 'I' addV        # only letter after V can be I if not invalid input occurs
        beq $t3 $zero addV
        j error
        
letterX:
        addi $t7 $t7 1
        beq $t7 5 error         # if X appears more than 4 times invalid input occurs
        beq $t3 'I' addX        # if next letter is I add X
        beq $t3 'X' addX        # if next letter is X add X
        beq $t3 'V' addX        # if next letter is V add X
        beq $t3 'L' subX        # if next letter is L subtract X
        beq $t3 'C' subX        # if next letter is C subtract X
        beq $t3 $zero addX      # is next letter is null add X
        j error
        
letterL:
        addi $t5 $t5 1
        beq $t5 2 error         # if L appears more than once invalid input occurs
        beq $t3 'I' addL        # add L regardless of next letter unless it is C or D
        beq $t3 'X' addL
        beq $t3 'V' addL
        beq $t3 'L' error
        beq $t3 $zero addL
        j error
        
letterC:
	addi $t8 $t8 1
	beq $t8 4 error         # if C appears more than 3 times invalid input occurs
        beq $t3 'I' addC        # if next letter is I, X, V, L, or C add C
        beq $t3 'X' addC        # if next letter is D subtract C
        beq $t3 'V' addC
        beq $t3 'L' addC
        beq $t3 'C' addC
        beq $t3 'D' subC
        beq $t3 $zero addC
        j error  

letterD:
	addi $t9 $t9 1
	beq $t9 2 error         # is D appears more than once invalid input occurs
        beq $t3 'I' addD        # add D regardless of next letter
        beq $t3 'X' addD
        beq $t3 'V' addD
        beq $t3 'L' addD
        beq $t3 'C' addD
        beq $t3 'D' addD
        beq $t3 $zero addD
        j error  
        
addI:
        addi $s0 $s0 1          # adds value of I which is 1
        j loopBack
addV:
        addi $s0 $s0 5          # adds value of V which is 5
        j loopBack
addX:
        addi $s0 $s0 10         # adds value of X which is 10
        j loopBack
addL:
        addi $s0 $s0 50         # adds value of L which is 50
        j loopBack
addC:
        addi $s0 $s0 100        # adds value of C which is 100
        j loopBack
addD:
        addi $s0 $s0 500        # adds value of D which is 500
        j loopBack
subI:
        subi $s0 $s0 1          # subtracts value of I which is 1
        j loopBack
subV:
        subi $s0 $s0 5          # subtracts value of V which is 5
        j loopBack
subX:
        subi $s0 $s0 10         # subtracts value of X which is 10
        j loopBack
subL:
        subi $s0 $s0 50         # subtract value of L which is 50
        j loopBack
subC:
        subi $s0 $s0 100        # subtracts value of C which is 100
        j loopBack
subD:
        subi $s0 $s0 500        # subtracts value of D which is 500
        j loopBack

loopBack:
        addi $t1 $t1 1
        beq $t3 $zero loopEnd
        subi $s1 $s1 1          # subtracts one for every character it goes by to calculate number of characters left int he input
        j start

loopEnd:

        addi $t0 $zero 0        # set index of $t0 to 0
arrStart:
        li $t2 2
        div $s0 $t2             # divide sum of roman numerals by 2
        mflo $s0                # store quotient back into $s0
        mfhi $t1                # store remainder into $t1
        sw $t1 array($t0)       # store value of $t1 into array at index $t0
        beq $s0 0 arrEnd        # if $s0 is 0 then end loop
        addi $t0 $t0 4          # increment index of $t0 by 4 to reach next element
        j arrStart 
arrEnd:
        li $v0 4
        la $a0 newLine          # prints new line
        syscall
        
        li $v0 4
        la $a0 binaryPrompt     # prints the binary prompt
        syscall
        
        li $v0 4
        la $a0 newLine          # print a new line
        syscall
        
        li $v0 4
        la $a0 binary           # prints the 0b before binary representaiton
        syscall
printArr:	
        lb $t1 array($t0)       # load element at $t0
        beq $t1 1 isOne
        beq $t1 0 isZero
isOne:
        li $v0 4
        la $a0 one              # if element is 1 then print 1 
        syscall
        beq $t0 0 end
        subi $t0 $t0 4          # decrement $t0 by 4 to reach previous element
        j printArr
isZero:	
        li $v0 4
        la $a0 zero             # if element is 0 then print 0
        syscall
        beq $t0 0 end 
        subi $t0 $t0 4          # decrement $0 by 4 to reach previous element
        j printArr

end:
        li $v0 4
        la $a0 newLine          # print a new line
        syscall

        li $v0 10               # end the program
        syscall 

error: 
	li $v0 4
        la $a0 newLine          # print a new line
	syscall
	
        li $v0 4                # error message if input is invalid
        la $a0 errorMsg
        syscall
        
        li $v0 4
        la $a0 newLine          # print a new line
        syscall
        
        li $v0 10               # end the program
        syscall
