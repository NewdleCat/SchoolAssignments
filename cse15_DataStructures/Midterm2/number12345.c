//------------------
// Number 1
//------------------

#include <stdlib.h>
#include <stdio.h>
#include <assert.h>

// PART A
typedef struct NodeObj{
    int item;
    struct NodeObj* next;
} NodeObj;

// PART B
typedef NodeObj* Node;

// PART C
Node newNode(int x){
    Node N = malloc(sizeof(NodeObj));
    assert(N != NULL);
    N -> item = x;
    N -> next = NULL;
    return N;
}

// PART D
void freeNode(Node* pN){
    if(pN != NULL && *pN != NULL){
        free(*pN);
        *pN = NULL;
    }
}

//------------------
// NUmber 2
//------------------

void freeAllNodes(Node H){
    if(H != NULL){
        freeAllNodes(H -> next);
        free(&H);
    }
}

//-------------------
// Number 3
//-------------------

int product(Node H){
    if(H == NULL){
        return 1;
    } else {
        return (H -> item) * product(H -> next);
    }
}

//------------------
// Number 4
//------------------

void push(int x){
    Node N = newNode(x);
    N -> next = top;
    top = N;
}

int pop(){
    int num;
    Node N;
    if(top == NULL){
        fprintf(stderr, "top null");
        exit(EXIT_FAILURE);
    }
    N = top;
    top = top -> next;
    num = N -> item;
    freeNode(&N);
    return num;
}

//------------------
// Number 5
//------------------

void enqeue(int x){
    Node N = newNode(x);
    Node T = back;
    if(front == NULL){
        front = back = N;
    } else {
        back -> next = N;
        back = N;
    }
}

int dequeue(){
    Node N;
    int num;
    if(front == NULL){
        fprintf(stderr, "NULL error");
        exit(EXIT_FAILURE);
    }

    num = front -> item;
    N = front;
    if(front == back){
        front = back = NULL;
    } else {
        front = front -> next;
    }
    freeNode(&N);
    return num;
}
