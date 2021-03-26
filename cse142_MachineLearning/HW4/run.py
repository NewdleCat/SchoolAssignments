import numpy as np

# This will be the code you will start with, note that the formate of the function 
# run (train_dir,test_dir,pred_file) and saving method can not be changed
# Feel free to change anything in the code

def run (train_input_dir,train_label_dir,test_input_dir,pred_file):
    # Reading data
    test_data = np.loadtxt(test_input_dir,skiprows=0)
    trainingData = np.loadtxt(train_input_dir,skiprows=0)
    trainingLabel = np.loadtxt(train_label_dir,skiprows=0)

    N0 = trainingData[trainingLabel == 0]
    N1 = trainingData[trainingLabel == 1]
    N2 = trainingData[trainingLabel == 2]

    centroid0 = calculateCentroid(N0)
    centroid1 = calculateCentroid(N1)
    centroid2 = calculateCentroid(N2)


    w01 = calculateFunction(centroid0, centroid1)
    w02 = calculateFunction(centroid0, centroid2)
    w12 = calculateFunction(centroid1, centroid2)
    print("Discriminant01: ", w01)
    print("Discriminant02: ", w02)
    print("Discriminant12: ", w12)


    [num,_] = test_data.shape

    prediction = np.zeros((num, 1), dtype=np.int16)

    for i in range(0,len(test_data)):
        point = test_data[i]
        if useFunction(point, w01) >= 0:
            if useFunction(point, w02) >= -0.1:
                prediction[i][0] = 0
            else:
                prediction[i][0] = 2
        else:
            if useFunction(point, w12) >= -0.3:
                prediction[i][0] = 1
            else:
                prediction[i][0] = 2




    # # Saving you prediction to pred_file directory (Saving can't be changed)
    np.savetxt(pred_file, prediction, fmt='%1d', delimiter=",")

def useFunction(point, w):
    return (w[0]*point[0]) + (w[1]*point[1]) + (w[2]*point[2]) - w[3]

def calculateCentroid(points):
    x,y,z = 0, 0, 0
    for p in points:
        x += p[0]
        y += p[1]
        z += p[2]

    x = x/len(points)
    y = y/len(points)
    z = z/len(points)

    return [x, y, z]

def calculateFunction(p1, p2):
    vec = normalize(sub(p1, p2))
    d = add(p1, p2)
    d = divide(d, 2)
    d = (vec[0]*d[0]) + (vec[1]*d[1]) + (vec[2]*d[2])
    vec.append(d)
    return vec


# v1 - v2
def sub(v1, v2):
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]]

# v1 + v2
def add(v1, v2):
    return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]]

def divide(v, s):
    return [v[0]/s, v[1]/s, v[2]/s]

def magnitude(v):
    return (v[0]**2 + v[1]**2 + v[2]**2)**0.5

def normalize(v):
    mag = magnitude(v)
    return [v[0]/mag, v[1]/mag, v[2]/mag]

def dot(v1, v2):
    return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2]

if __name__ == "__main__":
    train_input_dir = 'training1.txt'
    train_label_dir = 'training1_label.txt'
    test_input_dir = 'testing1.txt'
    pred_file = 'result'
    run(train_input_dir,train_label_dir,test_input_dir,pred_file)
