#!/bin/sh
echo ************************************
echo Starting the replica Set
echo ************************************

sleep 10 | echo Sleeping 10

mongo mongodb://mongo-rs0-1:27010 mongoSetup.js

sleep 5 | echo Sleeping 5

mongo --port 27010 --host `mongo mongo-rs0-1:27010 --quiet --eval "db.isMaster()['primary']"` dbSetup.js
