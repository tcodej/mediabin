#!/bin/bash

# pi server -> local
rsync -e ssh --rsync-path="sudo rsync" -rpt --delete --progress trentj@192.168.1.200:/home/trentj/web/library-server/mediabin/files/covers /home/trentj/web/personal/library-server/mediabin/files
