pragma solidity ^0.8.0;

contract EnergyTransferContract {
    struct Node {
        uint id;
        string nodeType;
        uint powerUnits;
        uint eth;
        bool status;
    }

    mapping(uint => Node) public nodes;
    uint public nodeCount;

    constructor() {
        createNode("household", 10, 5);
        createNode("household", 20, 10);
        createNode("household", 15, 7);
        createNode("household", 30, 15);
        createNode("energy provider", 100, 50);
        createNode("energy provider", 150, 75);
        createNode("exchange", 0, 100);
    }

    function createNode(string memory _nodeType, uint _powerUnits, uint _ether) private {
        nodeCount++;
        nodes[nodeCount] = Node(nodeCount, _nodeType, _powerUnits, _ether, true);
    }

    function updatePowerUnits(uint nodeId, uint newPowerUnits) public {
        require(nodes[nodeId].id != 0, "Node does not exist");
        require(nodes[nodeId].nodeType == "household", "Only households can update power units");
        nodes[nodeId].powerUnits = newPowerUnits;
    }

    function updateEther(uint nodeId, uint newEther) public {
        require(nodes[nodeId].id != 0, "Node does not exist");
        nodes[nodeId].eth = newEther;
    }

    function transferPower(uint fromNode, uint toNode, uint powerAmount) public {
        require(nodes[fromNode].id != 0 && nodes[toNode].id != 0, "Node does not exist");
        require(nodes[fromNode].powerUnits >= powerAmount, "Insufficient power units");

        nodes[fromNode].powerUnits -= powerAmount;
        nodes[toNode].powerUnits += powerAmount;
    }

    function transferEther(uint fromNode, uint toNode, uint etherAmount) public {
        require(nodes[fromNode].id != 0 && nodes[toNode].id != 0, "Node does not exist");
        require(nodes[fromNode].eth >= etherAmount, "Insufficient Ether");

        nodes[fromNode].eth -= etherAmount;
        nodes[toNode].eth += etherAmount;
    }

    function updateNodeStatus(uint nodeId, bool newStatus) public {
        require(nodes[nodeId].id != 0, "Node does not exist");
        nodes[nodeId].status = newStatus;
    }
}