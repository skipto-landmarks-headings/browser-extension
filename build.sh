#!/usr/bin/env bash

GPPFILES=(
  content
  popup
)

# Process extension JS files: output to browser folders

for FNAME in ${GPPFILES[@]}
do
  gpp -DCHROME=1 -o chrome/${FNAME}.js gpp-${FNAME}.js
done

for FNAME in ${GPPFILES[@]}
do
  gpp -DFIREFOX=1 -o firefox/${FNAME}.js gpp-${FNAME}.js
done

# Process manifest.json
# gpp -o chrome/manifest.json manifest.json
# gpp -DFIREFOX=1 -o firefox/manifest.json manifest.json

# Copy shared extension files to browser folders

for FNAME in ./shared/*
do
  cp -p ${FNAME} ./chrome/
  cp -p ${FNAME} ./firefox/
done
