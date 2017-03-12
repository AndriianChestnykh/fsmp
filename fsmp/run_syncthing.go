// run_syncthing
package main

import (
	"log"
	"os/exec"
	"sync"
)

func runSyncthing(execPath string, wg *sync.WaitGroup) error {

	cmd := exec.Command(execPath)
	err := cmd.Start()
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("Syncthing started...")
	err = cmd.Wait()
	log.Printf("Syncthing: Command finished with error: %v", err)
	wg.Done()
	return err
}
