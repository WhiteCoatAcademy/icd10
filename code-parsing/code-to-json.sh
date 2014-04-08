#!/bin/bash
#
# Hackishly convert ICD-10 codes to a sane JSON format.
#
# Copyright (c) ClinDesk, Inc.
# Author: 2014 Nick Semenkovich <semenko@alum.mit.edu>.
#   https://nick.semenkovich.com/
#

if [ -z "$1" ]
  then
    echo "Usage: $0 filename.gz"
    exit 1
fi

# Convert from positional encoding to TSV for easier parsing.
# Spacing defined in ICD10OrderFiles.pdf

TSVOUTPUT=${1%.*}".tsv"
echo "Temporary TSV output: ${TSVOUTPUT}"

zcat < $1  | awk '{print substr($0,0,5),"\t",substr($0,7,7),"\t",substr($0,15,1),"\t",substr($0,17,60),"\t",substr($0,78)}' | sed -e "s/  */ /g" | {gsub(/[[:space:]]\t[[:space:]]/,"\t");print} > ${TSVOUTPUT}


# Pack selected components into three compressed JSON datastructures:
# 
# "Header" (parent) codes, not valid for HIPAA-covered transactions
# {
#  code: ["A123", "B123"],
#  desc: ["Something", "Something Else"],
#  longdesc: ["Longer something", "Even longer something"]
# }
#
# Child codes, valid for submission for HIPAA-covered transactions
#
#  ** Same as parent structure above. **
#
#
# Mapping, from parent to child
#
# {
#  parents: ["A123", "B123"],
#  children: [["A111", "A222"], ["B111", "B222"]]
# }


#### Generate parents
PARENT_JSON=${1%.*}".parent.json"
echo -e "\tParent JSON output: ${PARENT_JSON}"

echo -ne "{\n\tcode: [\"" > ${PARENT_JSON}
cut -f 2,3,4,5 ${TSVOUTPUT} | awk -F $'\t' 'BEGIN{ORS="\",\"";}{if($2 == 0) print $1}' | rev | cut -c 3- | rev >> ${PARENT_JSON}

# Short description
echo -ne "],\n\tdesc: [\"" >> ${PARENT_JSON}
cut -f 2,3,4,5 ${TSVOUTPUT} | awk -F $'\t' 'BEGIN{ORS="\",\"";}{if($2 == 0) print $3}' | rev | cut -c 3- | rev >> ${PARENT_JSON}

# Long description
echo -ne "],\n\tlongdesc: [\"" >> ${PARENT_JSON}
cut -f 2,3,4,5 ${TSVOUTPUT} | awk -F $'\t' 'BEGIN{ORS="\",\"";}{if($2 == 0) print $4}' | rev | cut -c 3- | rev >> ${PARENT_JSON}

echo -ne "]\n}" >> ${PARENT_JSON}


#### Generate children



