var EnergySupplyChain = artifacts.require("./EnergySupplyChain.sol"); 
	
module.exports = function(deployer) { 
	deployer.deploy(EnergySupplyChain); 
};
