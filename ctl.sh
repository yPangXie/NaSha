#!/bin/sh

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

# Get latest data from github
pull() {
    git pull
}

# Start application
start() {
    nohup node --harmony ./NaSha/app.js 2&>./logs/NaSha.log & echo $! > pid

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
start)
    pull
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