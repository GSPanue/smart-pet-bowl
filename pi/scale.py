#! /usr/bin/python2

import time
import sys
import RPi.GPIO as GPIO
from hx711 import HX711

class Scale:
  def __init__(self, dt, sck, calibration_factor = None):
    self.dt = dt
    self.sck = sck
    self.calibration_factor = 1

    if calibration_factor is not None:
      self.calibration_factor = calibration_factor

  def set_dt(self, dt):
    self.dt = dt

  def get_dt(self):
    return self.dt

  def set_sck(self, sck):
    self.sck = sck

  def get_sck(self):
    return self.sck

  def set_calibration_factor(self, calibration_factor):
    self.calibration_factor = calibration_factor

  def get_calibration_factor(self):
    return self.calibration_factor

  def start(self):
    try:
      print("Preparing scales. Do not add weight to the scale...")
      hx = HX711(self.get_dt(), self.get_sck())

      hx.set_reading_format("MSB", "MSB")
      hx.set_reference_unit(self.get_calibration_factor())
      hx.reset()
      hx.tare()

      print("Preparation complete.")
      raw_input("Add weight to the scale and press `Enter` to continue...")

      while True:
        val = max(0, int(hx.get_weight(5)))
        print("Weight: " + str(val) + "g")

        hx.power_down()
        hx.power_up()

        time.sleep(0.1)

    except (KeyboardInterrupt, SystemExit):
      self.stop()

  # Clean up used ports
  def clean(self):
    print("Cleaning used ports...")
    GPIO.cleanup()

  # Stop the program
  def stop(self):
    self.clean()

    print("Stopping program...")
    sys.exit()
