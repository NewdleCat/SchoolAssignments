#include<stdio.h>
#include<stdlib.h>
#include "WordTree.h"

#define MAXCHAR 100

int main(int argc, char* argv[])
{
    FILE *in, *out;

    if(argc != 3) // checking for right number of inputs
    {
        printf("Error: Wrong Number of inputs\n");
        exit(EXIT_FAILURE);
    }

    in = fopen(argv[1], "r"); // opening file for reading
    if(in == NULL)
    {
        printf("Unable to read from file %s\n", argv[1]);
        exit(EXIT_FAILURE);
    }

    out = fopen(argv[2], "w"); // opening file for writing
    if(out == NULL)
    {
        printf("Unable to write to file %s\n", argv[2]);
        exit(EXIT_FAILURE);
    }

    WordTree W = newWordTree();
    char prompt[MAXCHAR];
    char inputStr[MAXCHAR];
    char str1[MAXCHAR];
    char str2[MAXCHAR];
    while(fscanf(in, "%s", prompt) != EOF)
    {
        if(strcmp(prompt, "i") == 0)
        {
            fscanf(in, "%s\n", inputStr);
            // printf("Inserting %s\n", inputStr);
            insert(W, W -> root, inputStr);
        }
        if(strcmp(prompt, "r") == 0)
        {
            // printf("Prompt is r\n");
            fscanf(in, "%s %s\n", str1, str2);
            // printf("Finding range between %s & %s\n", str1, str2);
            fprintf(out, "%d\n", rangeFind(W -> root, str1, str2));
        }
    }

    // preOrder(W -> root);

    return EXIT_SUCCESS;
}
