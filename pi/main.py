#! /usr/bin/python2

from scale import Scale

# Set Device ID, DT, SCK, and calibration factor respectively
scale = Scale("d2axeD4FLhGnqvw8UPwwdV", 5, 6, 358)

# Start the scale
scale.start()
