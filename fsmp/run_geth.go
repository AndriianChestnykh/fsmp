// run_geth
package main

import (
	"log"
	"os/exec"
	"strconv"
	"sync"
)

func runGeth(gethOptions *GethRuntimeOptions, wg *sync.WaitGroup) error {

	//gethParameters := []string{"--testnet", "--light", "--rpc", "--rpccorsdomain", "*",
	//	"--rpcapi", "db,eth,net,web3,personal,accounts", "--rpcaddr", "127.0.0.1", "--rpcport", "8545"}

	cmd := exec.Command(gethOptions.ExecPath,
		gethOptions.Network,
		gethOptions.FastOption,
		gethOptions.RpcEnabled,
		"--rpcapi", gethOptions.RpcApi,
		"--rpcaddr", gethOptions.RpcAddr,
		"--rpcport", strconv.Itoa(gethOptions.RpcPort),
		"--rpccorsdomain", gethOptions.RpcCorsDomain)

	log.Print("Starting Geth with command: ", cmd.Args)

	err := cmd.Start()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Geth started...")

	err = cmd.Wait()
	log.Printf("Geth: Command finished with error: %v", err.Error())
	wg.Done()
	return err
}
