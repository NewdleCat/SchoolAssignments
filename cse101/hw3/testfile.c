#include<stdio.h>
#include<stdlib.h>
#include "WordTree.h"

int main()
{
    WordTree W = newWordTree();

    insert(W, W -> root, "10"); //10
    insert(W, W -> root, "20"); //20
    insert(W, W -> root, "30"); //30
    insert(W, W -> root, "40"); //40
    insert(W, W -> root, "50"); //50
    insert(W, W -> root, "60"); //60
    insert(W, W -> root, "70"); //70
    insert(W, W -> root, "80"); //80
    insert(W, W -> root, "90"); //90
    insert(W, W -> root, "99"); //100
    insert(W, W -> root, "15"); //110
    insert(W, W -> root, "14"); //120

    // insert(W, W -> root, "60"); //10
    // insert(W, W -> root, "50"); //10
    // insert(W, W -> root, "40"); //40
    // insert(W, W -> root, "30"); //30
    // insert(W, W -> root, "20"); //20
    // insert(W, W -> root, "10"); //10


    // updateTree(W -> root);

    printf("CURRENT ROOT IS: %s\n", W -> root -> word);

    preOrder(W -> root);

    // printf("Testing Rangefind\n");
    // int range;

    // range = rangeFind(W -> root, "A", "A");
    //
    // printf("Range is: %d\n", range);


    return EXIT_SUCCESS;
}
