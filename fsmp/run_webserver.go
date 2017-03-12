// run_webserver
package main

import (
	"log"
	"net/http"
	"sync"
)

func runWebserver(webDir string, webPort string, wg *sync.WaitGroup) error {
	http.Handle("/", http.FileServer(http.Dir(webDir)))
	log.Printf("Web server started...")
	err := http.ListenAndServe(":"+webPort, nil)
	log.Printf("Web server: Command finished with error: %v", err)
	wg.Done()
	return err
}
