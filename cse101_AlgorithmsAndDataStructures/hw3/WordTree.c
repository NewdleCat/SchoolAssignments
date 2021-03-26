#include <stdio.h>
#include <stdlib.h>
#include "WordTree.h"

char* getNode(Node N);

Node newNode(char* w)
{
    Node N = malloc(sizeof(NodeObj));
    strcpy(N -> word, w);
    N -> right = NULL;
    N -> left = NULL;
    N -> parent = NULL;
    N -> height = 1;
    N -> subTreeSize = 1;
    return N;
}

WordTree newWordTree()
{
    WordTree W = malloc(sizeof(WordTreeObj));
    W -> root = NULL;
    // W -> numItems = 0;
    return W;
}

// Takes Root as an argument
void insert(WordTree W, Node N, char* w)
{
    if(W -> root == NULL)
    {
        W -> root = newNode(w);
        printf("Root %s\n", w);
        return;
    }

    if(strcmp(w, N -> word) < 0)
    {
        // printf("left %s\n", w);
        if(N -> left == NULL)
        {
            N -> left = newNode(w);
            N -> left -> parent = N;
            updateTree(N -> left);
        }
        else
            insert(W, N -> left, w);
    }
    else if(strcmp(w, N -> word) > 0)
    {
        // printf("right %s\n", w);
        if(N -> right == NULL)
        {
            N -> right = newNode(w);
            N -> right -> parent = N;
            updateTree(N -> right);
        }
        else
            insert(W, N -> right, w);
    }

    updateTree(N);
    // N -> height = max(getHeight(N -> left), getHeight(N -> right)) + 1;
    // N -> subTreeSize= max(getHeight(N -> left), getHeight(N -> right)) + 1;
    BalanceTree(W, N);

    // printf("\n------------------------------\n");
    // preOrder(W -> root);
}

int getHeight(Node N)
{
    if(N == NULL)
        return 0;

    return N -> height;
}

void updateTree(Node N)
{
    if(N != NULL)
    {
        N -> subTreeSize = 1 + getSubtreeSize(N -> left) + getSubtreeSize(N -> right);
        N -> height = 1 + max(getHeight(N -> left), getHeight(N -> right));
    }
}

int getSubtreeSize(Node N)
{
     if(N == NULL)
     {
         return 0;
     }
     else
     {
         return N -> subTreeSize;
     }
}


int max(int a, int b)
{
    if(a < b)
        return b;
    else
        return a;
}

void BalanceTree(WordTree W, Node N)
{
    int bal = getBalance(N);
    // printf("BALANCING AT NODE: %s | Bal: %d\n", N -> word, bal);
    // if(bal > 1 && strcmp(N -> word, N -> left -> word) < 0)
    if(bal > 1)
    {
        // printf("if 1\n");
        int balTemp = getBalance(N -> left);
        if(balTemp < 0)
        {
            rotateLeft(W, N -> left);
            rotateRight(W, N);
        }
        else
        {
            rotateRight(W, N);
        }
    }
    // else if(bal > 1 && strcmp(N -> word, N -> right -> word) > 0)
    else if(bal < -1)
    {
        // printf("if 2\n");
        int balTemp = getBalance(N -> right);
        if(balTemp > 0)
        {
            rotateRight(W, N -> right);
            // preOrder(W -> root);
            rotateLeft(W, N);
        }
        else
        {
            rotateLeft(W, N);
        }
    }
    // // else if(bal > 1 && strcmp(N -> word, N -> left -> word) < 0)
    // else if(bal > 1 && N -> word < N -> left -> word)
    // {
    //     printf("if 3\n");
    //     rotateLeft(W, N -> left);
    //     rotateRight(W, N);
    // }
    // else if(bal > 1 && strcmp(N -> word, N -> right -> word) > 0)
    // else if(bal < -1 && N -> word < N -> right -> word)
    // {
    //     printf("if 4\n");
    //     rotateRight(W, N -> right);
    //     rotateLeft(W, N);
    // }
}

int getBalance(Node N)
{
    if(N == NULL)
        return 0;
    return getHeight(N -> left) - getHeight(N -> right);
}

void rotateLeft(WordTree W, Node N)
{
    // printf("ROTATE LEFT: Node -> %s | Balance Factor: %d\n", N -> word, getBalance(N)); // DELETE LATER

    int isRoot = 0;
    int isRight = 0;
    Node temp = N -> right;
    Node tempSubTree = temp -> left;

    if(N -> parent == NULL)
        isRoot = 1;

    if(isRoot == 0)
    {
        if(N -> parent -> right == N)
            isRight = 1;
    }

    temp -> parent = N -> parent;
    if(isRoot == 0)
    {
        if(isRight == 1)
            temp -> parent -> right = temp;
        else
            temp -> parent -> left = temp;
    }

    temp -> left = N;
    N -> parent = temp;
    N -> right = tempSubTree;
    if(tempSubTree != NULL)
        tempSubTree -> parent = N;

    if(isRoot == 1)
        W -> root = N -> parent;

    updateTree(N);
    updateTree(N -> left);
    updateTree(N -> right);
    updateTree(N -> parent);
    updateTree(N -> parent -> right);
    updateTree(N -> parent -> left);
}

void rotateRight(WordTree W, Node N)
{
    // printf("ROTATE RIGHT: Node -> %s | Balance Factor: %d\n", N -> word, getBalance(N)); // DELETE LATER

    int isRoot = 0;
    int isLeft = 0;
    Node temp = N -> left;
    Node tempSubTree = temp -> right;


    if(N -> parent == NULL)
        isRoot = 1;

    if(isRoot == 0)
    {
        if(N -> parent -> left == N)
            isLeft = 1;
    }


    temp -> parent = N -> parent;
    if(isRoot == 0)
    {
        if(isLeft == 1)
            temp -> parent -> left = temp;
        else
            temp -> parent -> right = temp;
    }

    temp -> right = N;
    N -> parent = temp;
    N -> left = tempSubTree;
    if(tempSubTree != NULL)
        tempSubTree -> parent = N;

    if(isRoot == 1)
        W -> root = N -> parent;

    updateTree(N);
    updateTree(N -> left);
    updateTree(N -> right);
    updateTree(N -> parent);
    updateTree(N -> parent -> right);
    updateTree(N -> parent -> left);

}

int rangeFind(Node N, char* input1, char* input2)
{
    // printf("ENTERING RANGEFIND\n");
    return countLessEqual(N, input2) - countLess(N, input1);
}

int countLess(Node N, char* input)
{
    // printf("Entering Countless\n"); // dELTE LATER
    if(N == NULL)
        return 0;

    if(strcmp(N -> word, input) < 0)
    {
        if(N -> left != NULL)
            return 1 + N -> left -> subTreeSize + countLess(N -> right, input);
        else
            return 1 + countLess(N -> right, input);
    }
    else
        return countLess(N -> left, input);
}

int countLessEqual(Node N, char* input)
{
    // printf("Entering countless equal\n");
    if(N == NULL)
        return 0;

    if(strcmp(N -> word, input) <= 0)
    {
        if(N -> left != NULL)
            return 1 + N -> left -> subTreeSize + countLessEqual(N -> right, input);
        else
            return 1 + countLessEqual(N -> right, input);
    }
    else
        return countLessEqual(N -> left, input);
}

void preOrder(Node N)
{
    // printf("test1\n");
    if(N != NULL)
    {
        // printf("test2\n");
        // printf("%s ", N -> word);
        printf("Node: %s | subtree: %d | height: %d ", N -> word, N -> subTreeSize, N -> height);
        printf("| Left : %s | Right: %s | Parent: %s\n", getNode(N -> left), getNode(N -> right), getNode(N -> parent));
        preOrder(N -> left);
        preOrder(N -> right);
    }
}

char* getNode(Node N)
{
    if(N == NULL)
        return NULL;
    else
        return N -> word;
}
