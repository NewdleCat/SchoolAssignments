//-----------------------------------------------------------------------------
// Nicholas Tee
// CSE 15
// November 17
// ArithmeticOperations.c
//
// Takes an input file and reads the opCode line, and operands to print
// the final output
//-----------------------------------------------------------------------------
#include<stdio.h>
#include<stdlib.h>



// Define fptr_t type using typedef statement
typedef int (*fptr_t)(int, int);

// Define functions
int sum(int x, int y){
    return x + y;
}

int diff(int x, int y){
    return x - y;
}

int prod(int x, int y){
    return x * y;
}

int quot(int x, int y){
    return x / y;
}

int rem(int x, int y){
    return x % y;
}

int apply( fptr_t fp, int x, int y){
    return fp(x, y);
}

int compute(fptr_t fcn[5], int* A, int* idx, int n){
    int num = A[0];
    for(int i = 0; i < n; i++){
        num = apply(fcn[idx[i]], num, A[i + 1]);
    }
     return num;

}

int main(int argc, char* argv[]){
    FILE* in;
    fptr_t op[]  = {sum, diff, prod, quot, rem};
    int n, *A, *opCode;

    if(argc != 2){
        printf("Error: Wrong number of arguments, only 1 argument needed\n");
        exit(EXIT_FAILURE);
    }

    in = fopen(argv[1], "r");
    if(in == NULL){
        printf("could not open file\n");
    }

    fscanf(in, "%d", &n);
    opCode = (int*)malloc(n * sizeof(int));
    A = (int*)malloc((n + 1) * sizeof(int));

    for(int i = 0; i < n; i++){
        fscanf(in, "%d", &opCode[i]);
    }

    for(int i = 0; i < n + 1; i++){
        fscanf(in, "%d", &A[i]);
    }

    printf("%d\n", compute(op, A, opCode, n));


    fclose(in);

    free(A);
    free(opCode);

    return EXIT_SUCCESS;
}
