#!/bin/bash
# 用來模擬新增的 terminal, 指定 q8server ip
# usage: sendNewTerm.sh IP COUNT
# usage: sendNewTerm.sh IP MAC1 [MAC2] ...
IP=$1; shift
COUNT=$1; shift
[ -z "${IP}" ] && IP=localhost
[ -z "${COUNT}" ] && COUNT=1

Modes=("AP-3400A" "AP-3500" "AP-3500-H01" "ARP-2917AP" "ARP-2919AP" "ARP-2921AP" "B01_Series" "BoxPC138G" "BoxPC138H" "E01_Series" "G01_Series" "H01_Series" "Microbox-7824A-B01" "Microbox-7824B-B01")

function Mac(){ cat /dev/urandom | tr -dc '0-9A-F' | fold -w ${1:-12} | head -n 1; }
function Model() {
	Idx=$(shuf -i 0-13 -n 1)
	echo ${Modes[${Idx}]}
}
function Send(){
	ip=$1; shift
	mac=$1; shift
	model=$1; shift
	curl -s -X POST -d "" http://${ip}:8088/api-q8c/create/${mac}/Arista/${model} -H 'Content-Type: application/json' -o /dev/null
}

# 目前支援兩種格式，一個是 COUNT, 一個是 MAC...
if [ ${#COUNT} -ge 12 ]; then
	mac=${COUNT}
	while [ -n "${mac}" ]; do
		Send ${IP} ${mac} $(Model)
		mac=$1; shift
	done
else
	while [ $COUNT -gt 0 ]; do
		Send ${IP} $(Mac) $(Model)
		COUNT=$(( COUNT - 1 ))
	done
fi
