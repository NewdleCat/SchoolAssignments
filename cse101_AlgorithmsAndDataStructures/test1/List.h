//-----------------------------
//          List ADT
//-----------------------------

#ifndef LIST_H
#define LIST_H

#include <stdio.h>
#include <stdlib.h>

typedef struct NodeObj* Node;
typedef struct ListObj* List;
List newList();
void freeList(List* pL);
void insert(List L, int d);
// void delete();
void length(List L);
void printList(List L);
void dedup(List L);
int palindrome(List L);
void deleteLast(List L, int d);
void rotate(List L, int r);
void reverse(List L, int r);

#endif
