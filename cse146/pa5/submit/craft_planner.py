import json
from collections import namedtuple, defaultdict, OrderedDict
from timeit import default_timer as time
from heapq import heappush, heappop

Recipe = namedtuple('Recipe', ['name', 'check', 'effect', 'cost'])


class State(OrderedDict):
    """ This class is a thin wrapper around an OrderedDict, which is simply a dictionary which keeps the order in
        which elements are added (for consistent key-value pair comparisons). Here, we have provided functionality
        for hashing, should you need to use a state as a key in another dictionary, e.g. distance[state] = 5. By
        default, dictionaries are not hashable. Additionally, when the state is converted to a string, it removes
        all items with quantity 0.

        Use of this state representation is optional, should you prefer another.
    """

    def __key(self):
        return tuple(self.items())

    def __hash__(self):
        return hash(self.__key())

    def __lt__(self, other):
        return self.__key() < other.__key()

    def copy(self):
        new_state = State()
        new_state.update(self)
        return new_state

    def __str__(self):
        return str(dict(item for item in self.items() if item[1] > 0))


def make_checker(rule):
    # Implement a function that returns a function to determine whether a state meets a
    # rule's requirements. This code runs once, when the rules are constructed before
    # the search is attempted.

    def check(state):
        # This code is called by graph(state) and runs millions of times.
        # Tip: Do something with rule['Consumes'] and rule['Requires'].

        # if object consumes, check what it consumes, false if not enough resources to make; true otherwise
        if('Consumes' in rule):
            for object in rule['Consumes']:
                # determine cost of object/action
                cost_for_object = rule['Consumes'][object]
                if(state[object] < cost_for_object):
                    return False
        
        # if object has a requirement(s) and you do not have the requirement(s), return false; true otherwise
        if('Requires' in rule):
            # determine requirement(s) for object
            for object in rule['Requires']:
                if(state[object] < 1):
                    return False
        return True

    return check


def make_effector(rule):
    # Implement a function that returns a function which transitions from state to
    # new_state given the rule. This code runs once, when the rules are constructed
    # before the search is attempted.

    def effect(state):
        # This code is called by graph(state) and runs millions of times
        # Tip: Do something with rule['Produces'] and rule['Consumes'].
        next_state = state.copy()
        if('Produces' in rule):
            # determine result(s) of action/craft
            for object in rule['Produces']:
                # add result to next state that object is produced
                next_state[object] = next_state[object] + rule['Produces'][object]
                
        if('Consumes' in rule):
            # determine any cost due to action/craft
            for object in rule['Consumes']:
                # subtract cost result from next state, which is what is consumed, update loss of resources consumed for next state
                next_state[object] = next_state[object] - rule['Consumes'][object]
        return next_state

    return effect


def make_goal_checker(goal):
    # Implement a function that returns a function which checks if the state has
    # met the goal criteria. This code runs once, before the search is attempted.

    def is_goal(state):
        # This code is used in the search process and may be called millions of times.
        for object in goal:
            # if object is not a goal or a step towards the goal, return false; true otherwise
            if (state[object] < goal[object]):
                return False
        return True

    return is_goal


def graph(state):
    # Iterates through all recipes/rules, checking which are valid in the given state.
    # If a rule is valid, it returns the rule's name, the resulting state after application
    # to the given state, and the cost for the rule.
    for r in all_recipes:
        if r.check(state):
            yield (r.name, r.effect(state), r.cost)


# def heuristic(state, action, previous_state, inventory):
def heuristic(state):
    # Implement your heuristic here!
    
    heuristic_priority = 0
    
    if state["bench"] >= 1:
        heuristic_priority -= 1
    if state["wooden_pickaxe"] >= 1:
        heuristic_priority -= 10
    if state["stone_pickaxe"] >= 1:
        heuristic_priority -= 80
    if state["furnace"] >= 1:
        heuristic_priority -= 80

    if state["furnace"] == 0:
        heuristic_priority -= state["cobble"]*9

    if state["ore"] == 1:
        heuristic_priority -= 2
    if state["coal"] == 1:
        heuristic_priority -= 1
    heuristic_priority -= state["ingot"]*20


    if state["iron_pickaxe"] >= 1:
        heuristic_priority -= 80
   
    if state["cart"] >= 1:
        heuristic_priority -= 100

    heuristic_priority -= state["rail"] * 10
    


    return heuristic_priority

def search(graph, state, is_goal, limit, heuristic):

    start_time = time()
    queue = [(0, (state, 0, []))]

    
    # Implement your search here! Use your heuristic here!
    # When you find a path to the goal return a list of tuples [(state, action)]
    # representing the path. Each element (tuple) of the list represents a state
    # in the path and the action that took you to this state
    
    # Taked with Zachary Booth, Joseph Silberman and Nathan Ma about the logic behind the search
    while time() - start_time < limit:

        curr_cost, curr = heappop(queue)
        curr_state, curr_time, back_list = curr[0], curr[1], curr[2]

        if is_goal(curr_state) == True:
   
            print("TIME: ", curr_time)
            print("LENGTH: ", len(back_list))
            return back_list 
        else:
            temp_graph = graph(curr_state)

            for s in temp_graph:
                # if curr_state['wood'] >= 5
                # print(s[0])
                new_cost = curr_time + s[2] + heuristic(curr_state)
                new_time = curr_time + s[2]
                new_back_list = back_list.copy()
                new_back_list.append((s[1], s[0]))
                heappush(queue, (new_cost, (s[1], new_time, new_back_list)))
        

    # Failed to find a path
    print(time() - start_time, 'seconds.')
    print("Failed to find a path from", state, 'within time limit.')
    return None

if __name__ == '__main__':
    with open('Crafting.json') as f:
        Crafting = json.load(f)

    # # List of items that can be in your inventory:
    # print('All items:', Crafting['Items'])
    #
    # # List of items in your initial inventory with amounts:
    # print('Initial inventory:', Crafting['Initial'])
    #
    # # List of items needed to be in your inventory at the end of the plan:
    # print('Goal:',Crafting['Goal'])
    #
    # # Dict of crafting recipes (each is a dict):
    # print('Example recipe:','craft stone_pickaxe at bench ->',Crafting['Recipes']['craft stone_pickaxe at bench'])

    # Build rules
    all_recipes = []
    for name, rule in Crafting['Recipes'].items():
        checker = make_checker(rule)
        effector = make_effector(rule)
        recipe = Recipe(name, checker, effector, rule['Time'])
        all_recipes.append(recipe)

    # Create a function which checks for the goal
    is_goal = make_goal_checker(Crafting['Goal'])

    # Initialize first state from initial inventory
    state = State({key: 0 for key in Crafting['Items']})
    state.update(Crafting['Initial'])

    # Search for a solution
    resulting_plan = search(graph, state, is_goal, 5, heuristic)

    if resulting_plan:
        # Print resulting plan
        for state, action in resulting_plan:
            print('\t',state)
            print(action)
