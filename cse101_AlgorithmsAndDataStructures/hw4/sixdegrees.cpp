#include <stdlib.h>
#include <stdio.h>
#include <iostream>
#include <vector>
#include <string.h>
#include <queue>
#include <unordered_map>

using namespace std;

// void BFS(Actor* start, Actor* end,  unordered_map<string, Movie*> pred);

struct Actor;
struct Movie;

struct Actor
{
    string name;
    vector<Movie*> movies;
    Actor(string name) : name(name) {}
};

struct Movie
{
    string name;
    Actor* path;
    Actor* pred;
    Movie(string name, Actor* path, Actor* pred) : name(name), path(path), pred(pred){}
};

void BFS(Actor* start, Actor* end,  unordered_map<string, Movie*> pred)
{
    Actor* curr = start;
    vector<Movie*> currMovieList;
    queue<Actor*> actorQ;
    // unordered_map<string, Movie*> pred;
    actorQ.push(curr);
    while(!actorQ.empty())
    {
        curr = actorQ.front();
        actorQ.pop();

        if(curr -> name == end -> name)
        {
            printf("HEY A PATH HAS BEEN FOUND!!!!\n");
            return;
        }

        currMovieList = curr -> movies;
        for(int i = 0; (unsigned)i < currMovieList.size(); i++)
        {
            // if(curr != currMovieList.at(i) -> path)
            if(pred.count(curr -> movies.at(i) -> path -> name) == 0)
            {
                actorQ.push(currMovieList.at(i) -> path);
                printf("ADDING TO pred[]\n");
                pred[currMovieList.at(i) -> path -> name] = currMovieList.at(i);
            }
        }
    }

    return;
}

int main(int argc, char* argv[])
{
    FILE *in, *out, *movieList;

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

    movieList = fopen("sample", "r");
    // movieList = fopen("cleaned_movielist.txt", "r");
    if(movieList == NULL)
    {
        printf("Unable to read from file cleaned_movielist.txt\n");
        exit(EXIT_FAILURE);
    }

    unordered_map<string, Actor*> umap;

    // char* line;
    char line[80];
    char* token;
    char* movieName;
    char* currActor;
    vector<char*> inputLine;

    while(fgets(line, 80, movieList) != NULL)
    {
        // printf("testing: %s\n", line);
        token = strtok(line, " ");
        while(token != NULL)
        {
            inputLine.push_back(token);
            token = strtok(NULL, " \n");
        }

        movieName = inputLine.at(0);

//------------Adding all the actors--------------------------------
        for(int i = 1; (unsigned)i < inputLine.size(); i++)
        {
            currActor = inputLine.at(i);
            // printf("Printing Vector at index [%d]: %s\n", i,  currActor);
            if(umap.find(currActor) == umap.end()) // Actor does not exist
            {
                Actor* inputTemp = new Actor(string(currActor));
                umap[currActor] = inputTemp;
            }
        }
//----------------Creating the connections-----------------------------------
        for(int i = 1; (unsigned)i < inputLine.size(); i++)
        {
            currActor = inputLine.at(i);
            for(int j = 1; (unsigned)j < inputLine.size(); j++)
            {
                if(i != j)
                {
                    // printf("LOOKING AT index[i = %d] : %s  ",i , inputLine.at(i));
                    // printf("LOOKING AT index[j = %d] : %s\n",j , inputLine.at(j));
                    Movie* m = new Movie(movieName, umap[inputLine.at(j)], umap[currActor]);
                    umap[currActor] -> movies.push_back(m);
                }
            }
        }

        inputLine.clear();
    }

//-----------------READING INPUTS FOR OUTPUT------------------------------
    char actorStart[50];
    char actorEnd[50];
    vector<string> reverseVector;
    unordered_map<string, Movie*> pred;
    while(fscanf(in, "%s %s\n", actorStart, actorEnd) != EOF)
    {
        printf("Actor Start: %s", actorStart);
        printf(" | Actor End: %s\n", actorEnd);

        BFS(umap[actorStart], umap[actorEnd], pred); // NOTE: check for is actor exists
        //NOTE: Check if start and end are the same

        // printf("%s ", actorStart);
        // Actor* curr = pred[string(actorEnd)];
        Actor* curr = umap[string(actorEnd)];
        string movieString = "-(";
        // char* movieString;
        // printf("1\n");
        // cout << "TESTING YAY: " << pred[curr -> name] -> pred -> name << endl;
        cout << "TESTING YAY: " << curr -> name << endl;
        // printf("1\n");
        while(curr -> name != actorStart)
        {
            reverseVector.push_back(curr -> name);
            movieString = movieString + curr -> name;
            movieString = movieString + ")-";
            curr = pred[curr -> name] -> pred;
            printf("TESTING!!!!\n");
        }

        printf("%s ", actorStart);
        for(int i = 0; (unsigned)i < reverseVector.size(); i++)
        {
            printf("%s ", reverseVector.at(i).c_str());
        }
    }



    // printf("PRINTING ALL ACTORS\n");
    // unordered_map<string, Actor*> :: iterator itr;
    // for(itr = umap.begin(); itr != umap.end(); itr++)
    // {
    //     Actor* temp = itr -> second;
    //     cout << "Actor: " << temp -> name << endl;
    //
    //     // cout << itr -> second -> movies.at(0) << endl;
    //
    //     // printf("CONNECTIONS: \n");
    //     for(int i = 0; (unsigned)i < temp -> movies.size(); i++)
    //     {
    //         cout << temp -> movies.at(i) -> name << " -> "<< temp -> movies.at(i) -> path -> name<< endl;
    //     }
    //     printf("\n");
    // }


    fclose(in);
    fclose(out);
    fclose(movieList);
}
