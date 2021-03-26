//-------------------------------------
//Nicholas Tee
//CruzId: ntee
//CSE 15
//October 7 2019
//
//Subset.c
//Gives all the possible subsets based on the input of the user
//
//-------------------------------------
#include<stdlib.h>
#include<stdio.h>
#include<ctype.h>
void badInput();
int isNum(char num[]);
void printSubsets(int B[], int n, int k, int i);
void printSet(int B[], int n);

int main(int argc, char* argv[] ){
	
	if (argc < 2){
		badInput();
		return EXIT_SUCCESS;
	}

	int n = atoi(argv[1]);
	int k = atoi(argv[2]);
	int B[n+1];

	if (isNum(argv[1]) == 0 || isNum(argv[2]) == 0) {
		badInput();
		return EXIT_SUCCESS;
	} else if (n > 100 || k > n || k < 0){
		badInput();
		return EXIT_SUCCESS;
	}

	for(int i = 0; i < n+1; i++){
		B[i] = 0;
	}
	
	int i = 1;
	printSubsets(B, n, k, i);

	return EXIT_SUCCESS;
}

void printSubsets(int B[], int n, int k, int i){
	if (k == 0){
		printSet(B, n);
	} else if ( i < n + 1) {
		B[i] = 1;
		printSubsets(B, n, k - 1, i + 1);
	 	B[i] = 0;
		printSubsets(B, n, k, i + 1);
	}
}

void printSet(int B[], int n){
	int hasSubset = 0;
	int firstElement = 0;
	printf("{");
	for(int i = 1; i < n + 1; i++){
		if (B[i] == 1 && firstElement == 0){
			printf("%d", i);
			firstElement = 1;
			hasSubset = 1;
		} else if (B[i] == 1){
			printf(", %d", i);
		}
	}

	if (hasSubset == 0){
		printf(" ");
	}

	printf("}\n");
}

int isNum(char num[]){
	for(int i = 0; num[i] != 0; i++){
		if(!isdigit(num[i])){
			return 0;
		}
	}
	return 1;
}

void badInput(){
	printf("Usage: Subset n k (n and k are ints satisfying 0<=k<=n<=100)\n");
}
