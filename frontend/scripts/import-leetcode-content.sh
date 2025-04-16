#!/bin/bash

FRONTEND_DIR=$(dirname "$(realpath "$0")")/..

## == Copy leetcode repo ==
cd "$FRONTEND_DIR/public/content/leetcode"
git clone --depth 1 --no-hardlinks https://github.com/john-mayou/leetcode temp
rsync -a --remove-source-files --exclude='.git' temp/ . # make sure we avoid git
find . -maxdepth 1 -type f -exec rm -f {} + # remove all files (keep dirs)
rm -rf temp

## == Fix relative urls to be relative to /public ==
find . -name 'README.md' | while read -r file; do
  dir=$(dirname "$file" | sed 's|^\./||') # strip leading ./ for clean URL
  perl -i -pe "s|!\[(.*)\]\((?!http)(.*)\)|![\1](/public/content/leetcode/${dir}/\2)|g" "$file"
done