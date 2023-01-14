#!/bin/bash

[ "$(ls -A package-lock.json)" ] && echo "node_modules installed" || npm i

# npx prisma generate

npm run start
