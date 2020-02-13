//-----------------------------------------------------------------------------
// DictionaryTest
// A rather weak test of the Dictionary ADT.
//-----------------------------------------------------------------------------
#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include"Dictionary.h"


int main(){
   Dictionary A;
   char* str;
   char* k[] = {"I", "Like", "Making", "Pizza"};

   // create a Dictionary and some pairs into it
   A = newDictionary();
   insert(A, "ONE","a");
   insert(A, "TWO","b");
   insert(A, "THREE","c");
   insert(A, "FOUR","d");
   insert(A, "FIVE","e");

   // print out the Dictionary
   str = DictionaryToString(A);
   printf("%s\n", str);
   free(str);

   // delete some pairs
   delete(A, "ONE");
   delete(A, "TWO");
   delete(A, "FIVE");

   // print out the Dictionary
   str = DictionaryToString(A);
   printf("%s\n", str);
   free(str);

   freeDictionary(&A);
 //awdgyruehjkndcslewjfioru34tfiwejo

   return EXIT_SUCCESS;
}
