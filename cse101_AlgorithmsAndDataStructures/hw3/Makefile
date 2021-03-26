#------------------------------------------------------------------------------
# Makefile for any client of any ADT in C
#------------------------------------------------------------------------------

CLIENT         = wordrange
ADT            = WordTree
SOURCE         = $(CLIENT).c
OBJECT         = $(CLIENT).o
ADT_SOURCE     = $(ADT).c
ADT_OBJECT     = $(ADT).o
ADT_HEADER     = $(ADT).h
COMPILE        = gcc -c -std=c99 -Wall
LINK           = gcc -o
REMOVE         = rm -f
MEMCHECK       = valgrind --leak-check=full

$(CLIENT) : $(OBJECT) $(ADT_OBJECT)
	$(LINK) $(CLIENT) $(OBJECT) $(ADT_OBJECT)

$(OBJECT) : $(SOURCE) $(ADT_HEADER)
	$(COMPILE) $(SOURCE)

$(ADT_OBJECT) : $(ADT_SOURCE) $(ADT_HEADER)
	$(COMPILE) $(ADT_SOURCE)

clean :
	$(REMOVE) $(CLIENT) $(OBJECT) $(ADT_OBJECT)

memcheck : $(CLIENT)
	$(MEMCHECK) $(CLIENT)

submit :
	submit cse015-pt.f19 pa3 README Dictionary.h Dictionary.c DictionaryTest.c Makefile

check :
	ls /afs/cats.ucsc.edu/class/cse015-pt.f19/pa3/ntee
