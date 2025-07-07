echo " "
echo "########################################"
echo "######### BUILD PROJECT /bash/ #########"
echo "########################################"
echo " "

mkdir database-prod

docker compose up -d

echo "Premi INVIO per chiudere..."
read