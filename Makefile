TOP := $(shell pwd)
DATE := $(shell date +%Y%m%d)
BRCH := $(shell tools/get_branch.sh)
ifeq ($(BRCH),)
BRCH := $(DATE)
VER := $(shell git rev-parse --short HEAD)
else
VER := $(BRCH)
endif
PUSH_PATH := $(TOP)/../../system/sys/package/$(BRCH)

build:
	@ echo "BRCH=$(BRCH) VER=$(VER) $(shell npm version | grep 'node:')"
#	@ sed -i "s/\"version\": \"\(.*\)-.*/\"version\": \"\1-$(VER)\",/g" package.json
	@ bash build.sh && cp -a assets dist/ && echo "Build Q8WebUI DONE" || echo "Build Q8WebUI Failed!"
	@ rm -rf dist
):

dev:
	@ bash dev.sh

n:
	@ chmod a+x build.sh run.sh
	@ git pull origin Kate/new_api | grep 'Already up to date' || make build

run:
	@ bash run.sh

clean:
	@ rm -rf dist q8server node_modules
	@ npm i


push:
	@ echo Overriding $(PUSH_PATH)/www.tar.xz ...
	@ tar -C q8server -cJf $(PUSH_PATH)/www.tar.xz www

160:
	rm -rf ../../dist-160/www && cp -a q8server/www ../../dist-160/
	echo "git commit -m '$(date +%Y%m%d%H%M%S)'"
	cd ../../dist-160 && git add . && git commit -m "$(shell date +%Y%m%d%H%M%S)" && git push
