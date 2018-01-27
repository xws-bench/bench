#!/usr/bin/env bash

JUGGLERFILE="http://lists.starwarsclubhouse.com/api/v1/tournaments"
JUGGLERFOLDER="http://lists.starwarsclubhouse.com/api/v1/tournament/"
DTS=$( date --rfc-3339=seconds )

# Pull branch so that git doesn't complain and force a merge
git pull origin gh-pages
GITRETURN=$?

if [ ! ${GITRETURN} -eq 0 ];
then
	echo "ERROR: git pull failed!  State may be bad!  Check git status!"
	# Don't error out, but be prepared for failure later.
fi

# Move old tournaments file to tournaments.old
if [ -e tournaments ];
then
	echo "Moving old 'tournaments' to 'tournaments.old'..."
	mv -f tournaments tournaments.old
else
	echo "ERROR: 'tournaments' file not found!"
	exit 1
fi

# Grab new tournament data
if [ ! -e tournaments ];
then
	echo "Downloading new 'tournaments' file..."
	wget ${JUGGLERFILE} -O "tournaments"
else
	echo "ERROR: new 'tournaments' would overwrite old file; aborting!"
	exit 2
fi

# Run python diff script
if [ -e tournaments ];
then
	echo "Downloading new tournament list data..."
	for FILE in `./diff_tournaments.py "tournaments.old" "tournaments"`; do
		wget ${JUGGLERFOLDER}${FILE} -O ${FILE}
	done
else
	echo "ERROR: Could not find new 'tournaments' file!"
	exit 3
fi

# Add, commit, push new files to origin:gh-pages.  REQUIRES SSH KEYS SET UP AND TESTED!
git add .

GITRETURN=$?

if [ ! ${GITRETURN} -eq 0 ];
then
	echo "ERROR: git add failed!  Check git status!"
	exit ${GITRETURN}
fi

GITCOMMITMESSAGE=`git commit -m "Automatic Tournament Update Commit ${DTS}"`
GITRETURN=$?

# commit returns a '1' if it fails, *or* if it doesn't need to do any work because everything's up to date
if [ ! ${GITRETURN} -eq 0 ];
then
	if [[ ! ${GITCOMMITMESSAGE} = *"nothing to commit, working directory clean"* ]];
	then
		echo "ERROR: git commmit failed!  Check git status!"
		exit ${GITRETURN}
	fi
fi

git push origin gh-pages
GITRETURN=$?
if [ ! ${GITRETURN} -eq 0 ];
then
	echo "ERROR: git push failed!  Check git status!"
	exit ${GITRETURN}
fi

exit 0
