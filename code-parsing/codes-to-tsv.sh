#!/bin/bash
#
# Hackishly convert ICD-10 codes to a more sane TSV format.
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

# Note this **REMOVES** the last field (longdesc) if it's equal to the previous field (shortdesc)
zcat < $1 | tr -d '\015' | awk '{print substr($0,0,5),"\t",substr($0,7,7),"\t",substr($0,15,1),"\t",substr($0,17,60),"\t",substr($0,78)}' | sed -e "s/  */ /g" | awk '{gsub(/[[:space:]]\t[[:space:]]/,"\t");print}' | awk -F $'\t' 'OFS="\t"{if($4 == $5) $5 = ""; print $0}'  > ${TSVOUTPUT}
