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

with open(in_tsv,'rb') as tsvin:
    tsvin = csv.reader(tsvin, delimiter=str('\t'))
    list_of_children = []
    for row in tsvin:
        if row[2] == "0":
            parents[row[1]] = [row[3], row[4], list_of_children]
            list_of_children = []
        elif row[2] == "1":
            children[row[1]] = [row[3], row[4]]
            list_of_children.append(row[1])
        else:
            print(row[2])
            assert(False)

print(json.dumps(parents, sort_keys=True))
#print(json.dumps(children, sort_keys=True))