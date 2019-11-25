#! /usr/bin/python2

import time
import sys
import RPi.GPIO as GPIO
from hx711 import HX711

class Scale:
  def __init__(self, dt, sck, calibration_factor = None):
    self.hx = HX711(dt, sck)
    self.calibration_factor = 1

    if calibration_factor is not None:
      self.calibration_factor = calibration_factor

  def set_calibration_factor(self, calibration_factor):
    self.calibration_factor = calibration_factor

  def get_calibration_factor(self):
    return self.calibration_factor

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

    print("Stopping program...")
    sys.exit()
