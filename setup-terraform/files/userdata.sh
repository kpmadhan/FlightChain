#!/usr/bin/env bash
echo 'Initating Setup'
sudo yum update -y
echo 'Installing Dependencies'
sudo yum groupinstall "Development Tools" -y
sudo yum install git docker gcc gcc-c++ make openssl-devel curl -y

mkdir /apps
chown root:root /apps
chmod +777 -R /apps
cd /apps/
service docker start
curl -sSL http://bit.ly/2ysbOFE | bash -s 1.2.0 1.2.0 0.4.10

sudo curl -L "https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sed -i 's/bin/bin:\/apps\/fabric-samples\/bin:\/usr\/local\/bin/' ~/.bash_profile 
source ~/.bash_profile


echo 'Installing Node Server'
cd /tmp
wget https://nodejs.org/download/release/v8.9.4/node-v8.9.4.tar.gz
tar -xvf node-v8.9.4.tar.gz && rm -rf node-v8.9.4.tar.gz 
cd node-v8.9.4/
./configure

make
make install
sudo ln -s /usr/local/bin/node /usr/bin/node
sudo ln -s /usr/local/lib/node /usr/lib/node
sudo ln -s /usr/local/bin/npm /usr/bin/npm

npm install nodemon -g
npm install -g node-gyp


echo 'Setting up fabric environment'
cd /apps/
mkdir fabric
cd fabric
git clone https://github.com/hyperledger/fabric-samples.git
cd fabric-samples/
./scripts/bootstrap.sh
cd ../../
mkdir flightchain && cd flightchain
git clone https://github.com/kpmadhan/FlightChain.git
cd FlightChain/chaincode
cd ../flight-chain-api
sudo npm install

cd ../chaincode/
sudo npm install
./deployChainCode.sh -v 1.0 -n flightchain

#cd ../sita-basic-network/
#cp docker-compose-template.yml docker-compose.yml
cd ../flight-chain-api
./setupUsers.sh
node bootstrap/enrollAdmin.js && node bootstrap/registerUser.js  BA


