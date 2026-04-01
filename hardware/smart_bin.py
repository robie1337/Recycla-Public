import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TF_NUM_INTRAOP_THREADS"] = "1"
os.environ["TF_NUM_INTEROP_THREADS"] = "1"

import time
import json
import numpy as np
from PIL import Image
import tensorflow as tf
import RPi.GPIO as GPIO

from gpiozero import DistanceSensor
from picamera2 import Picamera2

# =========================
# SETTINGS
# =========================
MODEL_PATH = "waste_classifier_V6.keras"
CLASS_MAP_PATH = "class_indices_v5.json"

TRIG_PIN = 23
ECHO_PIN = 24
THRESHOLD_CM = 30

IMG_SIZE = (224, 224)

RECYCLE_LEFT = 17
RECYCLE_RIGHT = 22

# Change these if your servos move wrong
OPEN_DUTY = 10
CLOSE_DUTY = 3

# Classes that should open recycle lid
RECYCLABLE_CLASSES = ["glass", "metal", "paper", "plastic"]

# SERVO SETUP
GPIO.setmode(GPIO.BCM)

GPIO.setup(RECYCLE_LEFT, GPIO.OUT)
GPIO.setup(RECYCLE_RIGHT, GPIO.OUT)

pwm_left = GPIO.PWM(RECYCLE_LEFT, 50)
pwm_right = GPIO.PWM(RECYCLE_RIGHT, 50)

pwm_left.start(0)
pwm_right.start(0)

# HELPER FUNCTIONS
def open_recycle_servos():
    pwm_left.ChangeDutyCycle(OPEN_DUTY)
    time.sleep(0.8)
    pwm_left.ChangeDutyCycle(0)

def close_recycle_servos():
    pwm_left.ChangeDutyCycle(CLOSE_DUTY)
    time.sleep(0.8)
    pwm_left.ChangeDutyCycle(0)

def open_trash_servos():
    pwm_right.ChangeDutyCycle(OPEN_DUTY)
    time.sleep(0.8)
    pwm_right.ChangeDutyCycle(0)

def close_trash_servos():
    pwm_right.ChangeDutyCycle(CLOSE_DUTY)
    time.sleep(0.8)
    pwm_right.ChangeDutyCycle(0)

def classify_image():
    frame = camera.capture_array()

    img = Image.fromarray(frame).resize(IMG_SIZE)
    img_array = np.expand_dims(np.array(img, dtype=np.float32) / 255.0, axis=0)

    predictions = model(img_array, training=False).numpy()[0]
    idx = int(np.argmax(predictions))
    confidence = float(predictions[idx])
    label = idx_to_class[idx]

    return label, confidence

# STARTUP
print("Starting program...", flush=True)

# Ultrasonic sensor
sensor = DistanceSensor(echo=ECHO_PIN, trigger=TRIG_PIN)
print("Sensor ready", flush=True)

# Camera
camera = Picamera2()
camera.configure(
    camera.create_still_configuration(
        main={"size": (640, 480), "format": "RGB888"}
    )
)
camera.start()
time.sleep(1)
print("Camera ready", flush=True)

# Model
print("Loading model...", flush=True)
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded", flush=True)

# Class map
with open(CLASS_MAP_PATH) as f:
    class_indices = json.load(f)

idx_to_class = {v: k for k, v in class_indices.items()}
print("Class map loaded", flush=True)
print("Classes:", idx_to_class, flush=True)

print("Entering main loop...", flush=True)

# MAIN LOOP
try:
    while True:
        distance = sensor.distance * 100
        print(f"Distance: {distance:.1f} cm", flush=True)

        if distance < THRESHOLD_CM:
            print("Object detected", flush=True)

            label, confidence = classify_image()
            print(f"Prediction: {label} ({confidence*100:.1f}%)", flush=True)

            if label in RECYCLABLE_CLASSES and confidence*100 > 65:
                print("Opening recycle lid", flush=True)
                open_recycle_servos()
                time.sleep(2)
                close_recycle_servos()
            else:
                print("Not recyclable - open trash can", flush=True)
                open_trash_servos()
                time.sleep(2)
                close_trash_servos()

            # cooldown so it doesn't trigger again instantly
            time.sleep(2)

        time.sleep(0.2)

except KeyboardInterrupt:
    print("Stopping...", flush=True)

finally:
    pwm_left.stop()
    pwm_right.stop()
    GPIO.cleanup()
    camera.stop()
    print("Cleaned up", flush=True)
