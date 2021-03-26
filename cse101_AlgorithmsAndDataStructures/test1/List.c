#include <stdio.h>
#include <stdlib.h>
#include "List.h"

typedef struct NodeObj
{
    int data;
    struct NodeObj* next;
} NodeObj;

typedef NodeObj* Node;

typedef struct ListObj{
    Node head;
    int numItems;
} ListObj;

Node newNode(int d)
{
    Node N = malloc(sizeof(NodeObj));
    N -> data = d;
    N -> next = NULL;
    return N;
}

void freeNode(Node* pN)
{
    if(pN != NULL && *pN != NULL)
    {
        free(*pN);
        *pN = NULL;
    }
}

void freeAllNodes(Node H)
{
    if(H != NULL)
    {
        freeAllNodes(H -> next);
        freeNode(&H);
    }
}

List newList()
{
    List L = malloc(sizeof(ListObj));
    L -> head = NULL;
    L -> numItems = 0;
    return L;
}

void freeList(List* pL)
{
    if(pL != NULL && *pL != NULL)
    {
        // makeEmpty(*pL);
        free(*pL);
        *pL = NULL;
    }
}

// void makeEmpty(List L)
// {
//     if(L == NULL)
//     {
//         fprtinf(stderr, "List Error: makeEmpty() called on NULL List reference\n");
//         exit(EXIT_FAILURE);
//     }
// }

void insert(List L, int d)
{
    Node N = newNode(d);
    N -> next = L -> head;
    L -> head = N;
    (L -> numItems)++;
}

int lenght(List L)
{
    return L -> numItems;
}

void printList(List L)
{
    Node T = L -> head;
    printf("List Contains: ");
    while(T != NULL)
    {
        printf("%d ", T -> data);
        T = T -> next;
    }
    printf("\n");
}

void dedup(List L)
{
    Node search = L -> head;
    Node prev = NULL;
    Node curr = NULL;
    int d;

    while(search -> next != NULL)
    {
        d = search -> data;
        prev = search -> next;
        curr = prev -> next;
        while(curr != NULL)
        {
            if(curr -> data == d)
            {
                prev -> next = curr -> next;
                curr = curr -> next;
                (L -> numItems)--;
            }
            curr = curr -> next;
        }
        search = search -> next;
    }
}

int palindrome(List L)
{
    int len = (L -> numItems)/2;
    for(int i = 0; i < len - 1; i++)
    {
        Node front = L -> head;
        Node back = L -> head;
        for(int j = 0; j < i; j++)
            front = front -> next;
        for(int n = 0; n < (L -> numItems) - i - 1; n++)
            back = back -> next;
        if(front -> data != back -> data)
        {
            return 0;
        }
    }

    return 1;
}

void deleteLast(List L, int d)
{
    Node del = L -> head;
    Node search = L -> head;
    Node temp = L -> head;
    int i = 0;
    int index = 0;
    while(search != NULL)
    {
        if(search -> data == d)
        {
            index = i;
        }
        i++;
        search = search -> next;
    }
    for(int j = 0; j < index - 1; j++)
    {
        temp = temp -> next;
    }
    for(int n = 0; n < index; n++)
    {
        del = del -> next;
    }
    temp -> next = del -> next;
    del = del -> next;
}

void rotate(List L, int r)
{
    int temp;
    for(int i = 0; i < r; i++)
    {
        Node N  = L -> head;
        for(int n = 0; n < (L -> numItems) - 2; n++)
        {
            N = N -> next;
        }
        temp = N -> next -> data;
        N -> next = N -> next -> next;
        (L -> numItems)--;
        insert(L, temp);
    }
}

void reverse(List L, int r)
{
    for(int j = 0; j < r; j++)
    {
        Node S = L -> head;
        for(int i = 0; i < r - j; i++)
        {
            S = S -> next;
        }
        Node N = newNode(L -> head -> data);
        N -> next = S -> next;
        S -> next = N;
        L -> head = L -> head -> next;
    }
}

// void reverse(List L, int r)
// {
//     int swap = 0;
//     Node compare1 = L -> head;
//     Node compare2 = L -> head;
//     int count = 1;
//     int i = 1, j = 0;
//
//     if(r > 5)
//     {
//         r = 5;
//     }
//
//     while(compare2 -> next != NULL && j < r)
//     {
//         compare2 = compare2 -> next;
//         count++;
//         j++;
//     }
//     count--;
//     while(compare1 != NULL && i <= r/2)
//     {
//         swap = compare1 -> data;
//         compare1 -> data = compare2 -> data;
//         compare2 -> data = swap;
//         compare1 = compare1 -> next;
//         compare2 = L -> head;
//         j = 1;
//         while(j < count)
//         {
//             compare2 = compare2 -> next;
//             j++;
//         }
//         i++;
//     }
// }
