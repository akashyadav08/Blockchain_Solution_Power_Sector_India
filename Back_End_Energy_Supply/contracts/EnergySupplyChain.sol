pragma solidity ^0.8.0;

contract EnergySupplyChain {
    // Define the structure for the EnergyTransaction
    struct PowerTransaction {
        address from;
        address to;
        uint256 energyAmount;
        uint256 costInETH;
        uint256 timestamp;
    }

    // Define the structure for a Household
    struct Household {
        address payable householdAddress;
        uint256 energyBalance;
        uint256 ethBalance;
    }

    // State variables
    address public energyExchange;
    uint256 public transactionCount;

    // Mappings
    mapping(address => Household) public households;
    mapping(uint256 => PowerTransaction) public transactions;

    // Events
    event EnergyTransferred(uint256 transactionID);
    event ETHExchanged(uint256 transactionID);

    // Modifier
    modifier onlyEnergyExchange {
        require(msg.sender == energyExchange, "Only Energy Exchange can call this function.");
        _;
    }

    // Constructor function
    constructor() {
        energyExchange = msg.sender;
        transactionCount = 0;
    }
        // Function to create a new household
    function createHousehold(address payable _householdAddress) public onlyEnergyExchange {
        households[_householdAddress] = Household(_householdAddress, 0, 0);
    }

    // Function to remove a household
    function removeHousehold(address _householdAddress) public onlyEnergyExchange {
        delete households[_householdAddress];
    }

    // Function to transfer energy from one household to another
    function transferEnergy(address _to, uint256 _energyAmount) public {
        Household storage sender = households[msg.sender];

        require(sender.energyBalance >= _energyAmount, "Insufficient energy balance.");

        sender.energyBalance -= _energyAmount;
        households[_to].energyBalance += _energyAmount;

        transactions[transactionCount] = PowerTransaction(
            msg.sender,
            _to,
            _energyAmount,
            0,
            block.timestamp
        );

        emit EnergyTransferred(transactionCount);

        transactionCount++;
    }

    // Function to exchange energy for ETH
    function exchangeETH(uint256 _energyAmount) public payable {
        Household storage sender = households[msg.sender];

        require(sender.energyBalance >= _energyAmount, "Insufficient energy balance.");

        require(msg.value == _energyAmount, "ETH sent doesn't match the energy amount to exchange.");

        sender.energyBalance -= _energyAmount;
        sender.ethBalance += msg.value;

        transactions[transactionCount] = PowerTransaction(
            msg.sender,
            energyExchange,
            _energyAmount,
            msg.value,
            block.timestamp
        );

        emit ETHExchanged(transactionCount);

        transactionCount++;
    }

    // Function to confirm a transaction after the ETH has been transferred
    function confirmTransaction(uint256 _transactionId) public payable onlyEnergyExchange {
        PowerTransaction storage transaction = transactions[_transactionId];

        require(msg.value == transaction.costInETH, "ETH sent doesn't match the transaction cost.");

        households[transaction.to].ethBalance += msg.value;
        households[energyExchange].ethBalance -= msg.value;

        transaction.timestamp = block.timestamp;
    }

    // Function to get the energy and ETH balance of a household
    function getBalance(address _householdAddress) public view returns (uint256 energyBalance, uint256 ethBalance) {
        Household memory household = households[_householdAddress];
        return (household.energyBalance, household.ethBalance);
    }
}