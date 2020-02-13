//-----------------------------------------------------------------------------
//  ProbeSequence.c
//-----------------------------------------------------------------------------
#include<stdlib.h>
#include<stdio.h>

const int tableSize = 9;

// h1()
int h1(int k){
   return k%tableSize;
}

// h2()
int h2(int k){
   return 1+k%(tableSize-1);
   //return 5;
}

// h()
static int h(int k, int i){
   return ( h1(k) +  5*i )%tableSize;
}


int main(){
   int i, j, k, n = 15;

   // int keys[] = {34, 25, 79, 56, 6};
   int keys[] = {28, 5, 15, 19, 10, 17, 33, 12, 20, 6, 9, 23, 34, 22, 21};

   for(j = 0; j < n ; j++){
      k = keys[j];
      printf("%2d: ", k);
      for(i = 0; i < tableSize; i++){
         printf("%2d  ", h(k, i));
      }
      printf("\n");
   }

   return EXIT_SUCCESS;
}
