//-----------------------------------------------------------------------------
// IntegerQueueClient.c
// Test client for the IntegerQueue ADT
//-----------------------------------------------------------------------------
#include<stdio.h>
#include<stdlib.h>
#include"IntegerQueue.h"

int main(){

   int i, j;
   char* strA;
   char* strB;

   IntegerQueue A = newIntegerQueue();
   IntegerQueue B = newIntegerQueue();

   printf("%s\n", isEmpty(A)?"true":"false");
   printf("%s\n", isEmpty(B)?"true":"false");

   enqueue(A, 4);
   enqueue(A, 3);
   enqueue(A, 2);
   enqueue(A, 8);
   enqueue(A, 10);

   printf("%s\n", isEmpty(A)?"true":"false");

   strA = IntegerQueueToString(A);
   printf("%s\n", strA);
   free(strA);

   printf("%d\n", peek(A));
   dequeue(A);
   dequeue(A);
   dequeue(A);
   printf("%d\n", peek(A));

   strA = IntegerQueueToString(A);
   printf("%s\n", strA);
   free(strA);

   enqueue(B, 15);
   enqueue(B, 9);
   enqueue(B, 2);
   enqueue(B, 12);
   enqueue(B, 13);

   strA = IntegerQueueToString(A);
   printf("%s\n", strA);
   free(strA);

   strB = IntegerQueueToString(B);
   printf("%s\n", strB);
   free(strB);

   freeIntegerQueue(&A);
   freeIntegerQueue(&B);

   return EXIT_SUCCESS;
}
