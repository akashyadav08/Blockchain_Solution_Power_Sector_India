// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnergySupplyChain {

    mapping (address => uint) public energyBalances;
    uint public exchangeRate;
    address public owner;

    event EnergyPurchased(address indexed buyer, uint amount, uint balance);
    event EnergySold(address indexed seller, uint amount, uint balance);

    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor(uint _exchangeRate) {
        exchangeRate = _exchangeRate;
        owner = msg.sender;
    }

    function setExchangeRate(uint _exchangeRate) public onlyOwner {
        exchangeRate = _exchangeRate;
    }

    function buyEnergy() public payable {
        require(msg.value > 0, "Send some ether to buy energy");
        uint energyToBuy = msg.value * exchangeRate;
        energyBalances[msg.sender] += energyToBuy;
        emit EnergyPurchased(msg.sender, energyToBuy, energyBalances[msg.sender]);
    }

    function sellEnergy(uint energy) public {
        require(energyBalances[msg.sender] >= energy, "Not enough energy");
        uint ethToPay = energy / exchangeRate;
        payable(msg.sender).transfer(ethToPay);
        energyBalances[msg.sender] -= energy;
        emit EnergySold(msg.sender, energy, energyBalances[msg.sender]);
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return energyBalances[_owner];
    }
}