// run_webserver
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"sync"

	"github.com/gorilla/mux"
)

func runWebserver(webDir string, webPort int, wg *sync.WaitGroup) error {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/syncthingoptions", getSyncthingOptions)
	router.PathPrefix("/").Handler(http.FileServer(http.Dir(webDir)))

	log.Println("Web server listen and serve at address: " + webUIOptions.webAddr + ":" + strconv.Itoa(webPort))
	err := http.ListenAndServe(":"+strconv.Itoa(webPort), router)
	log.Printf("Web server: Command finished with error: %v", err)
	wg.Done()
	return err
}

func getSyncthingOptions(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(syncthingOptions)
}
