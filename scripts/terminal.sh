#!/bin/bash

_Modes=("AP-3400A" "AP-3500" "AP-3500-H01" "ARP-2917AP" "ARP-2919AP" "ARP-2921AP" "B01_Series" "BoxPC138G" "BoxPC138H" "E01_Series" "G01_Series" "H01_Series" "Microbox-7824A-B01" "Microbox-7824B-B01")

function Mac(){ cat /dev/urandom | tr -dc '0-9A-F' | fold -w ${1:-12} | head -n 1; }
function Model() {
  Idx=$(shuf -i 0-13 -n 1)
  echo ${_Modes[${Idx}]}
}

# PostStatus ${Ip} ${Mac} [${Status}]
# 一般是沒給 status 預設 ACTIVE, 因為 timeout 沒送會變 OFF
# 也可以主動 status == OFF, 如果實際是 active 會暫時變 OFF
function PostStatus(){
  ip=$1; shift
  mac=$1; shift
  status=$1; shift
  [ -z "${status}" ] && status="A"
  curl -s -X POST -d "{\"State\":\"${status}\"}" http://${ip}:8088/api-q8c/status/${mac} -H 'Content-Type: application/json' -o - | grep OK >/dev/null && exit 0
  echo "Could not set status ${status} for ${mac}"
  exit 1
}

# GetTerm ${Ip} ${Mac} $(Model)
# case 1) 已定義，取回目前定義值, UI 該 term 會變 BOOTING(橘)
# case 2) 未定義未出現在雷達: 傳回 replace list
# case 3) 未定義，但是出現在雷達，傳回[]
function GetTerm(){
  ip=$1; shift
  mac=$1; shift
  model=$1; shift
  [ -z "{model}" ] && model=$(Model)
  curl -s http://${ip}:8088/api-q8c/term/${mac}/Arista/${model} -o -
  echo ""
  exit 0
}

# 目前支援兩種格式
#   usage: PostCreate IP COUNT
#   usage: PostCreate IP MAC1 [MAC2] ...
# 沒有 MAC 的 terminal, 會讓 mac 出現在 UI 的雷達
# 已有 MAC 的 terminal, 會讓它變橘燈，會 timeout 變 OFF(黑)
function PostCreate() {
  IP=$1; shift
  COUNT=$1; shift
  [ -z "${IP}" ] && IP=localhost
  [ -z "${COUNT}" ] && COUNT=1

  if [ ${#COUNT} -ge 12 ]; then # 長度>=12 表示 MAC
    mac=${COUNT}
    while [ -n "${mac}" ]; do
      curl -s -X POST -d "" http://${IP}:8088/api-q8c/create/${mac}/Arista/$(Model) -H 'Content-Type: application/json' -o /dev/null
      mac=$1; shift
    done
  else
    while [ $COUNT -gt 0 ]; do
      curl -s -X POST -d '' http://${IP}:8088/api-q8c/create/$(Mac)/Arista/$(Model) -H 'Content-Type: application/json' -o /dev/null
      COUNT=$(( COUNT - 1 ))
    done
  fi
  exit 0
}

# PostReplace IP MAC TID
function PostReplace(){
  ip=$1; shift
  mac=$1; shift
  tid=$1; shift
  [ -z "${tid}" ] && echo "Wrong arguments for PostReplace" && exit 1
  curl -s -X POST -d "{\"Id\":${tid},\"IpAddress\":\"${ip}\",\"MAC\":\"${mac}\",\"SecondaryMAC\":\"${mac}\"}" http://${ip}:8088/api-q8c/replace/${mac} -H 'Content-Type: application/json' -o -
  echo ""
  exit 0
}

function usage(){
  cat <<HELP
Usage:
  $0 -g -I IP -M MAC             # 取得 terminal config
    case 1) 已定義，取回目前定義值, UI 該 term 會變橘
    case 2) 未定義且未出現在雷達: 傳回 replace list
    case 3) 未定義，但是出現在雷達，傳回[]
  $0 -s -I IP -M MAC [-S STATUS] # 設定 terminal status
    status(預設 ACTIVE), terminal 有可能因為 timeout 變 OFF
    status == OFF, 會讓實際是 active 的 terminal 暫時變 OFF
  $0 -c -I IP -C COUNT
    Create Terminal with COUNT of Random mac, 讓該 mac 出現在 UI 的雷達
  $0 -c -I IP -M MAC
    Create Terminal with MAC
  $0 -r -I IP -M MAC -T TID # replace terminal TID with MAC
HELP
  exit 1
}

[ "$#" = "0" -o "$1" = "-h" ] && usage && exit 0

# 分析語法
# $0 -g -I IP -M MAC              # GET Term
# $0 -s -I IP -M MAC [-S STATUS]  # POST Status
# $0 -c -I IP -C COUNT            # POST Create
# $0 -c -I IP -M MAC              # POST Create
# $0 -r -I IP -M MAC -T TID       # POST Replace
while getopts "gscrI:M:C:S:T:" opt; do
  case ${opt} in
  I) IP=${OPTARG};;
  M) MAC=${OPTARG};;
  C) COUNT=${OPTARG};;
  S) STATUS=${OPTARG};;
  T) TID=${OPTARG};;
  g) GETTERM="OK";;
  s) POSTSTATUS="OK";;
  c) POSTCREATE="OK";;
  r) POSTREPLACE="OK";;
  *) echo "undefined opt ${OPTARG} in ${OPTIND}"; usage; exit 1;;
  esac
done

[ -z "${IP}" ] && IP=localhost
[ -n "${GETTERM}" ] && GetTerm ${IP} ${MAC} $(Model) && exit 0
[ -n "${POSTSTATUS}" ] && PostStatus ${IP} ${MAC} ${STATUS} && exit 0
[ -n "${POSTCREATE}" -a -n "${COUNT}" ] && PostCreate ${IP} ${COUNT} && exit 0
[ -n "${POSTCREATE}" -a -n "${MAC}" ] && PostCreate ${IP} ${MAC} && exit 0
[ -n "${POSTREPLACE}" -a -n "${MAC}" -a -n "${TID}" ] && PostReplace ${IP} ${MAC} ${TID} && exit 0
usage
