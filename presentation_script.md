# Recycla — Presentation Script (Slides 6–13)

**Total time: ~9 minutes**
**Speakers:**
- **Mahmoud** — Hardware (bin structure, wiring, components, GPIO)
- **Zivan** — Software (Pi control code, system flowchart, class diagram)
- **Bassam** — Machine Learning (training pipeline, results, augmentation)

---

## Slide 6 — Hardware Architecture
**Speaker: Mahmoud**
**Time: ~1.5 min**

This is the full hardware layout of our system. The Raspberry Pi 4 is the central controller — everything connects back to it.

For sensing, we're using an HC-SR04 ultrasonic sensor on GPIO pins 23 and 24. It continuously polls the distance in front of the bin, and when something comes within 30 centimeters, it triggers the rest of the pipeline.

For imaging, we went with the Arducam 8MP V2.3 camera. It uses the Sony IMX219 sensor, same as the official Pi Camera Module, so it connects directly through the CSI ribbon cable with no extra drivers needed.

For actuation, we have two SG90 servo motors — one on GPIO 17 for the recycling lid and one on GPIO 22 for the trash lid. Both are mounted at the back of the bin and move in the same direction. We run them at 50Hz PWM — duty cycle of 10 to open, 3 to close, with an 0.8-second movement time per cycle.

One thing we learned early is that the Pi can't supply enough current for both servos at once, so we run them off a separate 5V power supply. The grounds are tied together so the PWM signals still work.

---

## Slide 7 — ML Training Pipeline
**Speaker: Bassam**
**Time: ~1.5 min**

For the machine learning side, all training was done on Google Colab with a GPU runtime. We used MobileNetV2 as our base model — it's a convolutional neural network pre-trained on ImageNet, which is about 1.2 million images across a thousand categories. We froze those base layers and only trained the classification head on our own dataset. This approach is called transfer learning, and it let us get strong accuracy without needing a massive dataset.

We have six material classes: glass, metal, paper, plastic, cardboard, and trash. One problem we hit early was glossy paper getting confused with plastic — both look shiny under certain lighting. To address this, we applied aggressive data augmentation during training. We used rotation up to 30 degrees, brightness ranging from 0.6 to 1.4, channel shifting of 30 to simulate different color temperatures, plus shear and zoom. This forced the model to focus on actual material texture and shape rather than just surface reflectivity.

We trained with the Adam optimizer at a learning rate of 1e-4, with early stopping set to a patience of 5 epochs and a learning rate reducer on plateau. After training, the model was exported as a Keras file and transferred to the Pi.

---

## Slide 8 — Raspberry Pi Control System
**Speaker: Zivan**
**Time: ~1.5 min**

This slide shows the main control script that runs on the Pi — it's a Python file called smart_bin.py, and it's what ties all the hardware and the model together into one working system.

The script runs an infinite loop. Every 0.2 seconds it reads the ultrasonic sensor. When the distance drops below 30 centimeters, the system knows someone is presenting an item. At that point it captures a single frame from the camera at 640 by 480, resizes it down to 224 by 224 pixels, normalizes the values to a zero-to-one range, and passes it to the TensorFlow model.

The model returns a predicted label and a confidence score. If the label is one of our recyclable classes — glass, metal, paper, plastic, or cardboard — and the confidence is above 65 percent, the recycle servo opens. Otherwise, the trash servo opens. We default to trash on low confidence intentionally — contaminating the recycling stream is worse than losing one recyclable item.

After the lid opens, it holds for two seconds to give the user time to drop the item in, then closes. There's another two-second cooldown before the system starts polling again so it doesn't immediately retrigger on the same object.

---

## Slide 9 — System Flowchart
**Speaker: Zivan**
**Time: ~1 min**

This UML activity diagram maps out every possible path through the system. Starting from the top: the Pi powers on, initializes GPIO, starts the camera, and loads the model. Then it enters the main loop.

Each cycle it measures distance. If nothing is within 30 centimeters, it sleeps for 200 milliseconds and loops back. If something is detected, it captures an image and runs classification. Then there's a two-stage decision — first, is the confidence above 65 percent? If not, it goes straight to the trash bin. If yes, it checks whether the material is recyclable. Recyclable items open the recycle servo, everything else opens trash.

After either path, the system waits two seconds with the lid open, closes the servos, runs a two-second cooldown, and loops back to distance measurement. Every edge case is accounted for here.

---

## Slide 10 — Class Diagram
**Speaker: Zivan**
**Time: ~45 sec**

This is the class diagram for smart_bin.py. The SmartBinController sits at the center and connects to five components. UltrasonicSensor handles distance readings using GPIO 23 and 24. PiCamera manages frame capture at 640 by 480 in RGB888 format. WasteClassifier wraps the Keras model and the class index JSON file — it takes an image and returns a label and confidence score. Then RecycleServo and TrashServo each control one PWM channel for their respective bin lids.

Each class in this diagram maps directly to a block of code in the script, so this is essentially a blueprint of how the software is structured.

---

## Slide 11 — Training Results
**Speaker: Bassam**
**Time: ~1 min**

These are the actual results from our training run. The accuracy and loss curves on the left show that both training and validation metrics converge smoothly — the validation curve tracks closely with training, which means we're not overfitting.

Early stopping kicked in before epoch 30 because the validation loss plateaued, so the model saved its best weights automatically.

The confusion matrix on the right shows exactly where the model makes mistakes. Most misclassifications happen between cardboard and paper, which makes sense — they share a lot of visual properties like color and texture. The glossy paper issue I mentioned earlier was significantly reduced after we added the brightness and channel shift augmentation. Overall, the model performs reliably across all six classes.

---

## Slide 12 — Reflection & Conclusions
**Speaker: Mahmoud**
**Time: ~1 min**

Looking back at this project, the biggest takeaway for all of us was that integration is where the real challenge lives. The servo code works on its own, the model works on its own, the camera works on its own — but getting all three running together on one Pi with limited memory and processing power required a lot of testing and iteration.

One specific challenge on the hardware side was getting the servo timing right. Small changes like adjusting the duty cycle range or adding a cooldown between detections made a noticeable difference in how reliable the system felt in practice.

From a team perspective, Zivan's work on the software integration was what brought the Pi side to life. Bassam's model training and data augmentation work solved our accuracy problems. And on my end, building the physical bin and wiring everything together taught me a lot about how embedded systems actually come together in the real world.

The biggest lesson: test early, test often. Every time we delayed testing, we found issues that would have been simple to fix if we'd caught them sooner.

---

## Slide 13 — Resources
**Speaker: Mahmoud**
**Time: ~30 sec**

This is a full list of everything we used. On the hardware side: Raspberry Pi 4, Arducam 8MP camera, HC-SR04 ultrasonic sensor, two SG90 servos, a 5V power supply, breadboard and jumper wires.

For Pi software: Python 3, TensorFlow, RPi.GPIO, gpiozero, and picamera2. For training: Google Colab, MobileNetV2, Keras, scikit-learn, and Matplotlib.

For the website and docs: HTML, CSS, JavaScript, PlantUML for our UML diagrams, and GitHub for version control. Our private repo is at github.com/robie1337/Recycla.

---

## Speaker Summary

| Slide | Topic | Speaker | Time |
|-------|-------|---------|------|
| 6 | Hardware Architecture | **Mahmoud** | ~1.5 min |
| 7 | ML Training Pipeline | **Bassam** | ~1.5 min |
| 8 | Pi Control System | **Zivan** | ~1.5 min |
| 9 | System Flowchart | **Zivan** | ~1 min |
| 10 | Class Diagram | **Zivan** | ~45 sec |
| 11 | Training Results | **Bassam** | ~1 min |
| 12 | Reflection & Conclusions | **Mahmoud** | ~1 min |
| 13 | Resources | **Mahmoud** | ~30 sec |

| Speaker | Total Time | Slides |
|---------|-----------|--------|
| **Mahmoud** (Hardware) | ~3 min | 6, 12, 13 |
| **Zivan** (Software) | ~3.25 min | 8, 9, 10 |
| **Bassam** (ML) | ~2.5 min | 7, 11 |

**Total: ~9 minutes**
