#!/bin/bash

# pi server -> local
rsync -e ssh -e 'ssh -p 2022' -rptn --delete --progress trentj@192.168.1.136:/home/trentj/web/personal/library-server/mediabin/files/covers /home/trentj/web/personal/library-server/mediabin/files
