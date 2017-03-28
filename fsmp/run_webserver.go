// run_webserver
package main

import (
	"log"
	"net/http"
	"strconv"
	"sync"
)

func runWebserver(webDir string, webPort int, wg *sync.WaitGroup) error {
	http.Handle("/", http.FileServer(http.Dir(webDir)))
	log.Println("Web server listen and serve at address http://localhost:" + strconv.Itoa(webPort))
	err := http.ListenAndServe(":"+strconv.Itoa(webPort), nil)
	log.Printf("Web server: Command finished with error: %v", err)
	wg.Done()
	return err
}
