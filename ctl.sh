#!/bin/sh
BASE="/root"
ROOT="$BASE/NaSha"
LOG="$BASE/logs/NaSha.log"

# Detect pid of the running application
get_pid() {
    if [ ! -f "pid" ]; then
        echo "Application is not running."
        exit 0
    else
        PID=`cat pid`
        echo $PID
    fi
}

# Update npm package
update_package() {
    cd $ROOT
    npm update
}

# Get latest data from github
pull() {
    cd $ROOT
    git pull
}

# Start application
start() {
    cd $BASE
    nohup node --harmony $ROOT/app.js 2&>${LOG} & echo $! > pid

    sleep 2s
    PID=`get_pid`
    if [ ! -n $PID ]; then
        echo "Start applicatin failed, try it again."
    else
        echo "Start application success. PID=$PID"
    fi
}

# Stop application
stop() {
    cd $BASE
    PID=`get_pid`

    if ps -p $PID > /dev/null
    then
        kill -9 $PID
        echo "Application is stopped. PID: $PID"
    else
        echo "Application is not running.."
    fi

}

# Router for different operation
case $1 in
redeploy)
    stop
    pull
    update_package
    start
    ;;
deploy)
    pull
    update_package
    start
    ;;
start)
    start
    ;;
restart)
    stop
    start
    ;;
stop)
    stop
    ;;
esac
