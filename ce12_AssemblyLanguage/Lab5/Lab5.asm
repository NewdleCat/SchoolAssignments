#-------------------------------------------------------------------------
# Created by:  Tee, Nicholas
#              ntee
#              -- June 2019
#
# Assignment:  Lab 5: A Gambling Game
#              CMPE 012, Computer Systems and Assembly Language
#              UC Santa Cruz, Spring 2019
# 
# Description: ---
# 
# Notes:       ---
#-------------------------------------------------------------------------

jal end_game                       # this is to prevent the rest of
                                   # the code executing unexpectedly

#--------------------------------------------------------------------
# play_game
#
# This is the highest level subroutine.
#
# arguments:  $a0 - starting score
#             $a1 - address of array index 0 
#
# return:     n/a
# REGISTER USAGE:
# $t0: holds starting score
# $t1: holds adress
#--------------------------------------------------------------------

.text
play_game: nop

    add $s7 $zero $a0
    add $t4 $zero $a0
#gameStart:
    add $s7 $zero $t4
    add $a0 $zero $a1
    jal get_array_size            # to get the initial size of the arrya for the welcome message
    
    add $a0  $zero  $v0           # stores size of array into $a0 to be used by welcome subroutine
    jal   welcome
    
gameStart: 
    add $s7 $zero $t4             # stores updated score into $s7
    jal   prompt_options
       
    add $a0 $zero $s7             # adds updated score to $a0
    add $a3 $zero $v0             # adds user input into $a3
    jal   take_turn
    
    j gameStart                   # jumps to start of game 
    
    jal   end_game
    
    jr    $ra


#--------------------------------------------------------------------
# welcome (given)
#
# Prints welcome message indicating valid indices.
# Do not modify this subroutine.
#
# arguments:  $a0 - array size in words
#
# return:     n/a
#--------------------------------------------------------------------
#
# REGISTER USE
# $t0: array size
# $a0: syscalls
# $v0: syscalls
#--------------------------------------------------------------------

.data
welcome_msg: .ascii "------------------------------"
             .ascii "\nWELCOME"
             .ascii "\n------------------------------"
             .ascii "\n\nIn this game, you will guess the index of the maximum value in an array."
             .asciiz "\nValid indices for this array are 0 - "

end_of_msg:  .asciiz ".\n\n"
             
.text
welcome: nop

    add   $t0  $zero  $a0         # save address of array

    addiu $v0  $zero  4           # print welcome message
    la    $a0  welcome_msg
    syscall
    
    addiu $v0  $zero  1           # print max array index
    sub   $a0  $t0    1
    syscall

    addiu $v0  $zero  4           # print period
    la    $a0  end_of_msg
    syscall
    
    jr $ra
    
    
#--------------------------------------------------------------------
# prompt_options (given)
#
# Prints user options to screen.
# Do not modify this subroutine. No error handling is required.
# 
# return:     $v0 - user selection
#--------------------------------------------------------------------
#
# REGISTER USE
# $v0, $a0: syscalls
# $t0:      temporarily save user input
#--------------------------------------------------------------------

.data
turn_options: .ascii  "------------------------------" 
              .ascii  "\nWhat would you like to do? Select a number 1 - 3"
              .ascii  "\n"
              .ascii  "\n1 - Make a bet"
              .ascii  "\n2 - Cheat! Show me the array"
              .asciiz "\n3 - Quit before I lose everything\n\n"

.text
prompt_options: nop

    addiu $v0  $zero  4           # print prompts
    la    $a0  turn_options       
    syscall

    addiu $v0  $zero  5           # get user input
    syscall
    
    add   $t0  $zero  $v0         # temporarily saves user input to $t0
    
    addiu $v0  $zero  11
    addiu $a0  $zero  0xA         # print blank line
    syscall

    add   $v0  $zero  $t0         # return player selection
    jr    $ra


#--------------------------------------------------------------------
# take_turn	
#
# All actions taken in one turn are executed from take_turn.
#
# This subroutine calls one of following sub-routines based on the
# player's selection:
#
# 1. make_bet
# 2. print_array
# 3. end_game
#
# After the appropriate option is executed, this subroutine will also
# check for conditions that will lead to winning or losing the game
# with the nested subroutine win_or_lose.
# 
# arguments:  $a0 - current score
#             $a1 - address of array index 0 
#             $a2 - size of array (this argument is optional)
#             $a3 - user selection from prompt_options
#
# return:     $v0 - updated score
#--------------------------------------------------------------------
#
# REGISTER USE
# $s0: holds current score
#--------------------------------------------------------------------

.text
take_turn: nop

    subi   $sp   $sp  12          # push return addres to stack
    sw     $s0  8($sp)
    sw     $s1  4($sp)
    sw     $ra  ($sp)
    
    move $s0 $a0
    move $s1 $a1
    
    beq $a3 1 makeBet             # if user input is 1 then jump to makeBet
    beq $a3 2 printArray          # if user input is 2 then jump to printArray
    beq $a3 3 quitGame            # if user input is 3 then jump to quitGame

makeBet:
    jal    make_bet
    add $s0 $zero $v0             # stores updated score into $s0
    add $t6 $zero $a1             # temporarily stores adress of array into $t6
    add $a0 $zero $a1             # stores adress of array to $a0
    add $a1 $zero $v0             # stores updates score into $a1
    jal    win_or_lose
    add $a1 $zero $t6             # stores adress of arry back into $a1
    addi $t6 $zero 0              # resets $t6 register
    
    j turnEnd
printArray:
    add $a0 $zero $a1             # stores adress of array into $a0
    jal    print_array
    
    j turnEnd
quitGame:
    jal    end_game

turnEnd:
    add $s0 $zero $v0           # stores return value in $s0

    lw    $ra  ($sp)
    lw    $s1  4($sp)
    lw    $s0  8($sp)            # pop return address from stack
    addi  $sp   $sp   12
    
    
        
    jr $ra


#--------------------------------------------------------------------
# make_bet
#
# Called from take_turn.
#
# Performs the following tasks:
#
# 1. Player is prompted for their bet along with their index guess.
# 2. Max value in array and index of max value is determined.
#    (find_max subroutine is called)
# 3. Player guess is compared to correct index.
# 4. Score is modified
# 5. If player guesses correctly, max value in array is either:
#    --> no extra credit: replaced by -1
#    --> extra credit:    removed from array
#  
# arguments:  $a0 - current score of user
#             $a1 - address of first element in array
#
# return:     $v0 - updated score
#--------------------------------------------------------------------
#
# REGISTER USE
# $t6: user guess
# $t1: correct answer
# $t2: temporarily holds adress of array
# $t3: players bet
# $t4: current score
#--------------------------------------------------------------------


.data
bet_header:   .ascii  "------------------------------"
              .asciiz "\nMAKE A BET\n\n"
            
score_header: .ascii  "------------------------------"
              .asciiz "\nCURRENT SCORE\n\n"
            
# add more strings

.text
make_bet: nop       
    
    subi   $sp   $sp  4
    sw     $ra  ($sp)

    add $s2 $zero $a0              # stores currect score in $s2

    addiu  $v0  $zero  4           # print header
    la     $a0  bet_header
    syscall
    
    
    add $a0 $zero $s2
    jal prompt_bet                 # calls prompt bet subroutine
    add $s1 $zero $v1              # stores user guess in $s1
    add $s3 $zero $v0              # stores bet in $s3
    
    add $a0 $zero $a1            
    jal find_max                   # calls find_max subroutine
    add $t1 $zero $v0              # stores correct answer in $t1
    
    add $t2 $zero $a1              # stores adress of array in $t2
    add $a0 $zero $s1              # stores $s1/user guess in $a0
    add $a1 $zero $t1              # stores $t1/correctAns in $a1
    jal compare
    add $s5 $zero $v0              # stores T/F in $s5
    
    beqz $s5 dontModArray          # if answer is wrong then it skips the mod Array
    
    add $a0 $zero $t2              # stores adress back into $a2
    add $a1 $zero $t1              # stores $t1/correctAns into $a2
    jal mod_array

dontModArray:   
    add $a0 $zero $s2              # stores $t4/CurrentScore in $a0
    add $a1 $zero $s3              # stores $s3/UserBet in $a1
    add $a2 $zero $s5              # stores $s5/RightorWrong in $a2
    jal mod_score
    
    add $t4 $zero $v0              # stores updates score into $t4
    add $a1 $zero $t2              # stores adress of array back into $a1
    
    add $v0 $zero $t4              # stores updates score into $v0 as a return value
    
    lw     $ra  ($sp)
    addi   $sp   $sp  4


    jr     $ra


#--------------------------------------------------------------------
# find_max
#
# Finds max element in array, returns index of the max value.
# Called from make_bet.
# 
# arguments:  $a0 - address of first element in array
#
# returns:    $v0 - index of the maximum element in the array
#             $v1 - value of the maximum element in the array
#--------------------------------------------------------------------
#
# REGISTER USE
# $t0: Index of the array
# $t1: Current Loaded value
# $t2: Current max value
# $t3: Index of max value
#--------------------------------------------------------------------

.text
find_max: nop

subi $sp $sp 4
    sw $ra ($sp)
    
    la $t0 ($a0)                  # loads adress of array into $t0
    lw $t1 ($t0)                  # load word into $t1
    add $t2 $zero $t1             # sets first element as the current max value
    li $t3 0                      # sets $t3 to 0
    li $t4 0                      # sets $tt4 to 0
    add $v0 $zero $t3             # stores $t3 into $v0 as an initial return value
    add $v1 $zero $t2             # stores $t2 into $v1 as an initial return value
startMax:
    lw $t1 ($t0)        
    beqz $t1 endMax               # if element is zero then end loop
    bgt $t1 $t2 storeMax          # if current element is greater than current max then jump to storeMax
    addi $t0 $t0 4                # incremenet adress by 4
    addi $t3 $t3 1                # increment index by 1
    j startMax                    # jump back to start of loop

storeMax:
    add $t2 $zero $t1             # stores new max into $t2
    add $t4 $zero $t3             # stores new max index into $t3
    addi $t0 $t0 4                # increment adress by 4
    addi $t3 $t3 1                # indrement inde by 1
    j startMax                    # jump to start of the loop

endMax:
    add $v0 $zero $t4             # stores final max index into $v0 as a return value
    add $v1 $zero $t2             # stores final max vlue into $v0 as a return value

    lw $ra ($sp)
    addi $sp $sp 4

    jr     $ra


#--------------------------------------------------------------------
# win_or_lose
#
# After turn is taken, checks to see if win or lose conditions
# have been met
# 
# arguments:  $a0 - address of the first element in array
#             $a1 - updated score
#
# return:     n/a
#--------------------------------------------------------------------
#
# REGISTER USE
# 
#--------------------------------------------------------------------

.data
win_msg:  .ascii   "------------------------------"
          .asciiz  "\nYOU'VE WON! HOORAY! :D\n\n"

lose_msg: .ascii   "------------------------------"
          .asciiz  "\nYOU'VE LOST! D:\n\n"

.text
win_or_lose: nop
    add $t7 $zero 0
    add $t6 $zero 0
    
    blez $a1 loseMsg
    la $t6 ($a0)                  # load adress into $t6
msgLoopStart:
    lw $t7 ($t6)                  # load word into $t7
    beq $t7 $zero winMsg          # if all elements are -1 and the array reaches 0 then print winMsg
    bgtz $t7 msgEnd               # if all element is greater than 0 it means that there are still elements left
    addi $t6 $t6 4                # increment adress by 4
    j msgLoopStart                
winMsg:
    addiu  $v0  $zero  4
    la     $a0  win_msg           # prints wing message and end the game
    syscall
    
    add $a0 $zero $a1
    jal end_game
loseMsg:
    addiu  $v0  $zero  4          # prints lose message and end the game
    la     $a0  lose_msg
    syscall
    
    add $a0 $zero $a1
    jal end_game
msgEnd:
    jr     $ra


#--------------------------------------------------------------------
# print_array
#
# Print the array to the screen. Called from take_turn
# 
# arguments:  $a0 - address of the first element in array
#--------------------------------------------------------------------
#
# REGISTER USE
# $a0: syscalls
# $v0: syscalls
#--------------------------------------------------------------------

.data
cheat_header: .ascii  "------------------------------"
              .asciiz "\nCHEATER!\n\n"

newLine:      .asciiz "\n"
colon:        .asciiz ":"
.text
print_array: nop

    addi $t0 $zero 0
    addi $t1 $zero 0
    addi $t2 $zero 0
    addi $t3 $zero 0
    add  $t3 $zero $a0

    addiu  $v0  $zero  4           # print header
    la     $a0  cheat_header
    syscall
    
    add $a0 $zero $t3
    la $t0 ($a0)                   # loads adress into $t0
start:    
    lw $t1 ($t0)                   # loads word into $t1
    beqz $t1 end                   # if element is zero then it ends to loop
    
    li $v0 1                       # prints index of current element
    move $a0 $t2
    syscall
    
    li $v0 4                       # prints colon
    la $a0 colon
    syscall
    
    li $v0 1                      # prints value of current element
    move $a0 $t1
    syscall
    
    li $v0 4
    la $a0 newLine
    syscall
    
    addi $t0 $t0 4                # increments index of array by 4
    addi $t2 $t2 1                # increments index to be printed by 1
    j start                       # jumps back to the start of the loop
end:
    
    jr     $ra


#--------------------------------------------------------------------
# end_game (given)
#
# Exits the game. Invoked by user selection or if the player wins or
# loses.
#
# arguments:  $a0 - current score
#
# returns:    n/a
#--------------------------------------------------------------------
#
# REGISTER USE
# $a0: syscalls
# $v0: syscalls
#--------------------------------------------------------------------

.data
game_over_header: .ascii  "------------------------------"
                  .ascii  " GAME OVER"
                  .asciiz " ------------------------------"

.text
end_game: nop

    add   $s0  $zero  $a0              # save final score

    addiu $v0  $zero  4                # print game over header
    la    $a0  game_over_header
    syscall
    
    addiu $v0  $zero  11               # print new line
    addiu $a0  $zero  0xA
    syscall
    
    addiu $v0  $zero  10               # exit program cleanly
    syscall


#--------------------------------------------------------------------
# OPTIONAL SUBROUTINES
#--------------------------------------------------------------------
# You are permitted to delete these comments.

#--------------------------------------------------------------------
# get_array_size (optional)
# 
# Determines number of 1-word elements in array.
#
# argument:   $a0 - address of array index 0
#
# returns:    $v0 - number of 1-word elements in array
#--------------------------------------------------------------------
.text
get_array_size: nop
     addi $t0 $zero 0             # Resets the $t registers just in case
     addi $t1 $zero 0
     addi $t2 $zero 0
     
     la $t0 ($a0)                 # loads adress into $t0
sizeStart:
     lw $t1 ($t0)                 # loads words intro $t1
     beqz $t1 sizeEnd
     addi $t2 $t2 1               # incrementing $t2 by 1
     addi $t0 $t0 4               # increment $t0 by 4 in order to reach next word
     j sizeStart
sizeEnd:
     add $v0 $zero $t2            # moves output into $v0
     
     jr $ra
#--------------------------------------------------------------------
# prompt_bet (optional)
#
# Prompts user for bet amount and index guess. Called from make_bet.
# 
# arguments:  $a0 - current score
#             $a1 - address of array index 0
#             $a2 - array size in words
#
# returns:    $v0 - user bet
#             $v1 - user index guess
#--------------------------------------------------------------------
.data       
betPrompt:    .asciiz "You currently have "
betPoints:    .asciiz " points."
betPrompt2:   .asciiz "How many points would you like to bet? "
betPrompt3:   .asciiz "Valid indices for this array are 0 - "
betPrompt4:   .asciiz "Which index do you believe contains the maximum value? "
invalidBet:   .asciiz "Sorry, your bet exceeds your current worth."
wrongBet:     .asciiz "Your guess is incorrect! The maximum value is not in index "
youLost:      .asciiz "You lost "
newLine2:      .asciiz "\n"
period:        .asciiz "."
.text
prompt_bet: nop

     subi   $sp   $sp  8
     sw     $s1  4($sp)
     sw     $ra  ($sp)

     addi $t0 $zero 0
     add $t0 $zero $a0
     add $t7 $zero $a1
     
promptBetStart:
     li $v0 4                   # Prints prmopt text
     la $a0 betPrompt
     syscall
     
     li $v0 1                   # prints current number of points
     move $a0 $t0
     syscall
     
     li $v0 4                   # Prints prompt text
     la $a0 betPoints
     syscall
     
     li $v0 4
     la $a0 newLine2
     syscall
     
     li $v0 4                   # asks user for how many points they wish to bet
     la $a0 betPrompt2
     syscall
     
     li $v0 5                   # takes user input for bet
     syscall
     move $s5 $v0
     
     bgt $s5 $t0 exceeds        # checks if bet exceeds amount
     
     li $v0 4
     la $a0 newLine
     syscall
     
     li $v0 4                   # Prints which indices are a valid input
     la $a0 betPrompt3
     syscall
     
     move $s1 $t1
     add $a1 $zero $t7
     add $a0 $zero $a1
     jal get_array_size
     move $a2 $v0
     subi $a2 $a2 1
     move $t1 $s1
     
     li $v0 1                   # Prints max index of array
     move $a0 $a2
     syscall
     
     li $v0 4                   # prints period
     la $a0 period
     syscall
     
     li $v0 4
     la $a0 newLine
     syscall
     
     li $v0 4
     la $a0 betPrompt4
     syscall
     
     li $v0 5
     syscall

     move $v1 $v0
     move $v0 $s5
     
     lw     $ra  ($sp)
     lw     $s1  4($sp)
     addi   $sp   $sp  8
     
     jr $ra

exceeds:
     li $v0 4
     la $a0 newLine
     syscall

     li $v0 4
     la $a0 invalidBet
     syscall

     li $v0 4
     la $a0 newLine
     syscall
     syscall
j promptBetStart
#--------------------------------------------------------------------
# compare (optional)
#
# Compares user guess with index of largest element in array. Called
# from make_bet.
#
# arguments:  $a0 - player index guess
#             $a1 - index of the maximum element in the array
#
# return:     $v0 - 1 = correct guess, 0 = incorrect guess
#--------------------------------------------------------------------
.data
incorrect:   .asciiz "Your guess is incorrect! The maximum value is not in index "
correct:     .asciiz "Score! Index "
correct2:    .asciiz " has the maximum valuen the array."
.text
compare: nop
     add $t1 $zero $a0
     seq $t0 $a0 $a1
     beq $t0 1 compareCorrect     # if user input matches then print corrent message
     beqz $t0 compareIncorrect    # if user input doesn't match then print incorrect message

compareCorrect:
     li $v0 4
     la $a0 newLine
     syscall

     li $v0 4
     la $a0 correct
     syscall
     
     li $v0 1
     move $a0 $t1                 # Prints index of the largest element
     syscall
     
     li $v0 4
     la $a0 correct2
     syscall
     
     li $v0 4
     la $a0 newLine
     syscall
     
     li $v0 1                     # sets return value to 1
     
     j compareEnd
     
compareIncorrect:
     li $v0 4
     la $a0 newLine
     syscall

     li $v0 4
     la $a0 incorrect
     syscall
     
     li $v0 1
     move $a0 $t1                 # Prints the index that the user input
     syscall
     
     li $v0 4
     la $a0 period
     syscall
     
     li $v0 4
     la $a0 newLine
     syscall
     
     li $v0 0                     # sets return value to 0
     
     j compareEnd
     
compareEnd:
     jr $ra
#--------------------------------------------------------------------
# mod_score (optional)
#
# Modifies score based on outcome of comparison between user guess
# correct answer. Returns score += bet for correct guess. Returns
# score -= bet for incorrect guess. Called from make_bet.
# 
# arguments:  $a0 - current score
#             $a1 - player’s bet
#             $a2 - boolean value from comparison
#
# return:     $v0 - updated score
#--------------------------------------------------------------------
.data
modEarn:   .asciiz "You earned "
modLost:   .asciiz "You lost "
modPoints: .asciiz " points"
modPeriod: .asciiz "."
modExc:     .asciiz "!"
dashLine:  .asciiz "------------------------------\n"
currScore: .asciiz "CURRENT SCORE\n\n"
pts:       .asciiz " pts\n\n"
.text
mod_score: nop
     beq $a2 1 addScore           # if user had corrent asnwer jump to addScore
     beqz $a2 minusScore          # if user had wrong answer jump to minusScore
addScore:
     add $s4 $a0 $a1              # adds user bet to current score
     
     li $v0 4
     la $a0 newLine
     syscall
     
     li $v0 4
     la $a0 modEarn
     syscall
     
     li $v0 1
     move $a0 $a1
     syscall
     
     li $v0 4
     la $a0 modPoints
     syscall
     
     li $v0 4
     la $a0 modExc
     syscall
     
     li $v0 4
     la $a0 newLine
     syscall
     syscall
       
     li $v0 4
     la $a0 valueRemove
     syscall
     
     li $v0 4
     la $a0 newLine
     syscall
     syscall
     
     j modScoreEnd
minusScore:
     sub $s4 $a0 $a1              # subtracts user bet from current score
     
     li $v0 4
     la $a0 newLine
     syscall
     
     li $v0 4
     la $a0 modLost
     syscall
     
     li $v0 1
     move $a0 $a1
     syscall
     
     li $v0 4
     la $a0 modPoints
     syscall
     
     li $v0 4
     la $a0 modPeriod
     syscall
     
     li $v0 4
     la $a0 newLine
     syscall
     syscall
     j modScoreEnd
modScoreEnd:
     li $v0 4
     la $a0 dashLine
     syscall
     
     li $v0 4
     la $a0 currScore
     syscall
     
     li $v0 1
     move $a0 $s4                 # prints new updated score
     syscall
     
     li $v0 4
     la $a0 pts
     syscall
     
     li $v0 4
     la $a0 dashLine
     syscall

     add $v0 $zero $s4
     jr $ra
#--------------------------------------------------------------------
# mod_array (optional)
#
# Replaces largest element in array with -1 if player guessed correctly.
# Called from make_bet.
#
# If extra credit implemented, the largest element in the array is
# removed and array shrinks by 1 element. Index of largest element
# is replaced by another element in the array.
# 
# arguments:  $a0 - address of array index 0
#             $a1 - index of the maximum element in the array
# 
# return:     n/a
#--------------------------------------------------------------------
.data
valueRemove:     .asciiz "This value has been removed from the array."
.text
mod_array: nop
     add $t5 $zero $a0
     la $t6 ($a0)
     add $t7 $zero $a1
modStart:
     beqz $t7 modEnd              # increments through array to the max index
     addi $t6 $t6 4
     subi $t7 $t7 1
     j modStart
modEnd:
     li $t7 -1 
     sw $t7 ($t6)                 # changes that element into -1

     add $a0 $zero $t5            # stores adress of array back into $a0
     
     jr $ra
