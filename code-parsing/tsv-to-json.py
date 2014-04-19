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
import re

in_tsv = sys.argv[1]
assert(os.path.isfile(in_tsv))

parents = []
children = {}

# Exclude from search keywords
BORING_WORDS = ['and', 'or', 'of', 'for', 'on', 'the', 'due', 'to', 'in', 'with', 'without', 'disease']

# Make lowercase, remove special characters, filter boring words.
def non_boring_words(in_desc):
    clean_desc = re.sub('[^A-Za-z0-9\s]+', '', in_desc)
    each_word = clean_desc.split()
    long_words = [w for w in each_word if len(w) > 1]  # Ignore single characters.
    lower_case = [l.lower() for l in long_words]
    good_words = [str(w) for w in lower_case if w not in BORING_WORDS]
    return good_words


with open(in_tsv,'rb') as tsvin:
    tsvin = csv.reader(tsvin, delimiter=str('\t'))
    list_of_children = []  # Temporarily hold parent->child mapping
    working_parent = None
    keywords = set()
    for row in tsvin:
        # Search keywords


        # Choose "long" description, if available
        description = row[3]
        if len(row[4]) > len(row[3]):
            description = row[4]

        if row[2] == "0":  # Parent
            if working_parent != None:
                # We have a new parent. Let's add the old one to the array.

                # There are some "super parents" -- ignore them for now.
                # 00110   A18     0       Tuberculosis of other organs
                # 00111   A180    0       Tuberculosis of bones and joints
                if len(list_of_children) > 0:
                    working_parent['k'] = ' '.join(keywords)
                    working_parent['m'] = list_of_children
                    parents.append(working_parent)
                keywords = set()

            working_parent = {'c': row[1], 'd': description}  # Temporary, later added to parents
            [keywords.add(word) for word in non_boring_words(description)]
            list_of_children = []
        elif row[2] == "1":
            [keywords.add(word) for word in non_boring_words(description)]
            # children[row[1]] = {'d': description} # If we want to expand, later
            children[row[1]] = description
            list_of_children.append(row[1])
        else:
            print(row[2])
            assert(False)

    # Messy, but catch the last parent.
    working_parent['k'] = ' '.join(keywords)
    working_parent['m'] = list_of_children
    parents.append(working_parent)


print(json.dumps(parents))
# print(json.dumps(children, sort_keys=True))