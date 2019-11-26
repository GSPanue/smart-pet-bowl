#! /usr/bin/python2

import time
import sys
import RPi.GPIO as GPIO
from hx711 import HX711
from database import Database
import shortuuid

class Scale:
  def __init__(self, device_id, dt, sck, calibration_factor = None):
    self.db = Database()
    self.hx = HX711(dt, sck)
    self.device_id = device_id
    self.calibration_factor = 1

    if calibration_factor is not None:
      self.calibration_factor = calibration_factor

  def set_db(self, db):
    self.db = db

  def get_db(self):
    return self.db

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
    db = self.get_db()

    return db.get("Devices", {
      "id": self.get_device_id()
    })["account_id"] != "null"

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

  # Start the scale
  def start(self):
    try:
      # Check if device has been bound to an account
      print("Checking if device has been bound to an account...")
      has_bound_device = self.has_bound_device()

      while not has_bound_device:
        print("Device has not been bound to an account.")
        print("Checking again in 60 seconds...")

        time.sleep(60)

        has_bound_device = self.has_bound_device()

      print("Preparing scales. Do not add weight to the scale...")
      self.configure_hx()

      print("Preparation complete.")
      raw_input("Add weight to the scale and press `Enter` to continue...")

      while True:
        weight = self.get_weight()

        # Print weight in grams
        print("Weight: " + str(weight) + "g")

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
