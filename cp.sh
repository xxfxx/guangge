#!/bin/bash
if [[ -d output ]];then
    echo "rm output"
    rm -rf output
fi
dirs=$(ls -l | grep '^d' | awk '{print $NF}')
for dir in ${dirs}
do
    mkdir -p output
    cp -rf ${dir} ./output/
done
