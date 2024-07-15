#!/bin/bash
# Load các biến môi trường từ file .env
MONGO_HOST_PRIMARY=$(grep MONGO_HOST_PRIMARY .env | cut -d '=' -f 2)
MONGO_HOST_SLAVE_1=$(grep MONGO_HOST_SLAVE_1 .env | cut -d '=' -f 2)
MONGO_HOST_SLAVE_2=$(grep MONGO_HOST_SLAVE_2 .env | cut -d '=' -f 2)
MONGO_USERNAME=$(grep MONGO_USERNAME .env | cut -d '=' -f 2)
MONGO_PASSWORD=$(grep MONGO_PASSWORD .env | cut -d '=' -f 2)
# Cấu hình Replicaset
docker exec -i AuthDB-Master mongosh << EOF
rs.initiate({
  _id: 'rs0',
  members: [
    { _id: 0, host: '${MONGO_HOST_PRIMARY}:27017' },
    { _id: 1, host: '${MONGO_HOST_SLAVE_1}:27017' },
    { _id: 2, host: '${MONGO_HOST_SLAVE_2}:27017' }
  ]
})
EOF 
Setup Username-Password
docker exec -i AuthDB-Master mongosh << EOF
use admin;
db..createUser({
    user: '${MONGO_USERNAME}',
    pwd: '${MONGO_PASSWORD}',
    roles: [{ role: 'root', db: 'admin' }]
});
EOF






