//---------------------------------------------------
//      SortStrings.c
//
// Name: Nicholas Tee
// Class: CSE 15
// Date: December 3
//
// This program takes in an input file with
// a list of strings and sorts them alphabetically
//----------------------------------------------------

#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <string.h>

void printArray(FILE* out, char** A, int n){
    for(int i = 0; i < n; i++){
        fprintf(out, "%s ", A[i]);
        fprintf(out, "\n");
    }

}

void swap(char** A, int i, int j){
    char* temp;
    temp = A[i];
    A[i] = A[j];
    A[j] = temp;
}

int Partition(char** A, int p, int r){
    int i, j;
    char* x = A[r];
    i = p - 1;
    for(j = p; j < r; j++){
        if(strcmp(A[j], x) < 0){
            i++;
            swap(A, i, j);
        }
    }
    swap(A, i + 1, r);
    return (i + 1);
}

void QuickSort(char** A, int p, int r){
    int q;
    if(p < r){
        q = Partition(A, p, r);
        QuickSort(A, p, q - 1);
        QuickSort(A, q + 1, r);
    }
}

int main(int argc, char* argv[]){
    FILE *in;
    FILE *out;
    int n;
    char* temp = malloc(256);
    char** A = malloc(256);

    if(argc != 3){
        printf("Error: wrong number of program arguments\n");
        exit(EXIT_FAILURE);
    }

    in = fopen(argv[1], "r");
    if(in == NULL){
        printf("Error: Unable to read from file %s\n", argv[1]);
        exit(EXIT_FAILURE);
    }

    out = fopen(argv[2], "w");
    if(out == NULL){
        printf("Error: Unable to write to file %s\n", argv[2]);
        exit(EXIT_FAILURE);
    }

    fscanf(in, "%d", &n);
    for(int i = 0; i < n; i++){
        fscanf(in, "%s", temp);
        A[i] = malloc(sizeof(char*) * strlen(temp));
        strcpy(A[i], temp);
    }

    QuickSort(A, 0, n - 1);
    printArray(out, A, n);

    for(int i = 0; i < n; i++){
        free(A[i]);
    }

    free(temp);
    free(A);
    fclose(in);
    fclose(out);
    return EXIT_SUCCESS;
}
