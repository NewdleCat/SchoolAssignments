//---------------------------
// Number 6 = Triple ADT
//---------------------------
#include <stdlib.h>
#include <stdio.h>

typedef struct TripleObj* Triple;

typedef struct TripleObj{
    int A, B, C;
} TripleObj;

Triple newTriple(int a, int b, int c){
    Triple T = malloc(sizeof(TripleObj));
    A = a;
    B = b;
    C = c;
    return T;
}

void freeTriple(Triple* pN){
    if(pN != NULL && *pN != NULL){
        free(*pN);
        *pN = NULL;
    }
}

int getFirst(Triple T){
    return T -> A;
}

int getSecond(Triple T){
    return T -> B;
}

int getThird(Triple T){
    return T -> C;
}

int sumOfSquares(Triple T){
    return (T -> A)*(T -> A) + (T -> B)*(T -> B) + (T -> C)*(T -> C);
}

void incrementFirst(Triple T){
    T -> A += 1;
}

void setThird(Triple T, int x){
    T -> C = x;
}

void rotate(Triple T){
    int a = T -> A, b = T -> B, c = T -> C;
    T -> A = b;
    T -> B = c;
    T -> C = a;
}
// MY ANSWER:
// Triple add(Triple T, Triple U){
//     Triple N = malloc(sizeof(TripleObj));
//     N -> A = (T -> A) + (U -> A);
//     N -> B = (T -> B) + (U -> B);
//     N -> C = (T -> C) + (U -> C);
//     return N;
// }

// "BETTER" ANSWER:
Triple add(Triple T, Triple U){
    int a, b, c;
    a = (T -> A) + (U -> A);
    b = (T -> B) + (U -> B);
    c = (T -> C) + (U -> C);
    return newTriple(a, b, c);
}

void printTriple(FILE* out, Triple T){
    fprintf(out, "(%d, %d, %d)\n", T -> A, T -> B, T -> C);
}

int equals(Triple T, Triple U){
    if(T -> A == U -> A && T -> B == U -> B && T -> C == U -> C){
        return 1;
    } else {
        return 0;
    }
}
