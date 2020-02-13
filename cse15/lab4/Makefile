#------------------------------------------------------------------------------
# Makefile for any C program
#------------------------------------------------------------------------------

PROGRAM_NAME = ArithmeticOperations
FLAGS        = -std=c99 -Wall
SOURCE       = $(PROGRAM_NAME).c
OBJECT       = $(PROGRAM_NAME).o
EXEBIN       = $(PROGRAM_NAME)

$(EXEBIN) : $(OBJECT)
	gcc -o $(EXEBIN) $(OBJECT)

$(OBJECT) : $(SOURCE)
	gcc -c $(FLAGS) $(SOURCE)

clean :
	rm $(EXEBIN) $(OBJECT)

memcheck : $(EXEBIN)
	valgrind --leak-check=full $(EXEBIN) in1

submit :
	submit  cse015-pt.f19 lab4 ArithmeticOperations.c Makefile README

check :
	ls  /afs/cats.ucsc.edu/class/cse015-pt.f19/lab4/ntee
