#------------------------------------------------------------------------------
# Makefile for a general C program
#------------------------------------------------------------------------------

EXEBIN   =  Search
SOURCES  =  $(EXEBIN).c
OBJECTS  =  $(EXEBIN).o
FLAGS    =  -std=c99 

all: $(EXEBIN)

$(EXEBIN) : $(OBJECTS)
	gcc -o $(EXEBIN) $(OBJECTS) -lm
	rm *.o

$(OBJECTS) : $(SOURCES)
	gcc -c $(FLAGS) $(SOURCES) 

clean :
	rm -f $(EXEBIN) $(OBJECTS)
