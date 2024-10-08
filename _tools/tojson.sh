#!/bin/bash

#if [ $# -lt 1 ]; then
#    echo "Usage: $0 <arg>"
#    exit 1
#fi

jp=1
cat authors.txt | while read line; do
  if [ -z "$line" ]; then
    jp=0
    continue
  fi

  ch=$(echo $line | cut -c1)
  if [ "$ch" == "#" ]; then
    continue
  fi

  str1=$(echo $line | cut -d" " -f1)
  str2=$(echo $line | cut -d" " -f2)

  if [ $jp -eq 1 ]; then
    echo "      - {first: '"$str2"', family: '"$str1"'}"
  else
    echo "      - {first: '"$str1"', family: '"$str2"'}"
  fi
done

