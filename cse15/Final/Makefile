#------------------------------------------------------------------------------
# Makefile for Queens.c with macros
#------------------------------------------------------------------------------

PROGRAM_NAME = ProbeSequence
EXEBIN       = $(PROGRAM_NAME)
SOURCE       = $(PROGRAM_NAME).c
OBJECT       = $(PROGRAM_NAME).o
COMPILE      = gcc -c -std=c99 -Wall
LINK         = gcc -o

$(EXEBIN) : $(OBJECT)
	$(LINK) $(EXEBIN) $(OBJECT)

$(OBJECT) : $(SOURCE)
	$(COMPILE) $(SOURCE)

clean :
	rm $(EXEBIN) $(OBJECT)

memcheck :
	valgrind --leak-check=full $(EXEBIN) -v 8
