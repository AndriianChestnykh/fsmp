# Before start test:

You need Docker (https://www.docker.com/) and Docker Compose (https://docs.docker.com/compose/)

## Start & test

```bash
git clone https://github.com/AndriianChestnykh/fsmp

cd 'fsmp/Smart Contracts/test'

docker-compose build

docker-compose up

```

When test finished processing in folder logs/ you will have file result.txt

## Extract csv from log

```bash
grep '>>>CSV' logs/result.txt | cut -c8- > logs/report.csv
```
