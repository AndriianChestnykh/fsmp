contract fsmp {
    
    struct DataOwner{
        uint gbValue;       // gigabyte quantity
        uint perGbPrice;    // ready to pay per GB per day
        uint redundancy;       // quantity of copies
        uint currEthAmount; // ethereum amount
    }
    
    struct DataStorage{
        address ownerAddress;  // Owner Ethereum address;
        bytes15 storageIP;  // IP of the Storage
        uint ApproveDate;   // Start Date;
        uint StopDate;      // Stop Date;
        uint withdrawed;    // How much ETH has been withdrawed
    }
    
    mapping (address => DataStorage) dataStorages;    
    mapping (address => DataOwner) dataOwners;
    
    ///Contract constructor
    function fsmp(){
        if (!CreateStorageRequest(500, 1000, 7)) throw;
    }
    
    /// Create Request For Data Storage
    function CreateStorageRequest(uint gbValue, uint perGbPrice, uint redundancy) returns (bool)
    {
        //if (msg.value == 0) {
        //    throw;
        //}
        DataOwner memory owner;
        owner.gbValue = gbValue;
        owner.perGbPrice = perGbPrice;
        owner.redundancy = redundancy;
        owner.currEthAmount = msg.value;
        dataOwners[msg.sender] = owner;
        return true;
    }
    
    /// Get date from storage
    function GetStorageRequestDataVolume() constant returns (uint) 
    {
        return dataOwners[msg.sender].gbValue;        // gigabyte quantity
    }
    
    /// Approve Contract 
    function CreateStorageContract(address ownerAddress, bytes15 storageIP) returns (bool)
    {
        DataStorage memory ds;
        ds.ownerAddress = ownerAddress;      
        ds.storageIP = storageIP;            
        dataStorages[msg.sender] = ds;
        return true;
    }
    
    /// Add Start of user relationship
    function SetApproveStorageContract() returns (bool)
    {
        dataStorages[msg.sender].ApproveDate = now;
        return true;
    }
    
    
    /// Stop of Users Relation
    function DoSetStopStorageContract(address dsAddress) returns (bool)
    {
        dataStorages[dsAddress].StopDate = now;        
        return true;
    }
    
    
    /// Take money from transaction
    function Withdraw() returns(bool)
    {
        uint bal;
        bal = (dataStorages[msg.sender].StopDate - dataStorages[msg.sender].ApproveDate) * dataOwners[dataStorages[msg.sender].ownerAddress].perGbPrice;
        if (!msg.sender.send(bal)) {
            return true;
        } else {
            return false;
        }
    }
    
    
    /// Add Money To For Continue Relation 
    function Deposit () returns (bool)
    {
        dataOwners[msg.sender].currEthAmount += msg.value;
        return true;
    }
}
