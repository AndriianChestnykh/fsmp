contract SellEscrow {
    
    // data owner (DO)
    address owner;
    
    enum Status { pending, ongoing, closed }
    
    struct StorageDeal {
        bytes32 id;
        address contractor;
        string ipAddress;
        uint size;
        uint period;
        uint price;
        Status status;
    }
    
    StorageDeal[] deals;
    
    function SellEscrow() {
        owner = msg.sender;
    }
    
    // invoked by DO (initiating storage contract with DSO)
    // on terms of DSO (SellEscrow)
    function init_DO(bytes32 dealId, address contractor, uint size, uint period) payable {
        uint id = deals.length + 1;
        deals.push(StorageDeal(dealId, contractor, "", size, period, msg.value, Status.pending));
        
        // todo launch "event" that DSO can listen to send his ipAddress  
    }
    
    // invoked by DSO 
    function init_DSO(bytes32 dealId, string ipAddress){
        address contractor = msg.sender;
        for(uint i = 0; i < deals.length; i++){
            StorageDeal deal = deals[i];
            if(deal.id == dealId && deal.contractor == contractor){
                deal.ipAddress = ipAddress;        
            }        
        }
        
        // todo launch "event" that DO can listen to initiate data transmission
    }
    
    // in order to authenticate DO file uploading following scheme proposed
    // see in end of contract
    
    // invoked by DSO when data transfer is completed 
    function confirm_DSO(bytes32 dealId, uint fileHash){
        
        // todo launch "event" that DO can listen to confirm deal        
    }
    
    // invoked by DO when fileHash submited by DSO is the same as local 
    // deal status become "ongoing"
    function confirm_DO(bytes32 dealId){
        
    }
    
    function cancel(bytes32 dealId) onlyBy(owner) {
        // check if deal is pending, if true:
        // RemoveByIndex(deals, index)
        // send Eth back to owner account
    }
    
    modifier onlyBy(address account) {
        if (msg.sender != account)
            throw;
        // "_;" will be replaced by the actual function
        // body when the modifier is used.
        _;
    }
    
    /** Removes the value at the given index in an array. */
    function RemoveByIndex(StorageDeal[] storage values, uint i) internal {
        while (i<values.length-1) {
            values[i] = values[i+1];
            i++;
        }
        values.length--;
    }

// File uploading authentication scheme(RSA or other asymmetric algorithm):  

// When DO initiate connection with DSO 
// DO create a token (dealId signed with his private key) and sends to DSO
// DSO verify that DO sent this (with DO public key) and store a file
// https://en.wikipedia.org/wiki/Digital_signature#Definition_of_Digital_Signature
// http://stackoverflow.com/questions/454048/what-is-the-difference-between-encrypting-and-signing-in-asymmetric-encryption

// Do not miss with file encryption that done with symmetric algorithm (AES or other)

}