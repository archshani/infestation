#!/bin/bash

# Set Tweego binary path and format directory
TWEEGO_EXE="./bin/tweego"
export TWEEGO_PATH="./bin"

# Build command: output to index.html, include all source directories
$TWEEGO_EXE -o index.html src/story/ src/scripts/ src/styles/

if [ $? -eq 0 ]; then
  echo "Build successful: index.html has been generated."
else
  echo "Build failed."
  exit 1
fi
