App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
  
    init: function() {
      return App.initWeb3();
    },
  
    initWeb3: function() {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
      } else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
      }
      web3 = new Web3(App.web3Provider);
      return App.initContract();
    },
  
    initContract: function() {
      $.getJSON("EnergySupplyChain.json", function(EnergySupplyChain) {
        App.contracts.EnergySupplyChain = TruffleContract(EnergySupplyChain);
        App.contracts.EnergySupplyChain.setProvider(App.web3Provider);
  
        return App.bindEvents();
      });
    },
  
    bindEvents: function() {
      $(document).on('click', '#buy-button', App.buyEnergy);
      $(document).on('click', '#sell-button', App.sellEnergy);
      return App.render();
    },
  
    render: function() {
      var loader = $("#loader");
      var content = $("#content");
  
      loader.show();
      content.hide();
  
      // Load account data
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
            App.account = account;
            $("#account-address").html("Your Account: " + App.account);
  
            // Load contract data
            App.contracts.EnergySupplyChain.deployed().then(function(instance) {
                energySupplyChainInstance = instance;
                return energySupplyChainInstance.balanceOf(App.account);
            }).then(function(balance) {
                var balanceTemplate = "<p>" + balance + "</p>"
                $('#energy-balance').html(balanceTemplate);
                App.recordBalance(balance); // New function to record energy balance 
    
                loader.hide();
                content.show();
            }).catch(function(error) {
                console.warn(error);
            });
  
        }
      });
    },  
    
    recordBalance: function(balance) {
        var timestamp = new Date().toLocaleString();
        var record = "<tr><td>" + timestamp + "</td><td>" + balance + "</td></tr>";
        $('#balance-history').append(record);
    },

    buyEnergy: function() {
      var energyToBuy = $('#energy-to-buy').val();
      App.contracts.EnergySupplyChain.deployed().then(function(instance) {
        return instance.buyEnergy({ from: App.account, value: web3.utils.toWei(energyToBuy, "ether") });
      }).then(function(result) {
        $("#content").hide();
        $("#loader").show();
      }).then(App.render)
      .catch(function(err) {
        console.error(err);
      });
    },
  
    sellEnergy: function() {
      var energyToSell = $('#energy-to-sell').val();
      App.contracts.EnergySupplyChain.deployed().then(function(instance) {
        return instance.sellEnergy(energyToSell, { from: App.account });
      }).then(function(result) {
        $("#content").hide();
        $("#loader").show();
      }).then(App.render)
      .catch(function(err) {
        console.error(err);
      });
    }
  };
  
  $(function() {
    $(window).on('load', function() {
      App.init();
    });
  });
  
  // Enables MetaMask login
  const ethEnabled = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      window.web3 = new Web3(window.ethereum);
      return true;
    }
    return false;
  }
  
  login = function() {
    if (!ethEnabled()) {
      alert("Please use an Ethereum-compatible browser or install an extension like MetaMask to use this dApp");
    } else {
      App.init();
    }
  }





// if (window.ethereum) {
//     window.web3 = new Web3(ethereum);
//     try {
//         ethereum.enable().then(function(accounts) {
//             var account = accounts[0];
//             var contractArtifact = require('/Users/akash/electricity_supply_2/build/contracts/EnergySupplyChain.json');
//             var contractABI = contractArtifact.abi; // replace with your contract ABI
//             var networkId = window.web3.eth.net.getId();
//             var contractAddress = contractArtifact.networks[networkId].address;
//             var contract = new web3.eth.Contract(contractABI, contractAddress);

//             web3.eth.getBalance(account, function(error, result) {
//                 if (!error) {
//                     document.getElementById("account-address").innerText += " " + account;
//                     document.getElementById("eth-balance").innerText += " " + web3.utils.fromWei(result, "ether") + " ETH";
//                 }
//             });

//             contract.methods.energyBalances(account).call()
//             .then(energyBalance => {
//                 document.getElementById("energy-balance").innerText += " " + energyBalance + " units";
//             });

//             document.getElementById("buy-button").addEventListener('click', function() {
//                 var energyToBuy = document.getElementById("energy-to-buy").value;
//                 var etherToPay = energyToBuy / exchangeRate;
//                 contract.methods.buyEnergy().send({from: account, value: web3.utils.toWei(etherToPay, "ether")})
//                 .on('transactionHash', function(hash){
//                     document.getElementById("buy-transaction-status").innerText = "Transaction sent. Waiting for confirmation...";
//                 })
//                 .on('confirmation', function(confirmationNumber, receipt){
//                     document.getElementById("buy-transaction-status").innerText = "Transaction confirmed!";
//                 })
//                 .on('error', function(error){
//                     document.getElementById("buy-transaction-status").innerText = "Transaction failed!";
//                 });
//             });

//             document.getElementById("sell-button").addEventListener('click', function() {
//                 var energyToSell = document.getElementById("energy-to-sell").value;
//                 contract.methods.sellEnergy(energyToSell).send({from: account})
//                 .on('transactionHash', function(hash){
//                     document.getElementById("sell-transaction-status").innerText = "Transaction sent. Waiting for confirmation...";
//                 })
//                 .on('confirmation', function(confirmationNumber, receipt){
//                     document.getElementById("sell-transaction-status").innerText = "Transaction confirmed!";
//                 })
//                 .on('error', function(error){
//                     document.getElementById("sell-transaction-status").innerText = "Transaction failed!";
//                 });
//             });

//             contract.events.EnergyPurchased({
//                 filter: {buyer: account},
//                 fromBlock: 0
//             }, function(error, event){
//                 document.getElementById("purchased-events").innerText += JSON.stringify(event.returnValues);
//             });

//             contract.events.EnergySold({
//                 filter: {seller: account},
//                 fromBlock: 0
//             }, function(error, event){
//                 document.getElementById("sold-events").innerText += JSON.stringify(event.returnValues);
//             });

//         });
//     } catch (error) {
//         document.getElementById("access-denied").style.display = "block";
//     }
// } else {
//     document.getElementById("metamask-required").style.display = "block";
// }  