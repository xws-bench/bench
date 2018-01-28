#!/usr/bin/env python

import json
import sys

def diffFiles(old, new):
    """Find the file names that are new between new and old versions of two
    files."""

    old_tournament_data = None
    new_tournament_data = None

    with open(old, 'r') as o:
         old_tournament_data = json.load(o)

    with open(new, 'r') as n:
        new_tournament_data = json.load(n)

    old_set = set(old_tournament_data['tournaments'])

    new_set = set(new_tournament_data['tournaments'])

    for i in (new_set - old_set):
        print(i)

if __name__ == "__main__":

    if ( len(sys.argv) != 3 ):
        print("%s: invoke with \"%s file1 file2\"" % (sys.argv[0], \
            sys.argv[0]))
        sys.exit(1)
    else:
        diffFiles(sys.argv[1], sys.argv[2])
        sys.exit(0)
