//---------------------------------------------------
// Nicholas Tee
// CSE 15
// November 14
// Dictionary.c
//
// This is the Dictionary ADT which is a linked list
// containg a key and a value
//----------------------------------------------------
#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include <string.h>
#include "Dictionary.h"

int countChars(Dictionary D);

// TypeDef for the Node Object
typedef struct NodeObj{
	char* key;
	char* value;
	struct NodeObj* next;
} NodeObj;

typedef NodeObj* Node;

typedef struct DictionaryObj{
	Node head;
	int numItems;
} DictionaryObj;

// Constructor for the Node Object
Node newNode(char* k, char* v){
	Node N = malloc(sizeof(NodeObj));
	assert(N != NULL);
	N -> key = k;
	N -> value = v;
	N -> next = NULL;
	return N;
}

// Function to free a node
void freeNode(Node* pN){
	if(pN != NULL && *pN != NULL){
		free(*pN);
		*pN = NULL;
	}
}

// Function to free all the nodes
void freeAllNodes(Node H){
   if(H != NULL){
      freeAllNodes(H->next);
      freeNode(&H);
   }
}

// Function to return a Node at a given index
Node find(Node H, int index){
   Node N = H;
   for(int i = 1; i < index; i++){
	  N = N -> next;
   }
   return N;
}

// Constructor the the Dictionary Object
Dictionary newDictionary(){
	Dictionary D = malloc(sizeof(DictionaryObj));
	D -> head = NULL;
	D -> numItems = 0;

	return D;
}

// Destructor for the Dictionary Object
void freeDictionary(Dictionary* pD){
	if (pD != NULL && *pD != NULL){
		makeEmpty(*pD);
		free(*pD);
		*pD = NULL;
	}
}

// Returns th number of items in the list
int size(Dictionary D){
	if( D == NULL ){
		fprintf(stderr, "Dictionary Error: size() called on NULL Dictionary reference\n");
		exit(EXIT_FAILURE);
	}
	return (D -> numItems);
}

// Returns the value of a given Key
char* lookup(Dictionary D, char* k){
	Node temp = D -> head;
	while(temp != NULL){
		if(strcmp(temp -> key, k) == 0){
			return temp -> value;
		}
		temp = temp -> next;
	}
	return NULL;
}

// Inserts a node
void insert(Dictionary D, char* k, char* v){
	if (lookup(D, k) != NULL){
		fprintf(stderr, "Dictionary Error: that key already exists\n");
		exit(EXIT_FAILURE);
	}

	Node N = D -> head;
	if (N == NULL){ // Checks to see if any node have been inserted
		D -> head = newNode(k, v);  // placing the new Node at the head
	} else {
		while(N -> next != NULL){
			N = N -> next;
		}
		N -> next = newNode(k, v);
	}

    (D -> numItems)++;
}

// Function to delete a node with the given Key
void delete(Dictionary D, char* k){
	Node temp, T, P;
	if (lookup(D, k) == NULL){
		fprintf(stderr, "Dictionary Error: That key does not exist\n");
		exit(EXIT_FAILURE);
	}

	int i = 1;
	// temp = find(D -> head, 1);
	temp = D -> head;
	while(strcmp(k, temp -> key) != 0){
		i++;
		temp = find(D -> head, i);
	}

	if (i == 1){ // If the node is the first node
		T = D -> head;
		D -> head = D-> head -> next;
	} else { //  If node being deleted is not the first one
		P = find(D -> head, i -1);
		T = P -> next;
		P -> next = T -> next;
	}
	T -> next = NULL;
	freeNode(&T);
	(D -> numItems)--;
}

void makeEmpty(Dictionary D){
	if(D == NULL){
		fprintf(stderr, "Dictionary Error: makeEmpty() called on NULL Dictionary reference\n");
		exit(EXIT_FAILURE);
	}

	freeAllNodes(D -> head);
	D -> head = NULL;
	D -> numItems = 0;
}

// Turns all of the nodes into one string to be returned
char* DictionaryToString(Dictionary D){
	int numChars;
	Node T;
	char* str;

    numChars = countChars(D); // Calling count chars to count number of chars

	str = (char*)malloc(sizeof(char) * numChars);
	assert(str != NULL);
	T = D -> head;
	while(T != NULL){
		// T = find(D -> head, i);
		strcat(str, T -> key);
		strcat(str, " ");
		strcat(str, T -> value);
		strcat(str, "\n");
		T = T -> next;
	}
	strcat(str, "\0");

	return str;

}

// Function used to check for number of chars in the list
int countChars(Dictionary D){
    int num = 0;
    Node T = D -> head;
    while(T != NULL){
		num += (strlen(T -> key));// length of the key
		num += (strlen(T -> value));// length of value
		num += 4;
        T = T -> next;
	}
    num++;
    return num;
}
