pragma solidity ^0.4.2;

contract clienttest {
    string IPAndPort = "Not Set!";
    
    event NewIPAndPort(string);
    
    function getIPAndPort() constant returns(string){
        return IPAndPort;
    }
    
    function setIPAndPort(string newIPAndPort) returns(bool){
        IPAndPort = newIPAndPort;
        NewIPAndPort(newIPAndPort);
        return true;
    }
    
    function kill(){
        suicide(msg.sender);
    }
}
