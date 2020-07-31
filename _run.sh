#!/bin/bash

function todo(){
  str="$1"
  echo
  echo -n "  "
  echo -en "\033[48;2;255;0;0m"
  echo -en "\033[38;2;0;0;0m"
  echo -en "\033[1m"
  echo -n "TODO:"
  echo -en "\033[0m"
  echo -n " "
  echo "$1"
  echo
}

todo "page num., english of tech. reports"

bundle exec jekyll serve -H 0.0.0.0
