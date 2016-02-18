#!/bin/bash

cd /app/samf-webservice/src
rm -f mongo_uri.json
touch mongo_uri.json
echo "{ \"mongo_uri\": \""$MONGO_URI"\" }" > mongo_uri.json
export TZ='Asia/Bangkok'
npm start