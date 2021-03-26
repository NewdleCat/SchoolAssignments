from heapq import heappop, heappush
import math

def calculate_dist(p1, p2):
    num = pow(p1[0] - p2[0], 2) + pow(p1[1] - p2[1], 2)
    num = math.sqrt(num)

    return num

def heuristic(p1, p2):
    return abs(p1[0] - p2[0]) + abs(p1[1] - p2[1])

def get_target_point(currPoint, nextBox):
    
    nextBox_is_up = False
    nextBox_is_down = False
    nextBox_is_left = False
    nextBox_is_right = False

    # currPoint y, x
    # BOXES ARE y1, y2, x1, x2




    if currPoint[0] >= nextBox[1]: # next box is above currPoint
        nextBox_is_up = True
    if currPoint[0] <= nextBox[0]: # next box is below currPoint
        nextBox_is_down = True
    if currPoint[1] >= nextBox[3]: # next box is to the left of currPoint
        nextBox_is_left = True
    if currPoint[1] <= nextBox[2]: # next box is to the right of currPoint
        nextBox_is_right = True


    # print('----------------------------')
    # print("CURR POINT: ", currPoint)
    # print("NEXT BOX: ", nextBox)
    # print("is up: ", nextBox_is_up)
    # print("is down: ", nextBox_is_down)
    # print("is left: ", nextBox_is_left)
    # print("is right: ", nextBox_is_right)

    if nextBox_is_up and nextBox_is_left:
        # print("----------FUUUUUUUCK-------------")
        # print("CURR POINT: ", currPoint)
        # print("NEXT BOX: ", nextBox)
        # print("---------------------------------")
        tarPoint = (nextBox[1], nextBox[3])
    elif nextBox_is_up and nextBox_is_right:
        tarPoint = (nextBox[1], nextBox[2])
    elif nextBox_is_up and nextBox_is_right == False and nextBox_is_left == False:
        tarPoint = (nextBox[1], currPoint[1])

    if nextBox_is_down and nextBox_is_left:
        tarPoint = (nextBox[0], nextBox[3])
    elif nextBox_is_down and nextBox_is_right:
        tarPoint = (nextBox[0], nextBox[2])
    elif nextBox_is_down and nextBox_is_right == False and nextBox_is_left == False:
        tarPoint = (nextBox[0], currPoint[1])

    if nextBox_is_left and nextBox_is_up:
        tarPoint = (nextBox[1], nextBox[3])
    elif nextBox_is_left and nextBox_is_down:
        tarPoint = (nextBox[0], nextBox[3])
    elif nextBox_is_left and nextBox_is_up == False and nextBox_is_down == False:
        tarPoint = (currPoint[0], nextBox[3])

    if nextBox_is_right and nextBox_is_up:
        tarPoint = (nextBox[1], nextBox[2])
    elif nextBox_is_right and nextBox_is_down:
        tarPoint = (nextBox[0], nextBox[2])
    elif nextBox_is_right and nextBox_is_up == False and nextBox_is_down == False:
        tarPoint = (currPoint[0], nextBox[2])
    
    # tempX = tarPoint[1]
    # tempY = tarPoint[0]
    # tarPoint = (tempX, tempY)

    return tarPoint
    
def get_detail_points(boxes, detail_points, path, startingBox, endingBox, starting_point, ending_point):
    for box in boxes:
        if boxes[box] == None:
            # currPoint = get_target_point(detail_points[box], box)
            # path.append((detail_points[box], currPoint))
            path.append((detail_points[box], ending_point))
            break

        if box == startingBox:
            detail_points[box] = starting_point
            detail_points[boxes[box]] = get_target_point(detail_points[box], boxes[box])
            continue
            # path.append((starting_point, currPoint))
        else:
            currPoint = detail_points[box]
        detail_points[boxes[box]] = get_target_point(currPoint, boxes[box])
        print('appending:' )
        print(currPoint)
        print(detail_points[boxes[box]])
        path.append((currPoint, detail_points[boxes[box]]))


def find_path (source_point, destination_point, mesh):

    """
    Searches for a path from source_point to destination_point through the mesh

    Args:
        source_point: starting point of the pathfinder
        destination_point: the ultimate goal the pathfinder must reach
        mesh: pathway constraints the path adheres to

    Returns:

        A path (list of points) from source_point to destination_point if exists
        A list of boxes explored by the algorithm
    """
    print(source_point)
    print(destination_point)

    came_from = {}

    startBox = None
    destBox = None

    startFound = False
    destFound = False

    for box in mesh['boxes']:
        if box[0] <= source_point[0] and source_point[0] <= box[1] and box[2] <= source_point[1] and source_point[1] <= box[3]:
                
            startBox = box
            print("START FOUND: ", box)
            startFound = True
            came_from[box] = None

        if box[0] <= destination_point[0] and destination_point[0] <= box[1] and box[2] <= destination_point[1] and destination_point[1] <= box[3]:
            print("DESTINATION FOUND: ", box)
            destFound = True
            destBox = box
            
        if startFound and destFound:
            break

    path = []
    boxes = {}
    forward_came_from = {}
    backward_came_from = {}
    forward_came_from[startBox] = None
    backward_came_from[destBox] = None
    queue = []
    if startFound and destFound:
        heappush(queue, (0, startBox, 'destination'))
        heappush(queue, (0, destBox, 'source'))
    # distances = {}
    # distances[startBox] = 0
    forward_distance = {}
    forward_distance[startBox] = 0
    backward_distance = {}
    backward_distance[destBox] = 0
    detail_points = {}
    twoBoxes = False

    while queue and startFound and destFound:
        current_dist, current, current_goal = heappop(queue)

        if startBox == destBox:
            path.append((source_point, destination_point))
            break

        point = None

        if current == startBox and current_goal == 'destination':
            point = source_point
        elif current == destBox and current_goal == 'source':
            point = destination_point
        elif current_goal == 'destination':
            point = detail_points[forward_came_from[current]]
        elif current_goal == 'source':
            point = detail_points[backward_came_from[current]]

        for next in mesh['adj'][current]:
            target_point = get_target_point(point, next)
            total_dist = calculate_dist(point, target_point) + current_dist
            

            if current_goal == 'destination':
                if next not in forward_distance or total_dist < forward_distance[next]:
                    detail_points[current] = target_point
                    forward_distance[next] = total_dist
                    priority = total_dist + heuristic(point, destination_point)
                    forward_came_from[next] = current
                    heappush(queue, (priority, next, current_goal))
                    if next == destBox:
                        twoBoxes = True
                
            elif current_goal == 'source':
                if next not in backward_distance or total_dist < backward_distance[next]:
                    detail_points[current] = target_point
                    backward_distance[next] = total_dist
                    priority = total_dist + heuristic(point, source_point)
                    backward_came_from[next] = current
                    heappush(queue, (priority, next, current_goal))

        if twoBoxes == True:
            # print('two boxes')
            path.append((source_point, get_target_point(source_point, destBox)))
            path.append((get_target_point(source_point, destBox), destination_point))
            break

                
        if current in forward_distance and current in backward_distance:
            # if (current_goal == 'destination' and backward_came_from[current] is not None) or (current_goal == 'source' and forward_came_from[current] is not None):
            # detail_points[current] = get_target_point(point, current)
            tempStart = current
            forwardTempPoint = get_target_point(detail_points[forward_came_from[tempStart]], tempStart)
            backTempPoint = get_target_point(detail_points[backward_came_from[tempStart]], tempStart)
            detail_points.clear()
            while current is not startBox:
                boxes[current] = forward_came_from[current]
                current = forward_came_from[current]
            boxes[startBox] = None
            detail_points[tempStart] = forwardTempPoint
            # print('in if statement')
            # print(boxes)
            get_detail_points(boxes, detail_points, path, tempStart, startBox, forwardTempPoint, source_point)
            
            boxes.clear()
            current = tempStart
            detail_points.clear()
            while current != destBox:
                boxes[current] = backward_came_from[current]
                current = backward_came_from[current]
            boxes[destBox] = None
            get_detail_points(boxes, detail_points, path, tempStart, destBox, backTempPoint, destination_point)
            

            # path.append((forwardTempPoint, backTempPoint))
            
            break
                
                
                
        
        # #TODO IF TIME: Exit the moment user clicks on dark line
    
    if len(queue) == 0 or startFound == False or destFound == False:
         print('path not found')

    """
        # What we need:


            - A helper funciton to calculate distance from point to distanation:
            def calculate_dist(pointA, pointB):
                sqrt((pointB.x - pointA.x)^2 + (pointB.y- pointA.y)^2)
                

            - A dict that keeps tracck of distance and points
                distances = {key: point (x,y), value: distance so far}

            - A Dijkstra's Algo that uses the distance as priority 
              which according to word doc: "Instead of using the new distance 
              (distance to u plus length of edge u--v) as the priority for insertion, augment 
              this with (add to it) an estimate of the distance remaining."
    """
    
    # at the end

    print("STARTING POINT: ", source_point)
    print('DESTINATION POINT: ', destination_point)

    print("DETAIL POINTS: ", len(detail_points))
    print(detail_points)
    print("BOXES: ", len(boxes))
    print(boxes)
    print("PATH: ", len(path))
    print(path)
    
    # print(boxes)

    # 


    return path, boxes.keys()

