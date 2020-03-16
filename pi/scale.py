#! /usr/bin/python2

import time
import sys
import RPi.GPIO as GPIO
from hx711 import HX711
from api import API
import shortuuid

class Scale:
  def __init__(self, device_id, dt, sck, calibration_factor = None):
    self.api = API()
    self.hx = HX711(dt, sck)
    self.device_id = device_id
    self.calibration_factor = 1

    if calibration_factor is not None:
      self.calibration_factor = calibration_factor

  def set_api(self, api):
    self.api = api

  def get_api(self):
    return self.api

  def set_hx(self, hx):
    self.hx = hx

  def get_hx(self):
    return self.hx

  def set_device_id(self, device_id):
    self.device_id = device_id

  def get_device_id(self):
    return self.device_id

  def set_calibration_factor(self, calibration_factor):
    self.calibration_factor = calibration_factor

  def get_calibration_factor(self):
    return self.calibration_factor

  # Check if device has been bound to an account
  def has_bound_device(self):
    api = self.get_api()

    return api.get("device/exists", {
      "q": self.get_device_id()
    }).status_code == 200

  # Get current weight in the form of an integer
  def get_weight(self):
    return max(0, int(self.hx.get_weight(5)))

  # Configure HX711 module
  def configure_hx(self):
    self.hx.set_reading_format("MSB", "MSB")
    self.hx.set_reference_unit(self.get_calibration_factor())
    self.hx.reset()
    self.hx.tare()

  # Restart the HX711 module
  def restart_hx(self):
    self.hx.power_down()
    self.hx.power_up()

  # Store reading in database
  def store_reading(self, weight):
    api = self.get_api()

    api.post("readings/create", {
      "id": shortuuid.uuid(),
      "deviceId": self.get_device_id(),
      "timestamp": int(time.time() * 1000),
      "weight": weight
    })

  # Start the scale
  def start(self):
    print("Preparing scales. Do not add weight to the scale...")
    self.configure_hx()
    print("Preparation complete.")

    try:
      # Check if device has been bound to an account
      print("\nChecking if device has been bound to an account...")
      has_bound_device = self.has_bound_device()

      while not has_bound_device:
        print("Device has not been bound to an account.")
        print("Checking again in 10 seconds...")

        time.sleep(10)

        has_bound_device = self.has_bound_device()

      print("Device has already been bound to an account. Starting scales....\n")

      while True:
        weight = self.get_weight()

        # Store weight
        self.store_reading(weight)

        # Print weight stored in grams
        print("Current Weight: " + str(weight) + "g")

        self.restart_hx()
        time.sleep(0.1)

    except (KeyboardInterrupt, SystemExit):
      self.stop()

  # Clean up used ports
  def clean_up(self):
    print("Cleaning used ports...")
    GPIO.cleanup()

  # Stop the program
  def stop(self):
    self.clean_up()

    print("Stopping the program...")
    sys.exit()
