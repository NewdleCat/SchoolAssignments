//-----------------------------------------------------------------------------
// Dictionary.c
//
// Name: Nicholas Tee
// Class: CSE 15
//
// the Dictionary ADT but HASHTABLES Woooaaaaaah
//-----------------------------------------------------------------------------
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include "Dictionary.h"

const int tableSize = 101;

unsigned int rotate_left(unsigned int value, int shift);
int countChars(Dictionary D);
void makeEmptyy(Dictionary D);

// unsigned int rotate_left(unisgned int value, int shift);
// unsigned int pre_hash(char* input);
// int hash(char* key);

unsigned int rotate_left(unsigned int value, int shift){
    int sizeInBits = 8 * sizeof(unsigned int);
    shift = shift & (sizeInBits - 1);
    if(shift == 0){
        return value;
    } else {
        return (value << shift) | (value >> (sizeInBits - shift));
    }
}

unsigned int pre_hash(char* input){
    unsigned int result = 0xBAE86554;
    while(*input){
        result ^= *input++;
        result = rotate_left(result, 5);
    }
    return result;
}

int hash(char* key){
    return pre_hash(key) % tableSize;
}

// TypeDef for the Node Object
typedef struct NodeObj{
	char* key;
	char* value;
	struct NodeObj* next;
} NodeObj;

typedef NodeObj* Node;

typedef struct DictionaryObj{
	Node* ht;
	int numItems;
} DictionaryObj;
// Exported type --------------------------------------------------------------

// Dictionary
typedef struct DictionaryObj* Dictionary;

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

void freeAllNodes(Node H){
   if(H != NULL){
      freeAllNodes(H->next);
      freeNode(&H);
   }
}
// Constructors-Destructors ---------------------------------------------------

// newDictionary()
// Constructor for the Dictionary ADT.
Dictionary newDictionary(){
    Dictionary D = malloc(sizeof(DictionaryObj));
	D -> ht = malloc(tableSize * sizeof(Node));
    for(int i = 0; i < tableSize; i++){
        D -> ht[i] = NULL;
    }
    D -> numItems = 0;
	return D;
}

// freeDictionary()
// Destructor for the Dictionary ADT.
void freeDictionary(Dictionary* pD){
    if (pD != NULL && *pD != NULL){
		makeEmpty(*pD);
		free(*pD);
		*pD = NULL;
	}
}

Node find(Node H, int index){
   Node N = H;
   for(int i = 1; i < index; i++){
	  N = N -> next;
   }
   return N;
}

// ADT operations -------------------------------------------------------------

// size()
// Return the number of (key, value) pairs in Dictionary D.
int size(Dictionary D){
    if( D == NULL ){
		fprintf(stderr, "Dictionary Error: size() called on NULL Dictionary reference\n");
		exit(EXIT_FAILURE);
	}
	return (D -> numItems);
}

// lookup()
// If D contains a pair whose key matches argument k, then return the
// corresponding value, otherwise return NULL.
char* lookup(Dictionary D, char* k){
    if(D -> numItems != 0){
        Node temp = D -> ht[hash(k)];
        while(temp != NULL){
            if(strcmp(temp -> key, k) == 0){
                return temp -> value;
            }
            temp = temp -> next;
        }
    }
	return NULL;
}


// insert()
// Insert the pair (k,v) into D.
// Pre: lookup(D, k)==NULL (D does not contain a pair whose first member is k.)
void insert(Dictionary D, char* k, char* v){
    if (lookup(D, k) != NULL){
		fprintf(stderr, "Dictionary Error: that key already exists\n");
		exit(EXIT_FAILURE);
	}

    // int hIndex = hash(k);
    // Node N = (D -> ht)[hIndex];
    // if(N == NULL){
    //     D -> ht[hIndex] = newNode(k, v);
    // } else {
    //     while(N -> next != NULL){
    //         N = N -> next;
    //     }
    //     N -> next = newNode(k, v);
    // }

    // SARAH VERSION
    int index = hash(k);
    Node N = newNode(k, v);
    N -> next = D -> ht[index];
    D -> ht[index] = N;

    (D -> numItems)++;
}

// delete()
// Remove pair whose first member is the argument k from D.
// Pre: lookup(D,k)!=NULL (D contains a pair whose first member is k.)
void delete(Dictionary D, char* k){
    Node temp, T, P;
    if (lookup(D, k) == NULL){
		fprintf(stderr, "Dictionary Error: That key does not exist\n");
		exit(EXIT_FAILURE);
	}

    int i = 1;
    temp = D -> ht[hash(k)];
    while(strcmp(k, temp -> key) != 0){
		i++;
		temp = find(D -> ht[hash(k)], i);
	}

    if (i == 1){ // If the node is the first node
		T = D -> ht[hash(k)];
		D -> ht[hash(k)] = D -> ht[hash(k)] -> next;
	} else { //  If node being deleted is not the first one
		P = find(D -> ht[hash(k)], i -1);
		T = P -> next;
		P -> next = T -> next;
	}
	T -> next = NULL;
	freeNode(&T);
	(D -> numItems)--;
}

// makeEmpty()
// Reset D to the empty state, the empty set of pairs.
void makeEmpty(Dictionary D){
    if(D == NULL){
		fprintf(stderr, "Dictionary Error: makeEmpty() called on NULL Dictionary reference\n");
		exit(EXIT_FAILURE);
	}
    if(D -> numItems != 0){
        for(int i = 0; i < tableSize; i++){
            freeAllNodes(D -> ht[i]);
        }
    }
    D -> numItems = 0;
    free(D -> ht);
    D -> ht = NULL;
}

void makeEmptyy(Dictionary D){
    if(D == NULL){
		fprintf(stderr, "Dictionary Error: makeEmpty() called on NULL Dictionary reference\n");
		exit(EXIT_FAILURE);
	}
	for(int i = 0; i < tableSize; i++){
        freeAllNodes(D -> ht[i]);
    }
    D -> numItems = 0;
    free(D -> ht);
    D -> ht = NULL;
}


// Other Operations -----------------------------------------------------------

// DictionaryToString()
// Determines a text representation of the current state of Dictionary D. Each
// (key, value) pair is represented as the chars in key, followed by a space,
// followed by the chars in value, followed by a newline '\n' char. The pairs
// occur in alphabetical order by key. The function returns a pointer to a char
// array, allocated from heap memory, containing the text representation
// described above, followed by a terminating null '\0' char. It is the
// responsibility of the calling function to free this memory.
char* DictionaryToString(Dictionary D){
	Node T;
	char* str = "";
    int numChars;

    numChars = countChars(D); // Calling count chars to count number of chars
    str = (char*)malloc(sizeof(char) * numChars);
    assert(str != NULL);

    if(D -> numItems != 0){
        for(int i = 0; i < tableSize; i++){
            T = D -> ht[i];
            while(T != NULL){
                // T = find(D -> head, i);
                strcat(str, T -> key);
                strcat(str, " ");
                strcat(str, T -> value);
                strcat(str, "\n");
                T = T -> next;
            }
        }
        strcat(str, "\0");
    }

	return str;
}

int countChars(Dictionary D){
    int num = 0;
    if(D -> numItems != 0){
        for(int i = 0; i < tableSize; i++){
            Node T = D -> ht[i];
            while(T != NULL){
                num += (strlen(T -> key));// length of the key
                num += (strlen(T -> value));// length of value
                num += 4;
                T = T -> next;
            }
        }
    }
    num++;
    return num;
}
