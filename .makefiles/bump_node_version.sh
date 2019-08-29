#!/bin/bash

cur_ver=$(cat package.json | grep '"version":' |  awk '{print $2}' | sed 's/"//g' | sed 's/,//g')
new_ver=$(cat version)
ver_pattern="\"version\": \"$cur_ver\"" # strict match to avoid accidently change dependency version
ver_replacement="\"version\": \"$new_ver\""
cat package.json | sed "s/$ver_pattern/$ver_replacement/g" > package.json.tmp
mv package.json.tmp package.json
