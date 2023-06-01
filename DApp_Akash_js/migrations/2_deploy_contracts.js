var EnergySupplyChain = artifacts.require("./EnergySupplyChain.sol"); 
	
module.exports = function(deployer) {
	const exchangeRate = 10; 
	deployer.deploy(EnergySupplyChain, exchangeRate); 
};
