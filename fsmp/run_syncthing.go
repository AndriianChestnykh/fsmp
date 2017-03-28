// run_syncthing
package main

import (
	"log"
	"os/exec"
	"sync"
)

func runSyncthing(execPath string, guiAddress string, wg *sync.WaitGroup) error {
	cmd := exec.Command(execPath, "--gui-address", guiAddress)
	err := cmd.Start()
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Starting syncthing with command: ", cmd.Args)
	log.Println("Syncthing started...")
	err = cmd.Wait()
	log.Printf("Syncthing: Command finished with error: %v", err)
	wg.Done()
	return err
}
