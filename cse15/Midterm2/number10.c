#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include <math.h>

void printArray(int* A, int n){
    for(int i = 0; i < n; i++){
        printf("%d ", A[i]);
    }
    printf("\n");
}

void BubbleSort(int* A, int n){
    for(int j = n - 1; j > 0; j--){
        for(int i = 1; i <= j; i++){
            if(A[i] < A[i -1]){
                int temp = A[i];
                A[i] = A[i - 1];
                A[i -1] = temp;
                printArray(A, n);
            }
        }
    }
}

void invBubbleSort(int* A, int n){
    printf("invBubble\n");
    for(int j = n - 1; j > 0; j--){
        for(int i = 1; i < j; i++){
            if(A[i] < A[i + 1]){
                int temp = A[i];
                A[i] = A[i + 1];
                A[i + 1] = temp;
                printArray(A, n);
            }
        }
    }
}

void SelectionSort(int* A, int n){
    for(int j = n -1; j > 0; j--){
        int max = 0;
        for(int i = 0; i <= j; i++){
            if(A[i] > A[max]){
                max = i;
            }
        }
        int temp = A[j];
        A[j] = A[max];
        A[max] = temp;
        printArray(A, n);
    }
}

void invSelectionSort(int* A, int n){
    printf("invSlectioNSort\n");
    for(int j = n - 1; j > 0; j--){
        int max = 0;
        for(int i = 0; i <= j; i++){
            if(A[i] < A[max]){
                max = i;
            }
        }
        int temp = A[j];
        A[j] = A[max];
        A[max] = temp;
        printArray(A, n);
    }
}

void InsertionSort(int* A, int n){
    for(int j = 1; j < n; j++){
        int temp = A[j];
        int i = j - 1;
        while(i >= 0 && temp < A[i]){
            A[i + 1] = A[i];
            i--;
        }
        A[i+1] = temp;
        printArray(A, n);
    }
}

void invInsertionSort(int* A, int n){
    printf("invInsert");
    for(int j = 1; j < n; j++){
        int temp = A[j];
        int i = j - 1;
        while(i >= 0 && temp > A[i]){
            A[i + 1] = A[i];
            i--;
        }
        A[i+1] = temp;
        printArray(A, n);
    }
}

void QuickSort(int* A, int p, int r){
   int q;
   if( p<r ){
      q = Partition(A, p, r);
      QuickSort(A, p, q-1);
      QuickSort(A, q+1, r);
   }
}

int Partition(int* A, int p, int r){
   int i, j, x;
   x = A[r];
   i = p-1;
   for(j=p; j<r; j++){
      if( A[j]<=x ){
         i++;
         swap(A, i, j);
      }
   }
   swap(A, i+1, r);
   return(i+1);
}

int main(){
    int A[] = {9,5,3,6,7,4,8,1,2};
    int n = 9;
    printArray(A, n);
    //invBubbleSort(A, n);
    //SelectionSort(A, n);
    invInsertionSort(A, n);
    return(EXIT_SUCCESS);
}
