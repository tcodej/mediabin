#!/bin/bash

rsync -e ssh --rsync-path="sudo rsync" -rpt --delete --progress /home/trentj/web/personal/library-server/mediabin/files/covers trentj@192.168.1.200:/home/trentj/web/library-server/mediabin/files
