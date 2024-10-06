import numpy as np
import pandas as pd
from flask import Flask
import pickle
from flask_socketio import SocketIO, emit
import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import random
import json

import argparse
from time import sleep
import belay

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn import metrics
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix, classification_report
from imblearn.over_sampling import SMOTE 

app = FastAPI()

def train():
    data = pd.read_csv("data/posture.csv")
    Y = data['posture'].values
    X = data[['x', 'y', 'z', 'flex']].values

    scaler = StandardScaler()
    X = scaler.fit_transform(X)
    
    smote = SMOTE(random_state=42)
    X_resampled, Y_resampled = smote.fit_resample(X, Y)
    
    X_train, X_test, y_train, y_test = train_test_split(X_resampled, Y_resampled, test_size=0.2, random_state=109)
    
    parameters = {
        'n_estimators': [50, 100, 200],  
        'max_depth': [5, 10, 20],  
        'class_weight': ['balanced', None]  
    }
    
    clf = GridSearchCV(RandomForestClassifier(random_state=42), parameters, cv=5)
    clf.fit(X_train, y_train)
    
    with open('model.pkl', 'wb') as f:
        pickle.dump(clf, f)
    
    y_pred = clf.predict(X_test)
    print("Random Forest Accuracy:", metrics.accuracy_score(y_test, y_pred))
    cm = metrics.confusion_matrix(y_test, y_pred)
    print("Confusion Matrix:\n", cm)


def predict(input):
    with open('model.pkl', 'rb') as f:
        clf = pickle.load(f)

    input_reshaped = np.array(input).reshape(1, -1)
    prediction = clf.predict(input_reshaped)
    return prediction

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        # result = random.choice([0, 1]) 
        arr = collect_data()
        result = str(predict(arr)[0])
        print(arr, result)
        data = {"data": result}        
        await websocket.send_text(json.dumps(data)) 
        await asyncio.sleep(1)

parser = argparse.ArgumentParser()
parser.add_argument("--port", "-p", default="/dev/tty.usbmodem2101")
args = parser.parse_args()
device = belay.Device(args.port)

@device.setup
def setup():
    from machine import Pin, ADC
    import MPU6050

    # Set up the I2C interface
    i2c = machine.I2C(1, sda=machine.Pin(14), scl=machine.Pin(15))

    # Set up the MPU6050 (accelerometer) class 
    mpu = MPU6050.MPU6050(i2c)
    mpu.wake()

    resistor_pin = 28 # GPIO pin for variable resistor 
    flex = ADC(Pin(resistor_pin)) # Initialize ADC pin for "flex" sensor

    sample_frequency = 10 

@device.task
def collect_data():
    flex_value = flex.read_u16()
    accel = mpu.read_accel_data()
    data = [
        1000*accel[0],
        1000*accel[1],
        1000*accel[2],
        flex_value/100
    ]
    sleep(1/sample_frequency)
    return data

if __name__ == '__main__':
    # train()()
    # print(predict([130,-987,140,2.5]))
    setup()  
    uvicorn.run(app, host="0.0.0.0", port=8080)
    # while True:
    #     arr = collect_data()
    #     print(arr, predict(arr))


