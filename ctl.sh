#!/bin/sh
BASE="/root"
ROOT="$BASE/NaSha"
LOG="$BASE/logs/NaSha.log"
AGENTX_LOG="$BASE/agentx_log"
NODE_PATH=`cat $BASE/.nodepath`

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
    nohup $NODE_PATH/node --harmony-async-await $ROOT/app.js 2&>${LOG} & echo $! > pid

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

agentxRestart() {
    cd $ROOT
    export ENABLE_NODE_LOG=YES
    export NODE_LOG_DIR=/root/alinode-logs
    nohup agentx /root/agentx-config.json 2&>${AGENTX_LOG} &

    echo "Restart agentx finished."
}

# Router for different operation
case $1 in
redeploy)
    stop
    pull
    update_package
    start
    agentxRestart
    ;;
deploy)
    pull
    update_package
    start
    agentxRestart
    ;;
start)
    start
    agentxRestart
    ;;
restart)
    stop
    start
    agentxRestart
    ;;
stop)
    stop
    ;;
esac
