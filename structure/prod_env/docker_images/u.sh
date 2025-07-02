# do
# docker login
# before all followind scripts

docker tag postgres:14.4 personal-finance-db:0.0.1
docker push personal-finance-db:0.0.1

docker tag personal_finance_prod-backend personal-finance-service:0.0.1
docker push personal-finance-service:0.0.1