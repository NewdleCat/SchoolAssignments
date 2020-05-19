//-------------------
// Nicholas Tee
// CruzID: ntee
// CSE 101
//------------------

#include <stdlib.h>
#include <stdio.h>
#include <stack>
#include <ctype.h>
#include <cstring>

using namespace std;

int **generateArray(int s);
void printBoard(int** B, int size);
void placeQueen(int** B, int s, int i, int j);
void removeQueen(int** B, int s, int i, int j);
bool checkColisions(int** B, int s, int i, int j);
void findSolutions(int** B, int size, int i);

struct Queen
{
    int i;
    int j;
};

bool findSolutionsStack(int** B, int size, int asdqwe)
{
    stack<Queen> recurStack;
    stack<Queen> onBoard;
    int i, j;
    Queen initialPush;
    for(i = 1; i < size + 1; i++)// finding the first empty row
    {
        if(B[i][0] == 0)
            break;
    }
    // printf("Done with first for loop\n"); // DELETE LATER
    for(j = size; j >= 1; j--)
    {
        if(B[i][j] == 0)
        {
            initialPush.i = i;
            initialPush.j = j;
            recurStack.push(initialPush);
        }
    }
    // printf("Done with the second for loop\n"); // DELETE LATER

    while(!recurStack.empty())
    {
        // printBoard(B, size); // DELETE LATER
        Queen top = recurStack.top();
        recurStack.pop();
        placeQueen(B, size, top.i, top.j);
        onBoard.push(top);

        int solved = 1;
        for(int n = 1; n < size + 1; n++)
        {
            if(B[n][0] == 0)
                solved = 0;
        }
        if(solved == 1)  // BASE CASE
        {
            return true;
        }

        int k;
        for(k = 1; k < size + 1; k++)// finding the next empty row
        {
            if(B[k][0] == 0)
                break;
        }
        bool wasPushed = false;
        for(int n = size; n >= 1; n--)
        {
            if(B[k][n] == 0)
            {
                Queen toPush;
                toPush.i = k;
                toPush.j = n;
                recurStack.push(toPush);
                wasPushed = true;
            }
        }
        if(wasPushed == false)
        {
            if(recurStack.size() > 1)
            {
                while(onBoard.top().i != recurStack.top().i)
                {
                    Queen temp = onBoard.top();
                    onBoard.pop();
                    removeQueen(B, size, temp.i, temp.j);
                }
                Queen temp = onBoard.top();
                onBoard.pop();
                removeQueen(B, size, temp.i, temp.j);
            }
            else
            {
                Queen temp = onBoard.top();
                onBoard.pop();
                removeQueen(B, size, temp.i, temp.j);
            }
            continue;
        }
    }
    return false;
}

int **generateArray(int size)
{
    int s = size + 1;
    int **array = (int**)malloc(sizeof(int*) * s);
    for(int i = 0; i < s; i++)
    {
        array[i] = (int*)malloc(sizeof(int) * s);
        for(int j = 0; j < s; j++)
        {
            array[i][j] = 0;
        }
    }
    return array;
}

void printBoard(int** B, int size)
{
    printf("-------Printing Board-----------\n");
    for(int i = 0; i < size + 1; i++)
    {
        for(int j = 0; j < size + 1; j++)
        {
            printf("%d ", B[i][j]);
        }
        printf("\n");
    }
    printf("--------------------------------\n");
}

void placeQueen(int** B, int s, int i, int j)
{
    int k = 1, l = 1;
    B[i][j] = 1; // place queen
    B[i][0] = j;
    B[0][j] = i;

    for (k = 1; k < s + 1; k++) // place -1 vertically
    {
        if (B[k][j] != 1)
        B[k][j] -= 1;
    }
    for(l = 1; l < s + 1; l++)
    {
        if(B[i][l] != 1)
        B[i][l] -= 1;
    }

    k = i;
    l = j;
    while(k > 1 && l > 1)
    {
        k--;
        l--;
    }
    while (k < s + 1 && l < s + 1) // place-1 diagonally south east
    {
        if(B[k][l] != 1)
        B[k][l] -= 1;
        k++;
        l++;
    }

    k = i;
    l = j;
    while(k > 1 && l < s)
    {
        k--;
        l++;
    }
    while (k < s + 1 && l >= 1) // place -1 diagonally south west
    {
        if(B[l][k] != 1)
        B[l][k] -= 1;
        k++;
        l--;
    }
}

void removeQueen(int** B, int s, int i, int j){
    int k = 1, l = 1;
    B[i][j] = 0;
    B[i][0] = 0;
    B[0][j] = 0;

    for (k = 1; k < s + 1; k++)// add 1 vertically
    {
        if (B[k][j] != 0)
        B[k][j] += 1;
    }
    for(l = 1; l < s + 1; l++)
    {
        if(B[i][l] != 0)
        B[i][l] += 1;
    }


    k = i;
    l = j;
    while(k > 1 && l > 1)
    {
        k--;
        l--;
    }
    while (l < s + 1 && k < s + 1)  // add 1 diagonally
    {
        if(B[k][l] != 0)
        B[k][l] += 1;
        k++;
        l++;
    }

    k = i;
    l = j;
    while(k > 1 && l < s)
    {
        k--;
        l++;
    }
    while (k < s + 1 && l >= 1) // add 1 diagonally
    {
        if(B[l][k] != 0)
        B[l][k] += 1;
        k++;
        l--;
    }
}

bool checkColisions(int** B, int s, int i, int j)
{
    int k = 1, l = 1;
    for (k = 1; k < s + 1; k++) // place -1 vertically
    {
        // printf("VERTICAL\n"); // dELETE LATER
        if (B[k][j] == 1 && k != i)
            return true;
    }
    for(l = 1; l < s + 1; l++)
    {
        // printf("HORIZONTAL\n");
        if(B[i][l] == 1 && l != j)
            return true;
    }

    k = i;
    l = j;
    while(k > 1 && l > 1)
    {
        k--;
        l--;
    }
    while (k < s + 1 && l < s + 1) // place-1 diagonally south east
    {
        // printf("DIAGONAL 1\n");
        if(B[k][l] == 1 && k != i && j != l)
            return true;
        k++;
        l++;
    }

    k = i;
    l = j;
    while(k > 1 && l < s + 1)
    {
        k--;
        l++;
    }
    while (k < s + 1 && l >= 1) // place -1 diagonally south west
    {
        // printf("DIAGONAL2\n");
        if(B[k][l] == 1 && k != i && j != l)
            return true;
        k++;
        l--;
    }
    return false;
}

int main(int argc, char* argv[])
{
    FILE *in, *out;

    if(argc != 3)
    {
        printf("Error: wrong number of inputs\n");
        exit(EXIT_FAILURE);
    }

    in = fopen(argv[1], "r");
    if(in == NULL)
    {
        printf("Unable to read from file %s\n", argv[1]);
        exit(EXIT_FAILURE);
    }

    out = fopen(argv[2], "w");
    if(out == NULL)
    {
        printf("Unable to write to file %s\n", argv[2]);
        exit(EXIT_FAILURE);
    }
//-----------Parsing through inputs------------------------
    int size, row, col, i;
    int** B;
    bool collisions;
    char inTemp[20];
    while(fgets(inTemp, 20, in) != NULL)
    {
        if(strcmp(inTemp, "\n") != 0)
        {
            i = 1;
            size = inTemp[0] - '0';
            if(size == 1)
            {
                if(inTemp[1] - '0' < 11 && inTemp[1] - '0' >= 0)
                {
                    size = (inTemp[1] - '0') + 10;
                    i++;
                }
            }
            B = generateArray(size);
            i++;
            while(inTemp[i] != '\n')
            {

                col = inTemp[i] - '0';
                if(col == 1)
                {
                    if(inTemp[i + 1] - '0' < 11 && inTemp[i + 1] - '0' >= 0)
                    {
                        col = (inTemp[i + 1] - '0') + 10;
                        i++;
                    }
                }
                i += 2;
                row = inTemp[i] - '0';
                if(row == 1)
                {
                    if(inTemp[i + 1] - '0' < 11 && inTemp[i + 1] - '0' >= 0)
                    {
                        row = (inTemp[i + 1] - '0') + 10;
                        i++;
                    }
                }
                i++;
                while(inTemp[i] == ' ')
                {
                    i++;
                }

                printf("Size: %d | Row: %d | Col: %d\n", size, row, col);
                placeQueen(B, size, row, col);
                collisions = checkColisions(B, size, row , col);
                if(collisions)
                    break;
            }

            if(!collisions)
            {
                bool solved = findSolutionsStack(B, size, 1);
                if(solved)
                {
                    for(int p = 1; p < size + 1; p++)
                    {
                        fprintf(out, "%d %d ", p, B[0][p]);
                    }
                    fprintf(out, "\n");
                }
                else
                {
                    fprintf(out, "No solution\n");
                }
            }
            else
            {
                fprintf(out, "No solution\n");
            }
        }
    }
    // B = generateArray(11);
    // placeQueen(B, 11, 10, 7);
    // printBoard(B, 11);

//-----------------------------------------------------------
    fclose(in);
    fclose(out);

    return EXIT_SUCCESS;
}
