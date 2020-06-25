from p1_support import load_level, show_level, save_level_costs
from math import inf, sqrt
from heapq import heappop, heappush

def estimateDistance(vertex, destination):
    xDelta = destination[0] - vertex[0]
    yDelta = destination[1] - vertex[1]

    return abs(xDelta) + abs(yDelta)

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

    # Dictionary of all the points we've discovered
    DiscoverDict = {initial_position : {'distance': 0, 'parent': 'None'}}

    PrioQueue = []
    initEstimate = estimateDistance(initial_position, destination)
    # Add initial position to PrioQueue with proper priority
    heappush(PrioQueue, (initEstimate, initial_position))

    # As long as there are elements in the PrioQueue and Goal hasn't been found
    foundGoal = -1
    while (len(PrioQueue) > 0) and foundGoal == -1:
        #Take the highest priority node (being the node with the lowest distance)

        currPrio, currentNode = heappop(PrioQueue)

        AdjacentNodes = adj(graph, currentNode)
        # Visit all the neighbor nodes
        for NeighborNode in AdjacentNodes:
            # If we've visited this node before
            if NeighborNode[0] in DiscoverDict.keys():
                # Check if this is a shorter path
                if DiscoverDict[currentNode]['distance'] + NeighborNode[1] < DiscoverDict[NeighborNode[0]]['distance']:
                    # Update our dictionary of discovered nodes
                    DiscoverDict[NeighborNode[0]]['distance'] = DiscoverDict[currentNode]['distance'] + NeighborNode[1]
                    DiscoverDict[NeighborNode[0]]['parent'] = currentNode
                # DON'T re-add to the priority queue
            # If we haven't visited this node before
            else:
                # Check if Goal is found
                if NeighborNode[0] == destination:
                    foundGoal = 1
                # Add it to our dictionary
                DiscoverDict[NeighborNode[0]] = {'distance': DiscoverDict[currentNode]['distance'] + NeighborNode[1], 'parent': currentNode}

                # Add newly discovered position to our prioqueue with proper prio
                heappush(PrioQueue, (DiscoverDict[NeighborNode[0]]['distance'] + estimateDistance(NeighborNode[0], destination), NeighborNode[0]))

    if foundGoal == 1:
        # Traverse backwards from destination using Parents to create return list.
        returnList = [destination]
        pathNode = destination
        # Traverse until we get back to Initial_position
        while DiscoverDict[pathNode]['parent'] != 'None':
            returnList.insert(0, DiscoverDict[pathNode]['parent'])
            pathNode = DiscoverDict[pathNode]['parent']
        return returnList
    return 'None'

def dijkstras_shortest_path_to_all(initial_position, graph, adj):
    """ Calculates the minimum cost to every reachable cell in a graph from the initial_position.

    Args:
        initial_position: The initial cell from which the path extends.
        graph: A loaded level, containing walls, spaces, and waypoints.
        adj: An adjacency function returning cells adjacent to a given cell as well as their respective edge costs.

    Returns:
        A dictionary, mapping destination cells to the cost of a path from the initial_position.
    """
    # Create Dictionary to track discovered coordinates and to return
    ReturnDict = {initial_position : 0}

    # Add initial position to Queue with proper prio
    PrioQueue = []
    heappush(PrioQueue, (0, initial_position))

    # As long as there are elements in the PrioQueue
    while (len(PrioQueue) > 0):
        #Take the highest priority node (being the node with the lowest distance)

        currPrio, currentNode = heappop(PrioQueue)

        AdjacentNodes = adj(graph, currentNode)
        # Visit all the neighbor nodes
        for NeighborNode in AdjacentNodes:
            # If we've visited this node before
            if NeighborNode[0] in ReturnDict.keys():
                # Check if this is a shorter path
                if ReturnDict[currentNode] + NeighborNode[1] < ReturnDict[NeighborNode[0]]:
                    # Update our dictionary of discovered nodes
                    ReturnDict[NeighborNode[0]] = ReturnDict[currentNode] + NeighborNode[1]
                # DON'T re-add to the priority queue
            # If we haven't visited this node before
            else:
                # Add it to our dictionary
                ReturnDict[NeighborNode[0]] = ReturnDict[currentNode] + NeighborNode[1]
                # Add to queue with proper prio
                heappush(PrioQueue, (ReturnDict[NeighborNode[0]], NeighborNode[0]))
    return ReturnDict


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
    ret = [] # List to return
    costFrom = level['spaces'].get((cell[0], cell[1]))
    for x in range(-1 + cell[0], 2 + cell[0]):
        for y in range(-1 + cell[1],2 + cell[1]):
            # if this is not the middle tile and this isn't a wall
            if not (x == cell[0] and y == cell[1]) and not (x,y) in level['walls']:
                # assume the cost is 1, this covers for waypoints
                costTo = 1

                # if there is a space here, the costTo becomes the cost of the space
                if level['spaces'].get((x,y)) != None:
                    costTo = level['spaces'].get((x,y))

                # now that we know the costTo and costFrom
                # we can now calculate the totalCost for this tile
                totalCost = 0.5 * (costFrom + costTo)

                if x != cell[0] and y != cell[1]:
                    totalCost = sqrt(2) * 0.5 * (costFrom + costTo)

                ret.append(((x,y), totalCost))
    return ret


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
    filename, src_waypoint, dst_waypoint = 'test_maze.txt', 'a','e'

    # Use this function call to find the route between two waypoints.
    test_route(filename, src_waypoint, dst_waypoint)

    # Use this function to calculate the cost to all reachable cells from an origin point.
    cost_to_all_cells(filename, src_waypoint, 'my_maze_costs.csv')
