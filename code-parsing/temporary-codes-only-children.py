#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Parse ICD-10 TSV codes into a sane JSON format.
#
#
# Copyright (c) ClinDesk, Inc.
# Author: 2014 Nick Semenkovich <semenko@alum.mit.edu>.
#   https://nick.semenkovich.com/
#
# This software is released under the MIT License:
#  <http://www.opensource.org/licenses/mit-license.php>
#

from __future__ import absolute_import, division, print_function, unicode_literals
import csv
import json
import sys
import os

in_tsv = sys.argv[1]
assert(os.path.isfile(in_tsv))

parents = {}
children = {}

crappy_list_for_hackjob = []

with open(in_tsv,'rb') as tsvin:
    tsvin = csv.reader(tsvin, delimiter=str('\t'))
    list_of_children = []
    for row in tsvin:
        if row[2] == "1":
            if len(row[4]) > len(row[3]): # long vs short desc
                crappy_list_for_hackjob.append({'c': row[1], 'd': row[4]})
            else:
                crappy_list_for_hackjob.append({'c': row[1], 'd': row[3]})

print(json.dumps(crappy_list_for_hackjob))
