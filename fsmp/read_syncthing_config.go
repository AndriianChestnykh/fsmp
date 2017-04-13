// read_syncthing_config.go
package main

import (
	"encoding/xml"
	"io/ioutil"
	"log"
	"os"
	"runtime"
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
	/*
	   $HOME/.config/syncthing (Unix-like),
	   $HOME/Library/Application Support/Syncthing (Mac),
	   %AppData%/Syncthing (Windows XP)
	   or %LocalAppData%/Syncthing (Windows 7+)
	*/

	var env string
	log.Println("Current OS: " + runtime.GOOS)

	switch runtime.GOOS {
	case "windows":
		env := os.Getenv("LocalAppData")
		env += "/Syncthing/"
	case "darwin":
		env = os.Getenv("HOME")
		env += "/Library/Application Support/Syncthing/"
	default: // "linux", "freebsd", "openbsd", "netbsd"
		env = os.Getenv("HOME")
		env += "/.config/syncthing/"
	}
	log.Print("SYNCTHING environment location " + env)

	dat, err := ioutil.ReadFile(env + "config.xml")
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
