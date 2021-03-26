//------------------------
// IntegerQueue.c
//
// Name: Nicholas Tee
// CruzID: ntee
// CSE 15
// Novmber 30
//
// This program is the ADT for IntegerQueue
//------------------------
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <assert.h>
#include "IntegerQueue.h"

typedef struct NodeObj* Node;
typedef struct IntegerQueueObj* IntegerQueue;

typedef struct NodeObj{
    int item;
    Node next;
} NodeObj;

typedef struct IntegerQueueObj{
    Node front, rear;
    int numItems;
} IntegerQueueObj;

Node newNode(int x){
    Node N = malloc(sizeof(NodeObj));
    N -> item = x;
    N -> next = NULL;
    return N;
}

void freeNode(Node *pN){
    if(pN != NULL && *pN != NULL){
        free(*pN);
        *pN = NULL;
    }
}

void freeAllNodes(Node H){
    if(H != NULL){
        freeAllNodes(H -> next);
        freeNode(&H);
    }
}

// Resets Q to the empty state.
void dequeueAll(IntegerQueue Q){
    if(Q == NULL){
		fprintf(stderr, "IntegerQueue Error: deleteAll() called on NULL Dictionary reference\n");
		exit(EXIT_FAILURE);
	}

	freeAllNodes(Q -> front);
	Q -> front = NULL;
    Q -> front = Q -> rear = NULL;
	Q -> numItems = 0;
}

// Constructor for the IntegerQueue ADT
IntegerQueue newIntegerQueue(){
    IntegerQueue Q = malloc(sizeof(IntegerQueueObj));
    Q -> front = Q -> rear = NULL;
    Q -> numItems = 0;
    return Q;
}

// Destructor for the Queue ADT
void freeIntegerQueue(IntegerQueue* pQ){
    if(pQ != NULL && *pQ != NULL){
        dequeueAll(*pQ);
        free(*pQ);
        *pQ = NULL;
    }
}

// Returns 1 (true) if Queue Q is empty, 0 (false) otherwise.
int isEmpty(IntegerQueue Q){
    if(Q == NULL){
        fprintf(stderr, "IntegerQueue Error: isEmpty() called on NULL IntegerStack reference\n");
        exit(EXIT_FAILURE);
    }
    return (Q -> numItems == 0);
}

// Returns the number of elements in Q
int length(IntegerQueue Q){
    if(Q == NULL){
        fprintf(stderr, "IntegerQueue Error: length() called on NULL IntegerStack reference\n");
        exit(EXIT_FAILURE);
    }
    return (Q -> numItems);
}

// Inserts x at back of Q.
void enqueue(IntegerQueue Q, int x){
    Node N = newNode(x);
    if(Q -> front == NULL){
        Q -> front = Q -> rear = N;
    } else {
        Q -> rear -> next = N;
        Q -> rear = N;
    }
    Q -> numItems++;
}

// Deletes and returns the item at front of Q.
// Pre: !isEmpty()
int dequeue(IntegerQueue Q){
    int x;
    Node N;
    if(Q -> front == NULL){
        fprintf(stderr, "cannot dequeue() empty queue\n");
        exit(EXIT_FAILURE);
    }

    x = Q -> front -> item;
    N = Q -> front;
    if(Q -> front == Q -> rear){
        Q -> front = Q -> rear = NULL;
    } else {
        Q -> front = Q -> front -> next;
    }
    freeNode(&N);
    Q -> numItems--;
    return x;
}

// Returns the item at front of Q.
// Pre: !isEmpty()
int peek(IntegerQueue Q){
    return Q -> front -> item;
}

char* IntegerQueueToString(IntegerQueue Q){
     Node N;
     int first = 1;
     int length;
     char* temp = malloc((Q -> numItems * sizeof(int)));
     char* str = malloc((Q -> numItems * 2 * sizeof(int)));

     assert(str != NULL);

     N = Q -> front;

     while(N != NULL){
         length++;
         sprintf(temp, "%d", N -> item);
         if(first == 0){
             strcat(str, " ");
         }
         strcat(str, temp);
         N = N -> next;
         first = 0;
     }
     strcat(str, "\0");
     free(temp);
     return str;
}

// Returns true (1) if Q and R are matching sequences of integers, false (0)
// otherwise
int equals(IntegerQueue Q, IntegerQueue R){
    Node N = Q -> front;
    Node T = R -> front;

    while(N != NULL && T != NULL){
        if(N -> item != T -> item){
            return 0;
        }
        N = N -> next;
        T = T -> next;
    }
    if (N == NULL && T == NULL){
        return 1;
    } else return 0;
}
