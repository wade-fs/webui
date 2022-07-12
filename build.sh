#!/bin/bash
V="$(npm i)"
if [[ $V =~ ^(.*Run )(.*)( to update.*)$ ]]; 
then 
  sudo ${BASH_REMATCH[2]}
fi
npm run linux-build -- --env.api=/api --env.ws=/ws --env.production=true
cp -a assets q8server/www/
