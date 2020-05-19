#------------------------------------------------------------------------------
# Makefile for Queens.c with macros
#------------------------------------------------------------------------------

PROGRAM_NAME = nqueens
EXEBIN       = $(PROGRAM_NAME)
SOURCE       = $(PROGRAM_NAME).cpp
OBJECT       = $(PROGRAM_NAME).o
COMPILE      = g++ -c -std=c++11 -Wall
LINK         = g++ -o

$(EXEBIN) : $(OBJECT)
	$(LINK) $(EXEBIN) $(OBJECT)

$(OBJECT) : $(SOURCE)
	$(COMPILE) $(SOURCE)

clean :
	rm $(EXEBIN) $(OBJECT)

memcheck :
	valgrind --leak-check=full $(EXEBIN) -v 8

check :
	ls /afs/cats.ucsc.edu/class/cse015-pt.f19/pa2/ntee

submit :
	submit cse015-pt.f19 pa2 $(SOURCE) Makefile README
