from p1_support import load_level, show_level, save_level_costs

from math import inf, sqrt

from heapq import heappop, heappush





def dijkstras_shortest_path(initial_position, destination, graph, adj):

    """ Searches for a minimal cost path through a graph using Dijkstra's algorithm.



    Args:

        initial_position: The initial cell from which the path extends.

        destination: The end location for the path.

        graph: A loaded level, containing walls, spaces, and waypoints.

        adj: An adjacency function returning cells adjacent to a given cell as well as their respective edge costs.



    Returns:

        If a path exits, return a list containing all cells from initial_position to destination.

        Otherwise, return None.



    """



    pass





def dijkstras_shortest_path_to_all(initial_position, graph, adj):

    """ Calculates the minimum cost to every reachable cell in a graph from the initial_position.



    Args:

        initial_position: The initial cell from which the path extends.

        graph: A loaded level, containing walls, spaces, and waypoints.

        adj: An adjacency function returning cells adjacent to a given cell as well as their respective edge costs.



    Returns:

        A dictionary, mapping destination cells to the cost of a path from the initial_position.

    """

    heap_queue = []

    heappush(heap_queue, initial_position)
    
    cost_dict = {}
    
    cost_dict[initial_position] = 0

    while len(heap_queue) != 0:
    
        current = heappop(heap_queue)
    
        adj_list = adj(graph, current)
    
        for x in adj_list:

            new_cost = cost_dict[current] + x[1] 
            
            if x[0] not in cost_dict or new_cost < cost_dict[x[0]]:

                # print("NEW: ", x[0], new_cost) # JUST SOME DEBUGGING PRINTS

                cost_dict[x[0]] = new_cost

                heappush(heap_queue, x[0])
            
    # print()
    # print("\nTOTAL NUMBER OF ELEMENTS: ", len(cost_dict)) #CHECKS NUM OF ELEMENTS IN THE DICT

    return cost_dict



def navigation_edges(level, cell):

    """ Provides a list of adjacent cells and their respective costs from the given cell.



    Args:

        level: A loaded level, containing walls, spaces, and waypoints.

        cell: A target location.



    Returns:

        A list of tuples containing an adjacent cell's coordinates and the cost of the edge joining it and the

        originating cell.



        E.g. from (0,0):

            [((0,1), 1),

             ((1,0), 1),

             ((1,1), 1.4142135623730951),

             ... ]

    """
    adj_list = []

    # checks if the cell in the arguments is a wall and returns an empty list

    if cell in level['walls']:

        return adj_list

    

    #loads cells x,y coordinates to integers

    x = cell[0]

    y = cell[1]



    # creates a list of all possible diagonal moves

    diag_mov_list = [(x+1,y-1), (x+1,y+1), (x-1,y-1), (x-1,y+1)]

    # creates a list of all 4 directional moves

    mov_list = [(x,y+1), (x-1,y), (x+1,y), (x,y-1)]



    #iterates through both lists and appends all valid moves to the adjacency list

    for i in diag_mov_list:

        if i not in level['walls']:

            if i in level['waypoints'].values():

                adj_list.append((i,calculate_dist_diag(1, level['spaces'][cell])))

            elif cell in level['waypoints'].values():

                adj_list.append((i,calculate_dist_diag(level['spaces'][i], 1)))

            else:

                adj_list.append((i,calculate_dist_diag(level['spaces'][i], level['spaces'][cell])))



    for i in mov_list:

        if i not in level['walls']:

            if i in level['waypoints'].values():

                adj_list.append((i,calculate_dist(1, level['spaces'][cell])))

            elif cell in level['waypoints'].values():

                adj_list.append((i,calculate_dist(level['spaces'][i], 1)))

            else:

                adj_list.append((i,calculate_dist(level['spaces'][i], level['spaces'][cell])))



    return adj_list

            



def calculate_dist_diag(d1,d2):

    """

    function that returns the distance between two diagonal points

    """

    dist = 0.5*sqrt(2)*d1 + 0.5*sqrt(2)*d2

    return dist



def calculate_dist(d1,d2):

    """

    function that returns the distance between two points

    """

    dist = 0.5*d1 + 0.5*d2

    return dist



def test_route(filename, src_waypoint, dst_waypoint):

    """ Loads a level, searches for a path between the given waypoints, and displays the result.



    Args:

        filename: The name of the text file containing the level.

        src_waypoint: The character associated with the initial waypoint.

        dst_waypoint: The character associated with the destination waypoint.



    """



    # Load and display the level.

    level = load_level(filename)

    show_level(level)



    # Retrieve the source and destination coordinates from the level.

    src = level['waypoints'][src_waypoint]

    dst = level['waypoints'][dst_waypoint]



    # Search for and display the path from src to dst.

    path = dijkstras_shortest_path(src, dst, level, navigation_edges)

    if path:

        show_level(level, path)

    else:

        print("No path possible!")





def cost_to_all_cells(filename, src_waypoint, output_filename):

    """ Loads a level, calculates the cost to all reachable cells from 

    src_waypoint, then saves the result in a csv file with name output_filename.



    Args:

        filename: The name of the text file containing the level.

        src_waypoint: The character associated with the initial waypoint.

        output_filename: The filename for the output csv file.



    """

    

    # Load and display the level.

    level = load_level(filename)

    show_level(level)



    # Retrieve the source coordinates from the level.

    src = level['waypoints'][src_waypoint]

    # Calculate the cost to all reachable cells from src and save to a csv file.

    costs_to_all_cells = dijkstras_shortest_path_to_all(src, level, navigation_edges)

    save_level_costs(level, costs_to_all_cells, output_filename)





if __name__ == '__main__':

    filename, src_waypoint, dst_waypoint = 'example.txt', 'a','e'



    # Use this function call to find the route between two waypoints.

    test_route(filename, src_waypoint, dst_waypoint)



    # Use this function to calculate the cost to all reachable cells from an origin point.

    cost_to_all_cells(filename, src_waypoint, 'my_costs.csv')

