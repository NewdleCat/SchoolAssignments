//--------------------
// wordtree AD
//--------------------

#ifndef WORDTREE_H
#define WORDTREE_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct NodeObj
{
    char word[100];
    int subTreeSize;
    int height;
    struct NodeObj* right;
    struct NodeObj* left;
    struct NodeObj* parent;
} NodeObj;

typedef NodeObj* Node;

typedef struct WordTreeObj
{
    Node root;
    int numItems;
} WordTreeObj;

typedef WordTreeObj* WordTree;

WordTree newWordTree();
void freeWordTree();
void makeEmpty();
Node find(Node R, char* word);
// Node insert(WordTree W, Node R, char* word);
void insert(WordTree W, Node R, char* word);
void preOrder(Node N);
int getBalance(Node N);
void BalanceTree(WordTree W, Node N);
int max(int a, int b);
void updateTree(Node N);
int getSubtreeSize(Node N);
int getHeight(Node N);
void rotateRight(WordTree W, Node N);
void rotateLeft(WordTree W, Node N);
int rangeFind(Node N, char* input1, char* input2);
int countLess(Node N, char* input);
int countLessEqual(Node N, char* input);

#endif
