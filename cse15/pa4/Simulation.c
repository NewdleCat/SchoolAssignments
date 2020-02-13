//----------------------------
//  Simulation.c
//
// Name: Nicholas Tee
// CruzID: ntee
// CSE 15
// Novmber 30
//
// This program simulates a given number of Jobs
// with m - 1 number of proccessors where m is
// the number of jobs
//----------------------------
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "Job.h"
#include "IntegerQueue.h"

void printTrace(FILE* trc, Job* backup, IntegerQueue* storage, int time, int P);

Job getJob(FILE* in){
    int a, d;
    fscanf(in, "%d %d\n", &a, &d);
    return newJob(a, d);
}

void printTrace(FILE* trc, Job* backup, IntegerQueue* storage, int time, int P){
    fprintf(trc, "time=%d\n", time);
    for(int i = 0; i <= P; i++){                //Helper funtion for printing traces
        fprintf(trc, "%d: ", i);
        for(int j = 0; j < length(storage[i]); j++){
            int temp = dequeue(storage[i]);
            printJob(trc, backup[temp]);
            enqueue(storage[i], temp);
        }
        fprintf(trc, "\n");
    }
}

int main(int argc, char* argv[]){
    FILE *in, *rpt, *trc;
    int m;

//------checking program arguments--------
//------and opening file------------------
    if(argc != 2){
        printf("Error: wrong number of program arguments\n");
        exit(EXIT_FAILURE);
    }

    in = fopen(argv[1], "r");
    if(in == NULL){
        printf("Error: Unable to read from file\n");
        exit(EXIT_FAILURE);
    }
    char* rptName = argv[1];
    char* trcName = malloc(1024);
    strcpy(trcName, rptName);
    rpt = fopen(strcat(rptName, ".rpt"), "w");
    if(rpt == NULL){
        printf("Error: Unable to write to file\n");
        exit(EXIT_FAILURE);
    }

    // char* trcName = argv[1];
    trc = fopen(strcat(trcName, ".trc"), "w");
    if(trc == NULL){
        printf("Error: Unable to write to file\n");
        exit(EXIT_FAILURE);
    }

//-----------------------------------------
//-----------------------------------------
    fscanf(in, "%d", &m);

    Job* backup = malloc(1024);

    for(int i = 0; i < m; i++){
        backup[i] = getJob(in);
    }
//-----------Output File Headers------------
    fprintf(trc, "Trace file: %s\n", trcName);
    fprintf(trc, "%d Jobs:\n", m);
    for(int i = 0; i < m; i++){
        printJob(trc, backup[i]);
    }
    fprintf(trc, "\n\n");

    fprintf(rpt, "Report file: %s\n", rptName);
    fprintf(rpt, "%d Jobs:\n", m);
    for(int i = 0; i < m; i++){
        printJob(rpt, backup[i]);
    }
    fprintf(rpt, "\n\n");
    fprintf(rpt, "***********************************************************\n");
//----------------------------------------------
    char* plural = "";
    int time;
    for(int n = 1; n <= m - 1; n++){
        if(n > 1){
            plural = "s";
        }
        fprintf(trc, "*****************************\n");
        fprintf(trc, "%d processor%s:\n", n, plural);
        fprintf(trc, "*****************************\n");
        //--------Initializing-------------
        IntegerQueue* storage = malloc(1024);
        for(int i = 0; i <= n; i++){
            storage[i] = newIntegerQueue();
        }
        for(int i = 0; i < m; i++){
            enqueue(storage[0], i);
        }

        //--------TRACE FILE-----------------------------------------
        time = 0;
        printTrace(trc, backup, storage, time, n); // printing
        fprintf(trc, "\n");
        int checkN, queueN;
        while(length(storage[0]) != m || getFinish(backup[peek(storage[0])]) == UNDEF){
            // ----------Checking for finished jobs-----------
            checkN = 0;
            queueN = 0;
            for(int i = 1; i <= n; i++){
                if(isEmpty(storage[i]) == 0){
                    if(getFinish(backup[peek(storage[i])]) == time){
                        enqueue(storage[0], peek(storage[i]));
                        dequeue(storage[i]);
                        checkN++;
                    }
                }
            }
            //-----------Printing ---------------------------------
            for(int i = 1; i <= n; i++){
                if(isEmpty(storage[i]) == 0){
                    if(getFinish(backup[peek(storage[i])]) == UNDEF){
                        computeFinishTime(backup[peek(storage[i])], time);
                    }
                }
            }
            if(checkN > 0){
                printTrace(trc, backup, storage, time, n); // printing
                fprintf(trc, "\n");
            }
            //----------Queueing Jobs----------
            for(int i = 0; i < length(storage[0]); i++){
                if(getArrival(backup[peek(storage[0])]) == time){
                    int min = length(storage[1]);
                    int index = 1;
                    for(int i = 1; i <= n; i++){ // Finding shortest queue
                        if(length(storage[i]) < min){
                            min = length(storage[i]);
                            index = i;
                        }
                    }
                    enqueue(storage[index], peek(storage[0]));
                    dequeue(storage[0]);
                    queueN++;
                }
            }
            //------------------Printing-------------------
            for(int i = 1; i <= n; i++){
                if(isEmpty(storage[i]) == 0){
                    if(getFinish(backup[peek(storage[i])]) == UNDEF){
                        computeFinishTime(backup[peek(storage[i])], time);
                    }
                }
            }
            if(queueN > 0){
                printTrace(trc, backup, storage, time, n); // printing
                fprintf(trc, "\n");
            }
            time++;


        }

        //------------Report File---------------------------
        char* pluralR = "";
        int totalW, maxW;
        double avgW;
        totalW = 0;
        maxW = 0;
        avgW = 0;
        for(int i = 0; i < m; i++){
            totalW += getWaitTime(backup[i]);
            if(getWaitTime(backup[i]) > maxW){
                maxW = getWaitTime(backup[i]);
            }
        }
        avgW = (double)totalW / m;
        if(n > 1){
            pluralR = "s";
        }

        fprintf(rpt, "%d processor%s: totalWait=%d, maxWait=%d, averageWait=%.2f\n", n, pluralR, totalW, maxW, avgW);

        for(int i = 0; i < m; i++){ // Reseting finish times
            resetFinishTime(backup[i]);
        }
        free(storage);
    }

    free(backup);
    free(trcName);
    fclose(in);
    fclose(rpt);
    fclose(trc);
    return EXIT_SUCCESS;
}
