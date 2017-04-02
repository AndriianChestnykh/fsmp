// read_syncthing_config.go
package main

import (
	"encoding/xml"
	"io/ioutil"
	"log"
	"os"
)

type Configuration struct {
	XMLName xml.Name `xml:"configuration"`
	Gui     GuiNode  `xml:"gui"`
}

type GuiNode struct {
	Address string `xml:"address"`
	Apikey  string `xml:"apikey"`
	Theme   string `xml:"theme"`
}

func readSyncthingApiKey() (string, error) {
	env := os.Getenv("LocalAppData")
	dat, err := ioutil.ReadFile(env + "/Syncthing/config.xml")
	if err != nil {
		log.Print("Error: Could not read Syncthing config file")
		return "", err
	}

	conf := Configuration{}

	err = xml.Unmarshal(dat, &conf)
	if err != nil {
		log.Print("Error: Could not get any apikey from Syncting config")
		return "", err
	}
	return conf.Gui.Apikey, nil
}
