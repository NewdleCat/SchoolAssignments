#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "WordList.h"

#define MAXCHAR 50

int main(int argc, char* argv[])
{
    FILE *in, *out, *sp;

// 'accurs'd
    //---------------Opening Files---------------------------
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

    sp = fopen("shakespeare-cleaned5.txt", "r");
    // sp = fopen("testWords", "r");
    if(sp == NULL)
    {
        printf("Unable to read text file\n");
        exit(EXIT_FAILURE);
    }
    printf("File Opened\n"); // DELETE LATER

//---------------Storing words form text---------------------------
    WordList wordListArr[40];
    for(int i = 0; i < 40; i++)
    {
        wordListArr[i] = newWordList();
    }

    char newWord[MAXCHAR];
    int sLen = 0;
    while(fscanf(sp, "%s\n", newWord) != EOF)
    {
        sLen = strlen(newWord); // getting string length to use as index
        insert(wordListArr[sLen], newWord); // inserting word at list in array
        sLen = 0;
    }


//------------------Sorting Lists---------------------------------

    for(int i = 1; i < 40; i++) // iterates through all the lists
    {
        sortList(wordListArr[i]);
        sortListA(wordListArr[i]);
    }

//----------------------------------------------------------------
//---------------READING INPUTS------------------------------------
    int wLen;
    int wFreq;
    int count = 1;
    while(fscanf(in, "%d %d\n", &wLen, &wFreq) != EOF) // Reading inputs
    {
        fprintf(out, "%s\n", getFreqWord(wordListArr[wLen], wFreq)); // prnts out output
        count++;                                                     // accordingly to the input
    }

//-----------------------------------------------------------------

    for(int i = 1; i < 40; i++) // frees all created lists 
    {
        makeEmpty(wordListArr[i]);
        freeWordList(&wordListArr[i]);
    }

    fclose(in);
    fclose(out);
    fclose(sp);

    printf("ALL DONE!\n");

    return EXIT_SUCCESS;
}
