//-------------------
// Nicholas Tee
// CruzID: ntee
// CSE 101
//------------------

#include <stdlib.h>
#include <stdio.h>
#include <stack>
#include <ctype.h>

using namespace std;

int **generateArray(int s);
void printBoard(int** B, int size);
void placeQueen(int** B, int s, int i, int j);
void removeQueen(int** B, int s, int i, int j);
void findSolutions(int** B, int size, int i);

struct Queen
{
    int i;
    int j;
};



// void findSolutions(int** B, int size, int i)
// {
//     // int sum = 0;
//     if(i > size)
//     {
//         printf("Solution: ");
//         for(int t = 1; t < size + 1; t++)
//         {
//             printf("%d ", B[t][0]);
//         }
//         printf("\n");
//     }
//     else
//     {
//         for(int j = 1; j < size + 1; j++)
//         {
//             // printf("Value of i = %d\n", i);
//             if(B[i][0] == 0)
//             {
//                 if(B[i][j] == 0)
//                 {
//                     placeQueen(B, size, i, j);
//                     findSolutions(B, size, i + 1);
//                     removeQueen(B, size, i, j);
//                 }
//             }
//             else
//             {
//                 i++;
//             }
//         }
//     }
// }

void findSolutionsStack(int** B, int size, int asdqwe)
{
    stack<Queen> recurStack;
    int i;
    for(i = 1; i < size + 1; i++)
    {
        if(B[i][0] != 0)
            break;
    }
    Queen q {i, 0};
    recurStack.push(q);
    placeQueen(B, size, q.i, q.j);
    while(!recurStack.empty())
    {
        Queen top = recurStack.top();
        recurStack.pop();
        removeQueen(B, size, top.i, top.j);

        int j;
        for(j = top.j + 1; j < size + 1; j++)
        {
            if(B[top.i][j] == 0)
                break;
        }
        top.j = j;
        if(j <= size)
        {
            placeQueen(B, size, top.i, top.j);
            recurStack.push(top);
        }

        for(i = 1; i < size + 1; i++)
        {
            if(B[i][0] != 0)
                break;
        }
        Queen temp {i, 0};
        recurStack.push(temp);
        placeQueen(B, size, temp.i, temp.j);

        int done = 1;
        for(int n = 1; n < size + 1; n++)
        {
            if(B[n][0] == 0)
                done = 0;
        }

        if(done == 1)
        {
            printf("Solution: ");
            for(int t = 1; t < size + 1; t++)
            {
                printf("%d ", B[t][0]);
            }
            printf("\n");
        }
    }
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
    if(i > 0 && j > 0)
    {
        int k = 1, l = 1;
        B[i][j] = 1; // place queen
        B[i][0] = j;

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

    // printf("QUEEN PLACED as (%d, %d)\n", i, j);
    // printBoard(B, s);
}

void removeQueen(int** B, int s, int i, int j){
    if(i > 0 && j > 0)
    {
        int k = 1, l = 1;
        B[i][j] = 0;
        B[i][0] = 0;

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


    // printf("QUEEN REMOVEd as (%d, %d)\n", i, j);
    // printBoard(B, s);
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

    out = fopen(argv[2], "r");
    if(out == NULL)
    {
        printf("Unable to write to file %s\n", argv[2]);
        exit(EXIT_FAILURE);
    }
//-----------Parsing through inputs------------------------
    // int size, row, col, i;
    // char inTemp[20];
    // while(fgets(inTemp, 20, in) != NULL)
    // {
    //     i = 1;
    //     // printf("String is = %s\n", inTemp);
    //     size = inTemp[0] - '0';
    //     printf("size = %d\n", size);
    //     int** B = generateArray(size);
    //     while(inTemp[i] != '\n')
    //     {
    //         i++;
    //         col = inTemp[i] - '0';
    //         i += 2;
    //         row = inTemp[i] - '0';
    //         i++;
    //         printf("Place Queens at: (%d, %d)\n", col, row);
    //         placeQueen(B, size, row, col);
    //         findSolutions(B, size, 1);
    //     }
    // }

    int size = 4;
    int** B = generateArray(size);
    placeQueen(B, size, 1, 2);
    placeQueen(B, size, 3, 1);
    findSolutionsStack(B, size, 1);
//-----------------------------------------------------------


    fclose(in);
    fclose(out);

    return EXIT_SUCCESS;
}
