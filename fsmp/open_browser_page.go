// open_browser_page
package main

import (
	"os/exec"
	"runtime"
	"strconv"
)

// open opens the specified URL in the default browser of the user.
func openBrowser(address string, port int) error {
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "windows":
		cmd = "cmd"
		args = []string{"/c", "start"}
	case "darwin":
		cmd = "open"
	default: // "linux", "freebsd", "openbsd", "netbsd"
		cmd = "xdg-open"
	}

	url := address + ":" + strconv.Itoa(port)
	args = append(args, url)
	return exec.Command(cmd, args...).Start()
}
