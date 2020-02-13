//-----------------------------------------------------------------------------
// DictionaryClient2.c
// Another test client for the Dictionary ADT, not much stronger.
//-----------------------------------------------------------------------------
#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include"Dictionary.h"


int main(){
	// printf("testing1\n"); // DELETE LATER
	Dictionary A = newDictionary();
	// printf("sucess making object\n"); // DELETE LATER
  	char* str;
   	char* k;
	char* v;
   	char* word1[] = {"one","two","three","four","five","six","seven"};
	char* word2[] = {"foo","bar","blah","galumph","happy","sad","blue"};
	int i;

	for(i=0; i<7; i++){
		insert(A, word1[i], word2[i]);
	}
	// printf("sucess inserting\n"); // DELETE LATER
   // print out the Dictionary
	str = DictionaryToString(A);
	// printf("sucess toString\n"); // DELETE LATER
	printf("%s\n", str);
	// printf("PRINT SUCESS\n"); // DELETE LATER
	free(str);
	// printf("FREE SUCESS\n"); // DELETE LATER

	for(i=0; i<7; i++){
		k = word1[i];
		v = lookup(A, k);
		printf("key=\"%s\" %s\"%s\"\n", k, (v==NULL?"not found ":"value="), v);
	}
	printf("\n");

   // insert(A, "five", "glow"); // duplicate key error

	delete(A, "one");
	delete(A, "three");
	delete(A, "seven");

   // print out the Dictionary
	str = DictionaryToString(A);
	printf("%s\n", str);
	free(str);

	for(i=0; i<7; i++){
		k = word1[i];
		v = lookup(A, k);
		printf("key=\"%s\" %s\"%s\"\n", k, (v==NULL?"not found ":"value="), v);
	}
	printf("\n");

   // delete(A, "one");  // key not found error

   // check size before and after makeEmpty()
	printf("%d\n", size(A));
	makeEmpty(A);
	printf("%d\n", size(A));

   // free what needs freeing
	freeDictionary(&A);

	return(EXIT_SUCCESS);
}
