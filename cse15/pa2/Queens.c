//-------------------
//Nicholas Tee
//CruzID: ntee
//CSE 15
//October 16 2019
//
//Queens.c
//Program checks the input and calculated the sum of solutions to the Queens problem
//Program will also print all solutions if given the -v option which is verbose mode
//------------------

#include<stdlib.h>
#include<stdio.h>
#include<ctype.h>
#include<string.h>
#include<assert.h>

void placeQueen(int** B, int n, int i, int j);
void removeQueen(int** B, int n, int i, int j);
void printBoard(int** B, int n);
int findSolutions(int** B, int n, int i, char* mode);
int isNum(char num[]);
void badInput();
int **generateArray(int r, int c);

int main(int argc, char* argv[]){
	char* mode, n;

	if (argc == 1 || argc > 3){ // checks if there is the correct amount of program args
		badInput();
		return EXIT_SUCCESS;
	} else if (argc == 2){ // if there is only one arg
		if (isNum(argv[1]) == 0){
			badInput(); // print error if input is not an int
			return EXIT_FAILURE;
		}
		n = atoi(argv[1]);
		mode = "normal";
	} else if (argc == 3){
		if (strcmp(argv[1], "-v") || isNum(argv[2]) == 0){
			badInput(); // print error if 1st input isnt -v or 2nd input isnt an int
			return EXIT_FAILURE;
		}
		n = atoi(argv[2]);
		mode = "verbose"; // mode is now verbose
	}

	int** B;
	B = generateArray(n + 1, n + 1); // generate the array
	assert( B != NULL );

	int i = 1;
	printf("%d-Queens has %d solutions\n", n, findSolutions(B, n, i, mode));

	// for (int ii = 0; ii < n + 1; i++){
	// 	int* currB = B[ii];
	// 	free(currB);
	// }
	free(*B);
	free(B);

	return EXIT_SUCCESS;
}

int **generateArray(int r, int c){
    int **array= (int **)malloc(sizeof(int *) * r);
    int i, j;
    for (i = 0; i < r; i++)
	{
        array[i] = (int *)malloc(sizeof(int) * c);
        for(j = 0; j < c; j++)
		{
            array[i][j] = 0;
        }
    }
    return array;
}

int findSolutions(int** B, int n , int i, char* mode){
	int sum = 0;
	if (i > n){
		if(!strcmp(mode, "verbose")){ // print solution if mode is verbose
		 	printBoard(B, n);
		}
		return 1;
	} else {
		for (int j = 1; j < n + 1; j++){
			if (B[i][j] == 0){
				placeQueen(B, n, i, j); // call placeQueen
				sum += findSolutions(B, n, i + 1, mode); // recur with i + 1
				removeQueen(B, n, i, j); // call removeQueens
			}
		}
	}
	return sum; // return sum
}

void placeQueen(int** B, int n, int i, int j){
	int k = 1, l = 1;
	B[i][j] = 1; // place queen
	B[i][0] = j;

	for (k = i; k < n + 1; k++){ // place -1 vertically
		if (B[k][j] != 1){
			B[k][j] -= 1;
		}
	}

	k = i + 1;
	l = j + 1;
	while (k < n + 1 && l < n + 1){ // place-1 diagonally
		B[k][l] -= 1;
		k++;
		l++;
	}

	k = i + 1;
	l = j - 1;
	while (k < n + 1 && l >= 1){ // place -1 diagonally
		B[k][l] -= 1;
		k++;
		l--;
	}

}

void removeQueen(int** B, int n, int i, int j){
	int k = 1, l = 1;
	B[i][j] = 0;
	B[i][0] = 0;

	for (k = i; k < n + 1; k++){ // add 1 vertically
		if (B[k][j] != 0){
			B[k][j] += 1;
		}
	}

	k = i + 1;
	l = j + 1;
	while (l < n + 1 && k < n + 1){ // add 1 diagonally
		B[k][l] += 1;
		k++;
		l++;
	}

	k = i + 1;
	l = j - 1;
	while (k < n + 1 && l >= 1){ // add 1 diagonally
		B[k][l] += 1;
		k++;
		l--;
	}

}

void printBoard(int** B, int n){
	int firstElement = 1;

	for (int ii = 1; ii < n + 1; ii ++){
		if (firstElement == 1){
			printf("(%d", B[ii][0]); // prints first element of solution
			firstElement = 0;
		} else {
			printf(", %d", B[ii][0]); // prints the rest of the solution
		}
	}
	printf(")\n");
}

int isNum(char num[]){
	for(int i = 0; num[i] != 0; i++){ // function used to check if input is an integer
		if(!isdigit(num[i])){
			return 0;
		}
	}
	return 1;
}

void badInput(){ // function that prints the error message
	printf("Usage: Queens [-v] number\n");
	printf("Option: -v verbose output, print all solutions\n");
}
