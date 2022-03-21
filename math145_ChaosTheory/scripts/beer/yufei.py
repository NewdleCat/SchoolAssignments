import matplotlib.pyplot as plt
import numpy as np
names = locals()
# The initialization funtion for the states variable and parameters
def initialization_function(**kwargs):
   
    # Create a dictionary, states, to contain the variables for each time
    states = {}
    parameters = {}
   
    for items in kwargs:
        if (items == 'theta' or items == 'alpha' or items == 'beta' or items == 'Q'):
            parameters[items] = kwargs[items]
        else:
            states[items] = kwargs[items]
   
    states['FSL'] = states['FPD1'] + states['FPD2']
    states['FPR'] = max(0, states['FED'] + parameters['alpha'] * (parameters['Q'] - states['FI'] + states['FB'] - parameters['beta'] * states['FSL']))
    states['RSL'] = states['RIS'] + states['FIO'] + states['FB'] + states['FOS']
    states['ROP'] = max(0, states['RED'] + parameters['alpha'] * (parameters['Q'] - states['RI'] + states['RB'] - parameters['beta'] * states['RSL']))
   
    return parameters, states



   
# The recursive function
def beerGame(parameters, states):

       
    # Fetch the parameters and states from the corresponding dictionaries
   
    # The parameters part
   
    for key, value in parameters.items():
        names[key] = value
   
    for key, value in states.items():
        names[key] = value

   
    # Update the states
    states['FI'] = max(0, FI + FPD2 - FB -FIO)
    states['FB'] = max(0, FB + FIO - FI - FPD2)
       
    states['FPD2'] = FPD1
    states['FPD1'] = FPR
       
    states['FSL'] = states['FPD1'] + states['FPD2']
    states['FED'] = theta * FIO + (1 - theta) * FED
    states['FPR'] = max(0, states['FED'] + alpha * (Q - states['FI'] + states['FB'] - beta * states['FSL']))
       
    states['FIO'] = ROP
    states['FOS'] = min(FI + FPD2, FB + FIO)
       
    states['RI'] = max(0, RI + RIS - RB - COR)
    states['RB'] = max(0, RB + COR - RI - RIS)
    states['RIS'] = FOS
       
    states['RED'] = COR
    states['RSL'] = states['RIS'] + states['FIO'] + states['FB'] + states['FOS']
    states['ROP'] = max(0, states['RED'] + alpha * (Q - states['RI'] + states['RB'] - beta * states['RSL']))


def iteration_function(parameters, states, k, n):
    # Collect the relevant data
    dict_for_relevant_data = {}
   
    for key in states:
        dict_for_relevant_data[key] = []
   
   
    # Iteration 100 times to let the behavior of the map 'beerGame' settle down. 'FOS' is x variable and 'FIO' is y variable
    for i in range(k):  
        beerGame(parameters, states)
        #print(states['FIO'])
       
    # Collect the starting point
    for key, value in states.items():
        dict_for_relevant_data[key].append(value)

   
    for i in range(n):
        beerGame(parameters, states)
        for key, value in states.items():
            dict_for_relevant_data[key].append(value)
   
    iteration_results = []
    iteration_results.append(dict_for_relevant_data)
    iteration_results.append(parameters)
   
    return iteration_results
   

def discrete_time_orbit_plot(key, iteration_results):
   
    dict_for_relevant_data = iteration_results[0]
    parameters = iteration_results[1]
   
    fig, ax = plt.subplots(figsize=(15,15))
    fig.suptitle(f"theta = {parameters['theta']}, alpha = {parameters['alpha']}, beta = {parameters['beta']}, Q = {parameters['Q']}",fontsize =30)
    fig.tight_layout()
   
    ax.plot(dict_for_relevant_data[key], color='tab:orange', marker='o', markerfacecolor='blue', markersize = 10)
       
    ax.set_xlabel("time points", fontsize = 20)
    ax.set_ylabel(key, fontsize=20)
    ax.tick_params(labelsize = 20)
   
def two_dimension_plot(key_x, key_y, iteration_results):

    dict_for_relevant_data = iteration_results[0]
    parameters = iteration_results[1]
   
    fig, ax = plt.subplots(figsize=(5,5))
    fig.suptitle(f"theta = {parameters['theta']}, alpha = {parameters['alpha']}, beta = {parameters['beta']}, Q = {parameters['Q']}",fontsize =30)
    fig.tight_layout()
    ax.tick_params(labelsize = 20)
    ax.set_xlabel(key_x, fontsize = 20)
    ax.set_ylabel(key_y, fontsize = 20)
    ax.plot(dict_for_relevant_data[key_x], dict_for_relevant_data[key_y],'o', color='tab:green', marker='o', markerfacecolor='yellow', markersize =10)
   

    ax.legend(fontsize = 20)
   
def three_dimension_plot(key_x, key_y, key_z, iteration_results):
    dict_for_relevant_data = iteration_results[0]
    parameters = iteration_results[1]
   
    ax = plt.figure(figsize=(15,15)).add_subplot(projection='3d')
    ax.set_title(f"theta = {parameters['theta']}, alpha = {parameters['alpha']}, beta = {parameters['beta']}, Q = {parameters['Q']}",fontsize =30)
    ax.tick_params(labelsize = 10)
    ax.set_xlabel(key_x, fontsize = 15)
    ax.set_ylabel(key_y, fontsize = 15)
    ax.set_zlabel(key_z, fontsize = 15)
   
   
    ax.plot(dict_for_relevant_data[key_x], dict_for_relevant_data[key_y], dict_for_relevant_data[key_z], 'o', color='tab:green', marker='o', markerfacecolor='yellow', markersize =10)
   
    ax.plot(dict_for_relevant_data[key_x][0], dict_for_relevant_data[key_y][0], dict_for_relevant_data[key_z][0],'o',
                  color = 'red', label="Starting point", markersize = 15)
    ax.plot(dict_for_relevant_data[key_x][-1], dict_for_relevant_data[key_y][-1], dict_for_relevant_data[key_z][-1], 'o', color = 'black', label="Ending point",
               markersize = 15)
    ax.legend(fontsize = 20)

def main():
    print("you're a bitchs")

if __name__ == "__main__":
    main()