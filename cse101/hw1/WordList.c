#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "WordList.h"

typedef struct NodeObj{ // struct for the NodeObj
	char word[50];
    int freq;
	struct NodeObj* next;
} NodeObj;

typedef NodeObj* Node;

typedef struct WordListObj{ // Struct for the WordListObj
    Node head;
    int numItems;
} WordListObj;

// Constructor for the Node Object
Node newNode(char* w)
{
	Node N = malloc(sizeof(NodeObj));
	strcpy(N -> word, w);
    N -> freq = 1;
	N -> next = NULL;
	return N;
}

// Function to free a node
void freeNode(Node* pN)
{
	if(pN != NULL && *pN != NULL)
    {
		free(*pN);
		*pN = NULL;
	}
}

// Function to free all the nodes
void freeAllNodes(Node H)
{
   if(H != NULL)
   {
      freeAllNodes(H->next);
      freeNode(&H);
   }
}


WordList newWordList() // constructor
{
    WordList W = malloc(sizeof(WordListObj));
    W -> head = NULL;
    W -> numItems = 0;
    return W;
}

void freeWordList(WordList* pW) // free the entire list
{
    if (pW != NULL && *pW != NULL)
    {
		makeEmpty(*pW);
		free(*pW);
		*pW = NULL;
	}
}

void makeEmpty(WordList W){ // empties the list
	if(W == NULL){
		fprintf(stderr, "WordList Error: makeEmpty() called on NULL WordList reference\n");
		exit(EXIT_FAILURE);
	}

	freeAllNodes(W -> head);
	W -> head = NULL;
	W -> numItems = 0;
}

void insert(WordList W, char* w) // inserts node into the list
{
	// printf("Inserting Word: %s\n", w); // DELETE LATER
	Node T = W -> head;
	if(find(T, w) == NULL)
	{
		Node N = newNode(w); // Inserts new Node at the head
		N -> next = W -> head;
		W -> head = N;
		(W -> numItems)++;
	}
	else
	{
		Node T = find(W -> head, w); // if node already exists update
		updateNode(T);
	}
}

void updateNode(Node N) // Updates frequency of Node
{
	N -> freq += 1;
}

Node find(Node H, char* wrd) // returns a pointer to a node in the list
{
	Node temp = H;
	if (temp == NULL)
	{
		return NULL;
	}
	if(strcmp(temp -> word, wrd) == 0)
	{
		return temp;
	}
	return find(temp -> next, wrd);

}

void delete(WordList W, char* w) // delete a node in the list
{
    Node temp, T, P;
    if(find(W -> head, w) == NULL)
    {
        fprintf(stderr, "WordList Error: That word does not exist\n");
    }

    int i = 0;
    temp = W -> head;
    while(strcmp(temp -> word, w) != 0)
    {
        i++;
        temp = temp -> next;
    }

    if(i == 1) // if node is the first node
    {
        T = W -> head;
        W -> head = W -> head -> next;
    }
    else // if node being deleted is not the first one
    {
        P = W -> head;
        for(int j = 0; j < i - 1; j++)
		{
            P = P -> next;
        }
        T = P -> next;
        P -> next = T -> next;
    }
    T -> next = NULL;
    freeNode(&T);
    (W -> numItems)--;
}

void sortList(WordList W) // Insertion sort by frequency
{
	char tempChar1[50];
	char tempChar2 [50];
	int tempFreq1 = 0;
	int tempFreq2 = 0;
	Node H = W -> head;
	if(H == NULL || H -> next == NULL)
	{

	}
	else
	{
		Node t1 = H -> next;
		while(t1 != NULL)
		{
			tempFreq1 = t1 -> freq;
			strcpy(tempChar1, t1 -> word);
			int found = 0;
			Node t2 = H;
			while(t2 != t1)
			{
				if(t2 -> freq < t1 -> freq && found == 0) // Checks if t1 is greater than t2
				{
					tempFreq1 = t2 -> freq;               // is so give t2 t2's value
					strcpy(tempChar1, t2 -> word);
					t2 -> freq = t1-> freq;
					strcpy(t2 -> word, t1 -> word);
					found = 1;
					t2 = t2 -> next;
				}
				else
				{
					if(found == 1)                        // shift all Nodes the right by 1
					{									  // Until t2 reacher t1
						tempFreq2 = tempFreq1;
						strcpy(tempChar2, tempChar1);
						tempFreq1 = t2 -> freq;
						strcpy(tempChar1, t2 -> word);
						t2 -> freq = tempFreq2;
						strcpy(t2 -> word, tempChar2);
					}
					t2 = t2 -> next;
				}

			}
			t2 -> freq = tempFreq1;                        // give t1 t2's initial value
			strcpy(t2 -> word, tempChar1);
			t1 = t1 -> next;
		}
	}
}

void sortListA(WordList W) // Exactly the same as sortList, except
{						   // it sorts lexiographically
	char tempChar1[50];
	char tempChar2 [50];
	int tempFreq1 = 0;
	int tempFreq2 = 0;
	Node H = W -> head;
	if(H == NULL || H -> next == NULL)
	{

	}
	else
	{
		Node t1 = H -> next;
		while(t1 != NULL)
		{
			tempFreq1 = t1 -> freq;
			strcpy(tempChar1, t1 -> word);
			int found = 0;
			Node t2 = H;
			while(t2 != t1)
			{
				if(t2 -> freq == t1 -> freq && found == 0 && strcmp(t2 -> word, t1 -> word) > 0)
				{
					tempFreq1 = t2 -> freq;
					strcpy(tempChar1, t2 -> word);
					t2 -> freq = t1-> freq;
					strcpy(t2 -> word, t1 -> word);
					found = 1;
					t2 = t2 -> next;
				}
				else
				{
					if(found == 1)
					{
						tempFreq2 = tempFreq1;
						strcpy(tempChar2, tempChar1);
						tempFreq1 = t2 -> freq;
						strcpy(tempChar1, t2 -> word);
						t2 -> freq = tempFreq2;
						strcpy(t2 -> word, tempChar2);
					}
					t2 = t2 -> next;
				}

			}
			t2 -> freq = tempFreq1;
			strcpy(t2 -> word, tempChar1);
			t1 = t1 -> next;
		}
	}

}



char* getFreqWord(WordList W, int f) // Returns word of frequncy rank f
{
	if(f < W -> numItems)
	{
		Node temp = W -> head;
		for(int i = 0; i < f; i++)
		{
			temp = temp -> next;
		}

		if(temp -> word == NULL)
		{
			return "-";
		}

		return temp -> word;
	}
	return "-";
}

void printList(WordList W, FILE* out) // Prints list into output file
{									  // mainly used for testing
    Node T = W -> head;
	while(T != NULL)
	{
		fprintf(out, "Word: %s  ", T -> word);
		fprintf(out, "Frequency: %d\n", T -> freq);
		T = T -> next;
	}
}

int getNumItems(WordList W) // REturns the number of Nodes in the list
{
	return W -> numItems;
}
