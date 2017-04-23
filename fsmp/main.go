package main

import (
	"errors"
	"flag"
	"log"
	"os"
	"runtime"
	"sync"
)

type GethRuntimeOptions struct {
	ExecPath      string
	Network       string
	FastOption    string
	NetworkMode   string
	RpcEnabled    string
	RpcAddr       string
	RpcPort       int
	RpcApi        string
	RpcCorsDomain string
}

var gethOptions GethRuntimeOptions

type SynctingRuntimeOptions struct {
	ExecPath   string
	GuiAddress string
	GuiApiKey  string
}

var syncthingOptions SynctingRuntimeOptions

type WebUIRuntimeOptions struct {
	webDir     string
	webAddr    string
	webPort    int
	webBrowser bool
}

var webUIOptions WebUIRuntimeOptions
var gethVersionFolder string
var syncthingVersionFolder string

func init() {

	syncthingExecPath, gethExecPath, err := getExecPathes("0.14.26", "1.6.0-facc47cb")
	if err != nil {
		log.Fatalln("Error getting executable pathes: ", err.Error())
		return
	}

	gethOptions = GethRuntimeOptions{
		ExecPath:      gethExecPath,
		Network:       "--testnet",
		FastOption:    "--fast",
		RpcEnabled:    "--rpc",
		RpcAddr:       "127.0.0.1",
		RpcPort:       8545,
		RpcApi:        "db,eth,net,web3,personal,accounts",
		RpcCorsDomain: "*",
	}

	flag.StringVar(&gethOptions.ExecPath, "geth-execpath", gethOptions.ExecPath, "Geth executable file path")
	flag.StringVar(&gethOptions.RpcAddr, "geth-rpcaddr", gethOptions.RpcAddr, "Geth RPC address")
	flag.IntVar(&gethOptions.RpcPort, "geth-rpcport", gethOptions.RpcPort, "Geth RPC port")
	flag.StringVar(&gethOptions.RpcApi, "geth-rpcapi", gethOptions.RpcApi, "Geth RPC API")
	flag.StringVar(&gethOptions.RpcCorsDomain, "geth-rpccorsdomain", gethOptions.RpcCorsDomain, "Geth RPC API")

	apikey, _ := readSyncthingApiKey()

	syncthingOptions = SynctingRuntimeOptions{
		ExecPath:   syncthingExecPath,
		GuiAddress: "http://127.0.0.1:8384",
		GuiApiKey:  apikey,
	}

	flag.StringVar(&syncthingOptions.ExecPath, "syncthing-execpath", syncthingOptions.ExecPath, "Syncthing exec path")
	flag.StringVar(&syncthingOptions.GuiAddress, "syncthing-gui-address", syncthingOptions.GuiAddress, "Syncthing gui address")

	webUIOptions = WebUIRuntimeOptions{
		webDir:     "../Web UI",
		webAddr:    "http://127.0.0.1",
		webPort:    8080,
		webBrowser: true,
	}

	flag.StringVar(&webUIOptions.webDir, "webdir", webUIOptions.webDir, "FSMP web directory path")
	flag.StringVar(&webUIOptions.webAddr, "webaddr", webUIOptions.webAddr, "FSMP web server address")
	flag.IntVar(&webUIOptions.webPort, "webport", webUIOptions.webPort, "FSMP web server port")
	flag.BoolVar(&webUIOptions.webBrowser, "webbrowser", webUIOptions.webBrowser, "FSMP web browser start")
}

func main() {
	flag.Parse()

	wg := &sync.WaitGroup{}
	wg.Add(3)

	go runGeth(&gethOptions, wg)
	go runSyncthing(syncthingOptions.ExecPath, syncthingOptions.GuiAddress, wg)
	go runWebserver(webUIOptions.webDir, webUIOptions.webPort, wg)

	if webUIOptions.webBrowser {
		openBrowser(webUIOptions.webAddr, webUIOptions.webPort)
	}

	wg.Wait()
}

func getExecPathes(syncthingVersion string, gethVersion string) (string, string, error) {
	var syncthingWindowsFolder string = "syncthing-windows-amd64-v" + syncthingVersion
	var syncthingMacosxFolder = "syncthing-macosx-amd64-v" + syncthingVersion
	var syncthingLinuxFolder = "syncthing-linux-amd64-v" + syncthingVersion

	var gethWindowsFolder = "geth-windows-amd64-" + gethVersion
	var gethMacosxFolder = "geth-darwin-amd64-" + gethVersion
	var gethLinuxFolder = "geth-linux-amd64-" + gethVersion

	var syncthingExecPath string
	var gethExecPath string

	switch runtime.GOOS {
	case "windows":
		syncthingExecPath = "Syncthing/" + syncthingWindowsFolder + "/syncthing.exe"
		gethExecPath = "Geth/" + gethWindowsFolder + "/geth.exe"
	case "darwin":
		syncthingExecPath = "Syncthing/" + syncthingMacosxFolder + "/syncthing"
		gethExecPath = "Geth/" + gethMacosxFolder + "/geth"
	default: // "linux", "freebsd", "openbsd", "netbsd"
		syncthingExecPath = "Syncthing/" + syncthingLinuxFolder + "/syncthing"
		gethExecPath = "Geth/" + gethLinuxFolder + "/geth"
	}

	if _, err := os.Stat(syncthingExecPath); os.IsNotExist(err) {
		return "", "", errors.New("Syncthing exec path does not exists: " + syncthingExecPath)
	}
	if _, err := os.Stat(gethExecPath); os.IsNotExist(err) {
		return "", "", errors.New("Geth exec path does not exists: " + gethExecPath)
	}
	return syncthingExecPath, gethExecPath, nil
}
