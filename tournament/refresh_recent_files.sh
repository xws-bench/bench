#!/usr/bin/env bash

JUGGLERFOLDER="http://lists.starwarsclubhouse.com/api/v1/tournament/"
COUNT=${1:-100}

# Find the 100 most recently added files and refresh them.
for FILE in `find . -maxdepth 1 -type f -regextype sed -regex "./[0-9]\{1,\}" -printf "%T+\t%p\n" | sort -k1 | cut -f 2 | tail -${COUNT}`; 
do 
	# Ideally this would only refresh files if they are newer than the local copy;
	# because list juggler does not have mtime data turned on, in practice this
	# pulls down all of the selected files instead.
	wget -N "${JUGGLERFOLDER}${FILE}"; 
done
