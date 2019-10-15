#!/bin/bash

payloadPath=$1
steamgiftsToken=$2

payload=$(cat "$payloadPath")
permalink=$(echo $payload | perl -ne 'print $1 if /(https:\/\/www\.steamgifts\.com\/go\/comment\/[A-Za-z0-9]+)/s')

if [ -n "$permalink" ]; then
  response=$(curl -L --url "$permalink" --cookie "PHPSESSID=$steamgiftsToken" --user-agent "Mozilla/5.0 (X11; Linux x86_64; rv:71.0) Gecko/20100101 Firefox/71.0")
  url=$(echo $response | perl -ne 'print $1 if /baseUrl\s=\s"(.+?)"/s' | sed -e 's/\\//g')
  xsrfToken=$(echo $response | perl -ne 'print $1 if /xsrf_token=([A-Za-z0-9]+)/s')
  id=$(echo $permalink | perl -ne 'print $1 if /\/go\/comment\/([A-Za-z0-9]+)/s')
  match=$(echo $response | perl -ne 'print $1 if /(data-comment-id(?:(?!data-comment-id).)*?id=\"'$id'\")/s')
  commentId=$(echo $match | perl -ne 'print $1 if /data-comment-id=\"([A-Za-z0-9]+?)"/s')
  issueNumber=$(echo $payload | perl -ne 'print $1 if /"number":\s(\d+)/s')
  echo $permalink
  echo $commentId
  echo $issueNumber
  response=$(curl -L --url "https://www.steamgifts.com$url" --cookie "PHPSESSID=$steamgiftsToken" --user-agent "Mozilla/5.0 (X11; Linux x86_64; rv:71.0) Gecko/20100101 Firefox/71.0" --header "Content-Type: application/x-www-form-urlencoded" --data "xsrf_token=$xsrfToken&do=comment_new&parent_id=$commentId&description=Beep%20bop!%20ESGST%20bot%20here%20to%20let%20you%20know%20that%20your%20report%20%2F%20suggestion%20is%20being%20looked%20into.%20For%20reference%2C%20visit%20the%20GitHub%20issue%3A%20%5B%23$issueNumber%5D(https%3A%2F%2Fgithub.com%2Frafaelgssa%2Fesgst%2Fissues%2F$issueNumber)")
fi
