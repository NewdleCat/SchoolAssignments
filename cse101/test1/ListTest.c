#include <stdio.h>
#include <stdlib.h>
#include "List.h"

int main()
{
    List L = newList();
    insert(L, 1);
    insert(L, 2);
    insert(L, 3);
    insert(L, 4);
    insert(L, 5);
    insert(L, 6);
    insert(L, 7);
    printList(L);

    int pal = palindrome(L);

    if(pal == 1)
    {
        printf("It is a palindrome\n");
    }
    else if(pal == 0)
    {
        printf("it is not a palindrome\n");
    }

    reverse(L, 3);

    printList(L);



    return EXIT_SUCCESS;
}
