#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Parse ICD-10 XML codes into a sane JSON format.
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
from collections import defaultdict
import json
import sys
import os
import xmltodict
import re

in_xml = sys.argv[1]
assert(os.path.isfile(in_xml))



# Exclude from search keywords
BORING_WORDS = ['and', 'or', 'of', 'for', 'on', 'the', 'due', 'to', 'in', 'not', 'as', 'with', 'without', 'disease']

# Make lowercase, remove special characters, filter boring words.
def non_boring_words(in_desc):
    clean_desc = re.sub('[^A-Za-z0-9\s]+', '', in_desc)
    each_word = clean_desc.split()
    long_words = [w for w in each_word if len(w) > 1]  # Ignore single characters.
    lower_case = [l.lower() for l in long_words]
    good_words = [str(w) for w in lower_case if w not in BORING_WORDS]
    return good_words


# Scope to 'chapters' which contain big 'section's of 'diag's and individual codes
huge_xml_dict = xmltodict.parse(open(in_xml),
                                dict_constructor=lambda *args, **kwargs: defaultdict(list, *args, **kwargs))['ICD10CM.tabular'][0]['chapter']


parents = []
children = {}

# parents list contains dicts of:
# {'k': [keywords from children], 'c': A00, m: ['A00.01', 'A00.03'...], d:"Description", i: [keywords from inclusion terms]}

# children is a dict of:
# {'A00.01': "Cholera due to ..."}

# Well, this is a huge hackjob :/ but we only do it ~once.
for item in huge_xml_dict:
    for entry in item['section']:
        if 'diag' in entry:
            # Some rare entries are just stub <sections>
            for line in entry['diag']:
                # These are our parent diagnosis entries
                working_parent = {'c': line['name'][0], 'd': line['desc'], 'm': []}
                keywords = set()
                [keywords.add(word) for word in non_boring_words(line['desc'][0])]
                inclusion_keywords = set()

                # Some codes, e.g. "Nosocomial condition" don't have nested diags.
                if 'diag' in line:
                    for subline in line['diag']:
                        [keywords.add(word) for word in non_boring_words(subline['desc'][0])]
                        children[subline['name'][0]] = {'d': subline['desc'][0], 'i': []}
                        working_parent['m'].append(subline['name'][0])
                        try:
                            for entry in subline['inclusionTerm'][0]['note']:
                                [inclusion_keywords.add(word) for word in non_boring_words(entry)]
                                children[subline['name'][0]]['i'].append(entry)
                        except IndexError:
                            pass  # No inclusion terms

                        # This should really be a recursive parsing, but ... hackjob!
                        # DUPLICATE CODE (from above) -- HACKJOB
                        if 'diag' in subline:
                            for entry in subline['diag']:
                                # Entry is a dict with keys:
                                #  name
                                #  desc
                                #  inclusionTerm[0]['note'] <- optional
                                [keywords.add(word) for word in non_boring_words(entry['desc'][0])]
                                children[entry['name'][0]] = {'d': entry['desc'][0], 'i': []}  # I am suspicious of this line.
                                working_parent['m'].append(entry['name'][0])
                                try:
                                    for incl_entry in entry['inclusionTerm'][0]['note']:
                                        [inclusion_keywords.add(word) for word in non_boring_words(incl_entry)]
                                        children[entry['name'][0]]['i'].append(incl_entry)
                                except IndexError:
                                    pass  # No inclusion terms

                                # OK, this is truly the final depth. Holy crap why did I not recursively...whatever.
                                if 'diag' in entry:
                                    for nested_entry in entry['diag']:
                                        [keywords.add(word) for word in non_boring_words(nested_entry['desc'][0])]
                                        children[nested_entry['name'][0]] = {'d': nested_entry['desc'][0], 'i': []}  # I am suspicious of this line.
                                        working_parent['m'].append(nested_entry['name'][0])
                                        try:
                                            for incl_entry in nested_entry['inclusionTerm'][0]['note']:
                                                [inclusion_keywords.add(word) for word in non_boring_words(incl_entry)]
                                                children[nested_entry['name'][0]]['i'].append(incl_entry)
                                        except IndexError:
                                            pass  # No inclusion terms


                working_parent['k'] = ' '.join(keywords)
                working_parent['i'] = ' '.join(inclusion_keywords)
                parents.append(working_parent)


print(json.dumps(parents), file=open('diagnosis_parents.json', 'wb'))
print(json.dumps(children, sort_keys=True), file=open('diagnosis_children.json', 'wb'))
