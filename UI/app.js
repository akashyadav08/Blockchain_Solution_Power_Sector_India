var App = {
    web3Provider: null,
    contracts: {},

    init: async function() {
        return await App.initWeb3();
    },

    initWeb3: async function() {
        // Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function() {
        // Code to initialize your contracts
        // This is where you'll interact with the smart contracts when they are ready
    },
};

$(function() {
    var App = {
        init: function() {
            // Initialization code here
            this.createNodes();
        },
        createNodes: function() {
            var nodes = [
                {id: 1, type: 'household', powerUnits: 10, ether: 5},
                {id: 2, type: 'household', powerUnits: 20, ether: 10},
                {id: 3, type: 'household', powerUnits: 15, ether: 7},
                {id: 4, type: 'household', powerUnits: 30, ether: 15},
                {id: 5, type: 'energy provider', powerUnits: 100, ether: 50},
                {id: 6, type: 'energy provider', powerUnits: 150, ether: 75},
                {id: 7, type: 'exchange', powerUnits: 0, ether: 100},
            ];

            var nodesContainer = document.getElementById('nodes-container');

            nodes.forEach(function(node) {
                var nodeElem = document.createElement('div');
                nodeElem.className = 'node on';  // all nodes start as 'on'
                nodeElem.innerHTML = `
                    <div class="status-indicator"></div>
                    <h3>${node.type} ${node.id}</h3>
                    <p>
                        Power Units: <span class="power-units">${node.powerUnits}</span>
                        <input type="number" class="edit-power-units" min="0">
                        <button class="update-power-units">Update Power Units</button>
                    </p>
                    <p>
                        Ether: <span class="ether">${node.ether}</span>
                        <input type="number" class="edit-ether" min="0">
                        <button class="update-ether">Update Ether</button>
                    </p>
                    <button class="transfer-power">Transfer Power Units</button>
                    <button class="transfer-ether">Transfer Ether</button>
                    <label>
                        <input type="checkbox" class="toggle-status" checked>
                        Node status
                    </label>
            `;

                nodesContainer.appendChild(nodeElem);
            });

            // add event listeners here
            $('.transfer-power').on('click', function() {
                console.log('Transfer power clicked');
                // TODO: Call smart contract function here
            });

            $('.transfer-ether').on('click', function() {
                console.log('Transfer ether clicked');
                // TODO: Call smart contract function here
            });

            $('.toggle-status').on('change', function() {
                var nodeElem = $(this).closest('.node');
                if ($(this).is(':checked')) {
                    nodeElem.addClass('on');
                    console.log('Node status changed to ON');
                    // TODO: Call smart contract function here
                } else {
                    nodeElem.removeClass('on');
                    console.log('Node status changed to OFF');
                    // TODO: Call smart contract function here
                }
            });
        },
    };

    $(window).load(function() {
        App.init();
    });
});

let chart;

function createChart(data, labels) {
    const ctx = document.getElementById('consumption-chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Energy Consumption',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.getElementById('time-period').addEventListener('change', (e) => {
    // Fetch new data based on the selected time period
    // For now, we'll just generate some dummy data
    const labels = Array.from({length: 24}, (_, i) => i+1);
    const data = labels.map(() => Math.random() * 100);
    
    // If a chart already exists, destroy it before creating a new one
    if (chart) {
        chart.destroy();
    }
    createChart(data, labels);
});

// Create the initial chart
document.getElementById('time-period').dispatchEvent(new Event('change'));
$(document).ready(function() {
    var nodes = [
        {id: 1, type: 'household', powerUnits: 10, ether: 5},
        {id: 2, type: 'household', powerUnits: 20, ether: 10},
        {id: 3, type: 'household', powerUnits: 15, ether: 7},
        {id: 4, type: 'household', powerUnits: 30, ether: 15},
        {id: 5, type: 'energy provider', powerUnits: 100, ether: 50},
        {id: 6, type: 'energy provider', powerUnits: 150, ether: 75},
        {id: 7, type: 'exchange', powerUnits: 0, ether: 100},
    ];

    var nodesContainer = $('#nodes-container');

    nodes.forEach(function(node) {
        var nodeElem = $('<div>', { class: 'node on' });
        nodeElem.html(`
            <div class="status-indicator"></div>
            <h3>${node.type} ${node.id}</h3>
            <p>
                Power Units: <span class="power-units">${node.powerUnits}</span>
                <input type="number" class="edit-power-units" min="0">
                <button class="update-power-units">Update Power Units</button>
            </p>
            <p>
                Ether: <span class="ether">${node.ether}</span>
                <input type="number" class="edit-ether" min="0">
                <button class="update-ether">Update Ether</button>
            </p>
            <label>
                <input type="checkbox" class="toggle-status" checked>
                Node status
            </label>
        `);
        nodesContainer.append(nodeElem);
    });

    // Toggle node status
    $('.toggle-status').change(function() {
        $(this).closest('.node').toggleClass('on');
    });

    // Update Power Units
    $('.update-power-units').click(function() {
        var newUnits = $(this).siblings('.edit-power-units').val();
        $(this).siblings('.power-units').text(newUnits);
    });

    // Update Ether
    $('.update-ether').click(function() {
        var newEther = $(this).siblings('.edit-ether').val();
        $(this).siblings('.ether').text(newEther);
    });
});
