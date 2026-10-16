#!/bin/bash
# Downloads Fraunces 700 (optical size 144) as TTF from Google Fonts; used only to extract logo outlines.
set -e
UA="Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0"
css=$(curl -sL -A "$UA" "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@144,700&display=swap")
url=$(echo "$css" | grep -o "https://fonts.gstatic.com[^)]*" | head -1)
echo "fraunces -> $url"
curl -sL -A "$UA" "$url" -o fraunces.ttf
ls -la fraunces.ttf
