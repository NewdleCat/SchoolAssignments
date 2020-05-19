//-------------------------
//
// LinkedList ADT
//
//-------------------------

#ifndef WORDLIST_H
#define WORDLIST_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct NodeObj* Node;
typedef struct WordListObj* WordList;
WordList newWordList(); // constructor
void freeWordList(WordList* pW); // free the entire list
Node find(Node H, char* wrd); // returns a pointer to a node in the list
void insert(WordList W, char* w); // inserts node into the list
void delete(WordList W, char* w); // delete a node in the list
void makeEmpty(WordList W); // Reset the List
void updateNode(Node N); // Updates frequency of Node;
void printList(WordList W, FILE* out); // Prints all node in the list
char* getFreqWord(WordList W, int f);
int getNumItems(WordList W); // returns number of nodes in the list
void sortList(WordList W); // sorts the list in increasing order
void sortListA(WordList W); //  sorts the list lexiographically

#endif
