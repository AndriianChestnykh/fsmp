package main

import (
	"sync"
)

func main() {
	gethPath := "Geth\\geth.exe"
	gethParameters := []string{"--testnet", "--light", "--rpc", "--rpccorsdomain", "*", "--rpcapi", "db,eth,net,web3,personal,accounts"}
	syncthingExecPath := "Syncthing\\syncthing.exe"
	webDir := "../Web UI"
	webPort := "8080"
	webPath := "http://127.0.0.1:" + webPort

	wg := &sync.WaitGroup{}
	wg.Add(3)

	go runGeth(gethPath, gethParameters, wg)
	go runSyncthing(syncthingExecPath, wg)
	go runWebserver(webDir, webPort, wg)

	openBrowser(webPath)

	wg.Wait()
}
