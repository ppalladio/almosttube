#!/bin/bash

while true; do
  echo "[SSH Tunnel] Starting connection..."
  ssh -i ~/.ssh/id_rpi -p 1022 -R 9091:localhost:3000 yuxuan@192.168.1.179 \
      -o ServerAliveInterval=30 \
      -o StrictHostKeyChecking=no

  echo "[SSH Tunnel] Disconnected. Reconnecting in 5 seconds..."
  sleep 5
done
