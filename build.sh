docker stop LoadBalanceAuthService SubAuthService AuthService BackUpAuthService

docker rm LoadBalanceAuthService SubAuthService AuthService BackUpAuthService

docker rmi auth-service

docker build -t auth-service .

docker compose -f nginx.yaml up -d   