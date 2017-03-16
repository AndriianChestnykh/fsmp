FROM ubuntu

#Setup
RUN apt-get update
RUN apt-get -y install software-properties-common
RUN add-apt-repository -y ppa:ethereum/ethereum
RUN apt-get update
RUN apt-get -y install ethereum
RUN apt-get -y install solc

RUN apt-get -y install libusb-1.0-0-dev

RUN mkdir ~/.ethash
RUN geth makedag 0 ~/.ethash

#Configuration and testing files
COPY CustomGensis.json CustomGensis.json
COPY common.js common.js
COPY fsmp_test.js fsmp_test.js
COPY fsmp.sol fsmp.sol


#Init
RUN geth --datadir /fsmp --port 30303 --nodiscover --ipcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --rpcapi "db,eth,net,web3" --autodag --networkid 1901 --nat any --preload common.js  init ./CustomGensis.json


#ENTRYPOINT
CMD ["/bin/sh","-c", "geth --datadir /fsmp js fsmp_test.js > /logs/result.txt"]
#ENTRYPOINT ["geth", "--datadir", "/fsmp" , "console"]
