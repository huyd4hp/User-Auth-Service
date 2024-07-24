#!/bin/bash
# Load các biến môi trường từ file .env
MONGO_HOST_PRIMARY=$(grep MONGO_HOST_PRIMARY .env | cut -d '=' -f 2)
MONGO_HOST_SECONDARY_1=$(grep MONGO_HOST_SECONDARY_1 .env | cut -d '=' -f 2)
MONGO_HOST_SECONDARY_2=$(grep MONGO_HOST_SECONDARY_2 .env | cut -d '=' -f 2)
MONGO_USERNAME=$(grep MONGO_USERNAME .env | cut -d '=' -f 2)
MONGO_PASSWORD=$(grep MONGO_PASSWORD .env | cut -d '=' -f 2)

# Setup Replicaset
status=$(docker exec -i mongo.pauth mongosh --eval "rs.status()" --quiet 2>/dev/null)
if [[ -z "$status" ]]; then
  docker exec -i mongo.pauth mongosh --eval "rs.initiate({
    _id: 'rs0',
    members: [
      { _id: 0, host: '${MONGO_HOST_PRIMARY}:27017', priority: 2 },
      { _id: 1, host: '${MONGO_HOST_SECONDARY_1}:27017', priority: 1 },
      { _id: 2, host: '${MONGO_HOST_SECONDARY_2}:27017', priority: 1 }
    ]
  })"
  echo '************************************'
  echo '*    Replica set setup complete    *'
  echo '************************************'

else
  echo '
-------------------------------
Replica set already initialized 
-------------------------------'
fi
# Setup Authenticated
auth=$(docker exec -i mongo.pauth mongosh --eval "$(echo "db.auth('$MONGO_USERNAME', '$MONGO_PASSWORD')" | tr -d ' ')" --quiet 2>/dev/null)
if [[ -z "$auth" ]]; then
  authCommand="$(echo "db.createUser({user: '$MONGO_USERNAME', pwd: '$MONGO_PASSWORD', roles: [{role: 'root', db: 'admin'}]})" | tr -d ' ')" 
  docker exec -i mongo.pauth mongosh --eval "use admin; $authCommand"
fi
echo '
-------------------------------
MONGO_ROOT_USERNAME:  root
MONGO_ROOT_PASSWORD:  rootMongo
-------------------------------'