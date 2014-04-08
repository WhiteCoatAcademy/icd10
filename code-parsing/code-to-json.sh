#!/bin/bash
#
# Hackishly convert ICD-10 codes to a sane JSON format.
#
# It was ... unwise to write this in bash. :/
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
PARENT_JSON=${1%.*}".parents.json"
echo -e "\tParent JSON output: ${PARENT_JSON}"

echo -ne "{\n\tcode: [\"" > ${PARENT_JSON}
awk -F $'\t' 'BEGIN{ORS="\",\"";}{if($3 == 0) print $2}' ${TSVOUTPUT} | rev | cut -c 3- | rev >> ${PARENT_JSON}

# Short description
echo -ne "],\n\tdesc: [\"" >> ${PARENT_JSON}
awk -F $'\t' 'BEGIN{ORS="\",\"";}{if($3 == 0) print $4}' ${TSVOUTPUT} | rev | cut -c 3- | rev >> ${PARENT_JSON}

# Long description
echo -ne "],\n\tlongdesc: [\"" >> ${PARENT_JSON}
awk -F $'\t' 'BEGIN{ORS="\",\"";}{if (!$5 && $3 == 0) print ""; else if($3 == 0) print $5}' ${TSVOUTPUT} | rev | cut -c 3- | rev >> ${PARENT_JSON}

echo -ne "]\n}" >> ${PARENT_JSON}


#### Generate children
CHILD_JSON=${1%.*}".children.json"
echo -e "\tChild JSON output: ${CHILD_JSON}"

echo -ne "{\n\tcode: [\"" > ${CHILD_JSON}
awk -F $'\t' 'BEGIN{ORS="\",\"";}{if($3 == 1) print $2}' ${TSVOUTPUT} | rev | cut -c 3- | rev >> ${CHILD_JSON}

# Short description
echo -ne "],\n\tdesc: [\"" >> ${CHILD_JSON}
awk -F $'\t' 'BEGIN{ORS="\",\"";}{if($3 == 1) print $4}' ${TSVOUTPUT} | rev | cut -c 3- | rev >> ${CHILD_JSON}

# Long description
echo -ne "],\n\tlongdesc: [\"" >> ${CHILD_JSON}
awk -F $'\t' 'BEGIN{ORS="\",\"";}{if (!$5 && $3 == 1) print ""; else if($3 == 1) print $5}' ${TSVOUTPUT} | rev | cut -c 3- | rev >> ${CHILD_JSON}

echo -ne "]\n}" >> ${CHILD_JSON}


#### Generate parent->child mapping
MAP_JSON=${1%.*}".mapping.json"
echo -e "\tMapping JSON output: ${MAP_JSON}"

echo -ne "{\n" > ${MAP_JSON}

cut -f 2,3 ${TSVOUTPUT} | awk -F $'\t' 'BEGIN{ORS="";ctr=2;ap=""}{ if ($2 == 1){ ap=ap"\""$1"\",";} else if ($2 == 0){ print "\""$1"\":["ap"],"; ap=""}}' >> ${MAP_JSON}

echo -ne "}" >> ${MAP_JSON}
