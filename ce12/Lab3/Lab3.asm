##########################################################################
# Created by:  Tee, Nicholas
#              ntee
#              8 May 2019
#
# Assignment:  Lab 3: MIPS!
#              CMPE 012, Computer Systems and Assembly Language
#              UC Santa Cruz, Spring 2019
# 
# Description: This program prints the factorial of a given number
# 
# Notes:       num = user_input
#	       result = num
#              if num < 0 or num > 10
#		  ask for user input again
#              for (i = num - 1; i > 0; i--)
#		  result = result * i
# 	       print result		
##########################################################################
.data
        prompt:         .asciiz "Enter an integer between 0 and 10: "
        invalid:        .asciiz "\nInvalid entry!"
        newLine:        .asciiz "\n"
        newLine2:       .asciiz "\n\n" 
.text
retry:
        li          $v0 4                #initial prompt to ask for integer
	la          $a0 prompt
        syscall		
	
        li          $v0 5                #sets the inputted integer to $s0
        syscall
        move        $s0 $v0
	
        beq         $s0 1 isZeroOrOne    # jumps to the isOne label is inputted integer is 1
        beqz        $s0 isZeroOrOne	 # jumps to the isZero label if the inputted integer is 0
	
        slt         $t0 $s0 $zero        # $t0 is set to 1 if input is less than 0
        sgt         $t1 $s0 10           # $t1 is set to 1 if input is greater than 10
        or          $s1 $t1 $t0          # $s1 is set to 1 if both conditions are met

        bne         $s1 1 valid	         # if requirements are met then it jups to the valib label
				         # if requirements are not met then it wll continue 							
        li          $v0, 4               # prints the invalid statement if the number is out of the range
        la          $a0, invalid		
        syscall
	
        li          $v0 4                # prints a new line to space the invalid statement and prompt
        la          $a0 newLine2
        syscall
	
        j retry	                         # loops back to the begining if the number is not in range
valid: 	
        add         $t0 $t0 $s0
        add         $s2 $s2 $s0
loop:                                    # the loopback if $t0 is still not 1
        sub         $t0 $t0 1            # subtracts $t0 by 1 every loop
        mult        $s2 $t0              # multiplies the currect product with $t0
        mflo        $s2	                 # stores product in $s2
	
        bne         $t0 1 loop	         # will loop back if $t0 is not 1

printAns:
	
        li          $v0 4                # prints new line for spacing
        la          $a0 newLine
        syscall
	
        li          $v0, 1               # prints initial inputted integer
        move        $a0, $s0
        syscall
	
        li          $v0 11               # Prints exclamation mark
        la          $a0 0x21
        syscall
	
        li          $v0 11               # prints space
        la          $a0 0x20
        syscall
	
        li          $v0 11               # prints equals sign
        la          $a0 0x3D
        syscall
	
        li          $v0 11               # prints another space
        la          $a0 0x20
        syscall	
	
        li          $v0, 1               # prints the final product
        move        $a0, $s2
        syscall
	
        li          $v0 4                # prints new line for spacing
        la          $a0 newLine
        syscall
	
        li          $v0, 10
        syscall

isZeroOrOne:
        add         $s2, $s2, 1	          # if input is 0 or 1 then it sets the output $s2 to 0
        j           printAns              # and jumps to where the program prints the output

