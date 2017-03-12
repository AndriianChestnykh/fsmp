// run_geth
package main

import (
	"fmt"
	"log"
	"os/exec"
	"sync"
)

func runGeth(execPath string, execParameters []string, wg *sync.WaitGroup) error {
	cmd := exec.Command(execPath, execParameters...)
	fmt.Print("Starting Geth with command: ")
	for i := range cmd.Args {
		fmt.Print(cmd.Args[i] + " ")
	}
	fmt.Println()

	err := cmd.Start()
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Geth started...")

	err = cmd.Wait()
	log.Printf("Geth: Command finished with error: %v", err)
	wg.Done()
	return err
}
