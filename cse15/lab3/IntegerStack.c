//--------------------------------------------
// IntegerStack.c
//
// Name: Nicholas Tee
// CruzID: ntee
// CSE 15
// November 1 2019
//
// This program is the ADT for IntegerStack
//--------------------------------------------
#include <stdlib.h>
#include <stdio.h>
#include "IntegerStack.h"

static const int iSize = 1; // Initial Size

typedef struct IntegerStackObj {
    int* item;
    int numItems;
    int pSize;
} IntegerStackObj;

void doubleArray(IntegerStack S){ // function to double size of array if needed
    int i;
    int* nArray;
    int* oArray = S -> item;
    S -> pSize *= 2;
    nArray = calloc(S -> pSize, sizeof(int));
    for( i = 0; i < (S -> numItems); i++){
      nArray[i] = oArray[i];
    }
    S -> item = nArray;
    free(oArray);
}

// Constructors & Destructor ---------------
IntegerStack newIntegerStack(){ //  in order to initialize a new IntegerStack
    IntegerStack S = malloc(sizeof(IntegerStackObj));
    S -> item = calloc(iSize, sizeof(int));
    S -> numItems = 0;
    S -> pSize = iSize;
    return S;
}

void freeIntegerStack(IntegerStack* pS){ // To delete the IntegerStack
    if (pS != NULL && *pS != NULL){
        free((*pS) -> item);
        free(*pS);
        *pS = NULL;
    }
}

// ADT Operations -----------------------------
int isEmpty(IntegerStack S){ // Functiont to check if the stack is empty
    if (S == NULL){
        fprintf(stderr, "IntegerStack Error: isEmpty() called on NULL IntegerStack reference");
        exit(EXIT_FAILURE);
    }
    return (S -> numItems == 0);
}

void push(IntegerStack S, int x){ // functiont to add new element to stack
    if (S == NULL){
        fprintf(stderr, "IntegerStack Error: push() called on NULL IntegerList reference");
        exit(EXIT_FAILURE);
    }

    if ((S -> numItems) == (S -> pSize)){ // calls doubleArray() if needed
        doubleArray(S);
    }

    // giving space for the new element
    for(int i = (S -> numItems); i >= 0; i--){ // shifting all the elements to the right
        S -> item[i + 1] = S -> item[i];
    }
    S -> item[0] = x; // store new integer at the top of the stack
    S -> numItems++; // increment numItems by 1
}

int pop(IntegerStack S){ // function to remove the elements at the top of the stack
    if (S == NULL){
        fprintf(stderr, "IntegerStack Error: pop() called on NULL IntegerStack reference");
        exit(EXIT_FAILURE);
    }

    int temp = S -> item[0]; // temporarily holds the top integer

    for(int i = 1; i < (S -> numItems); i++){ // removed the top by shifting all elements to the left
        S -> item[i - 1] = S -> item[i];
    }
    S -> numItems--; // decrements numItems by 1
    return temp; // return the deleted element
}

int peek(IntegerStack S){
    if (S == NULL){
        fprintf(stderr, "IntegerStack Error: peek() called on NULL IntegerStack reference");
        exit(EXIT_FAILURE);
    }
    return (S -> item[0]); // returns the elements at the top of the stack
}

void popAll(IntegerStack S){
    if (S == NULL){
        fprintf(stderr, "IntegerStack Error: popAll() calle don NULL IntegerStack reference");
        exit(EXIT_FAILURE);
    }
    S -> numItems = 0; // changes numItems to 0 which resets the stack
}

void printIntegerStack(FILE* out, IntegerStack S){ // function that prints the stack
    if (S == NULL ){
        fprintf(stderr, "IntegerStack Error: printIntegerStack() called on NULL IntegerList reference");
        exit(EXIT_FAILURE);
    }

    for (int i = 0; i < (S -> numItems); i++){
        fprintf(out, "%d ", S -> item[i] );
    }
    fprintf(out, "\n");
}

int equals(IntegerStack S, IntegerStack T){ // function that checks if 2 stacks are equivalent
    int eq;
    if (S == NULL || T == NULL){
        fprintf(stderr, "IntegerStack Error: equals() called on NULL IntegerList reference");
        exit(EXIT_FAILURE);
    }
    eq = ((S -> numItems) == (T -> numItems));
    for(int i = 1; eq && i <= (S -> numItems); i++){
        eq = ( (S -> item[i]) == (T -> item[i]) );
    }
    return eq;
}
