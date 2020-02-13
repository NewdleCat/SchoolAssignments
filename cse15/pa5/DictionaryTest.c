//-----------------------------------------------------------------------------
// DictionaryTsxt
// A rather weak test of the Dictionary ADT.
//-----------------------------------------------------------------------------
#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include"Dictionary.h"


int main(){
   Dictionary A;
   Dictionary B;
   char* str;
   char* k[] = {"I", "Like", "Eating", "Pizza"};

   // create a Dictionary and some pairs into it
   A = newDictionary();
   B = newDictionary();
   insert(A, "ONE","a");
   insert(A, "TWO","b");
   insert(A, "THREE","c");
   insert(A, "FOUR","d");
   insert(A, "FIVE","e");

   for(int i = 0; i < 4; i++){
       insert(B, k[i], "VALUE THING");
   }

   // print out the Dictionary
   str = DictionaryToString(A);
   printf("%s\n", str);
   free(str);

   str = DictionaryToString(B);
   printf("%s\n", str);
   free(str);


   // delete some pairs
   delete(A, "ONE");
   delete(A, "TWO");
   delete(A, "FIVE");

   delete(B, "Like");

   // print out the Dictionary
   str = DictionaryToString(A);
   printf("%s\n", str);
   free(str);

   str = DictionaryToString(B);
   printf("%s\n", str);
   free(str);

   freeDictionary(&A);
   freeDictionary(&B);

   return EXIT_SUCCESS;
}
