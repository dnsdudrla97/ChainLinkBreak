pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DappToken is ERC20 {
    constructor() public ERC20("Link Token", "LINK") {
        _mint(msg.sender, 1000000000000000000000000);
    }
} 