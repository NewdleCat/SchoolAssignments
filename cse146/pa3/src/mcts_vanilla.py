
from mcts_node import MCTSNode
from random import choice
from math import sqrt, log

num_nodes = 1000
explore_faction = 2.

def find_confidence_num(node):
    return (node.wins/node.visits) + explore_faction * sqrt((log(node.parent.visits))/node.visits)


def traverse_nodes(node, board, state, identity):
    """ Traverses the tree until the end criterion are met.

    Args:
        node:       A tree node from which the search is traversing.
        board:      The game setup.
        state:      The state of the game.
        identity:   The bot's identity, either 'red' or 'blue'.

    Returns:        A node from which the next stage of the search can proceed.

    """
    # Uses upper confidence bound to either exploit or explore new nodes
    # Traverse down tree with biasing choice for child nodes until leaf node and return
    maxNumber = 0
    maxNode = node
    for childNode in node.child_nodes:
        if find_confidence_num(childNode) > maxNumber:
            maxNumber = find_confidence_num(childNode)
            maxNode = childNode

    return maxNode
    
    # Hint: return leaf_node

    # if move == "q":
    #   exit(2)
    # action = board.pack_action(move)
    # if board.is_legal(state, action):


def expand_leaf(node, board, state):
    """ Adds a new leaf to the tree by creating a new child node for the given node.

    Args:
        node:   The node for which a child will be added.
        board:  The game setup.
        state:  The state of the game.

    Returns:    The added child node.

    """

    # Create new node (random state) and return the node

    moves = node.untried_actions
    next_move = choice(moves)
    newState = board.next_state(state, next_move)
    new_node = MCTSNode(node, next_move, board.legal_actions(newState))
    return new_node

    # Hint: return new_node


def rollout(board, state):
    """ Given the state of the game, the rollout plays out the remainder randomly.

    Args:
        board:  The game setup.
        state:  The state of the game.

    """

    # From random state play random game and record win rate?
    # Play k random games and record the win rate to visit rate of the new node?

    


def backpropagate(node, won):
    """ Navigates the tree from a leaf node to the root, updating the win and visit count of each node along the path.

    Args:
        node:   A leaf node.
        won:    An indicator of whether the bot won or lost the game.

    """

    # Go back up to the root node (starting state) while updating win/visit values of every node along path

    pass


def think(board, state):
    """ Performs MCTS by sampling games and calling the appropriate functions to construct the game tree.

    Args:
        board:  The game setup.
        state:  The state of the game.

    Returns:    The action to be taken.

    """
    identity_of_bot = board.current_player(state)
    root_node = MCTSNode(parent=None, parent_action=None, action_list=board.legal_actions(state))

    # Passes in the current state of game with the action list 

    # Iterates through number of playthroughs(?)
    
    for step in range(num_nodes):
        # Copy the game for sampling a playthrough
        sampled_game = state

        # Start at root
        node = root_node

        # Do MCTS - This is all you!
        max_node = traverse_nodes(node, board, sampled_game, "red")
        new_node = expand_leaf(max_node, board, sampled_game)
        rollout(board, sampled_game)
        # Save results of rollout in some type of data
        # For results in rollout_result:
        #   backprogagate (new_node, won)


        tempNode = traverse_nodes(node, board, state, identity)

        

    # Return an action, typically the most frequently used action (from the root) or the action with the best
    # estimated win rate.
    return None
