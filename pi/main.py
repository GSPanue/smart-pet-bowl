#! /usr/bin/python2

from scale import Scale

# Set DT, SCK, and calibration factor respectively
scale = Scale(5, 6, 412)

# Start the scale
scale.start()
