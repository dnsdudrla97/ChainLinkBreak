pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// safeMath
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// safe Math


contract LinkVaults is ChainlinkClient, Ownable {
    using SafeMath for uint256;

    string public name = "Link Token Vault";
    IERC20 public linkToken;

    address[] public stakers;

    // token:address
    mapping(address => mapping(address => uint256)) public stakingBalance; 
    mapping(address => uint256) public uniqueTokenStaked;
    mapping(address => address) public tokenPriceFeedMapping;
    address[] allowedTokens;

    constructor (address _linkTokenAddress) public {
        linkToken = IERC20(_linkTokenAddress);
    }

    function addAllowedTokens(address token)
        public
        onlyOwner
    {
        allowedTokens.push(token);
    }

    function setPriceFeedContract(address token, address priceFeed)
        public
        onlyOwner
    {
        tokenPriceFeedMapping[token] = priceFeed;
    }

    function stakeTokens(uint256 _amount, address token)
        public
    {
        require(_amount > 0, "amount cannot be 0");
        if (tokenIsAllowed(token)) {
            updateUniqueTokensStaked(msg.sender, token);
            IERC20(token).transferFrom(msg.sender, address(this), _amount);
            stakingBalance[token][msg.sender] = stakingBalance[token][msg.sender].add(_amount); 
            if (uniqueTokenStaked[msg.sender] == 1) {
                stakers.push(msg.sender);
            }
        }
    }

    // unstake process 
    function unstakeTokens(address token)
        public
    {
        require(uniqueTokenStaked[msg.sender] > 0, "no tokens staked");
        
        uint256 balance = stakingBalance[token][msg.sender];
        require(balance > 0, "staking balance cannot be 0");
        
        IERC20(token).transfer(msg.sender, balance);
        stakingBalance[token][msg.sender] = 0;
        uniqueTokenStaked[msg.sender] = uniqueTokenStaked[msg.sender].sub(1);
    }

    // user total value
    function getUserTotalValue(address user)
        public
        view
        returns (uint256) 
    {
        uint256 totalValue = 0;
        if (uniqueTokenStaked[user] > 0) {
            for (
                uint256 allowedTokensIndex = 0;
                allowedTokensIndex < allowedTokens.length;
                allowedTokensIndex++
            ) {
                totalValue = totalValue.add(getUserStakingBalanceEthValue(
                    user,
                    allowedTokens[allowedTokensIndex]
                ));
            }
        }
        return totalValue;
    }
    
    // token allowed
    function tokenIsAllowed(address token)
        public
        view
        returns (bool)
    {
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            if (allowedTokens[allowedTokensIndex] == token) {
                return true;
            }
        }
        return false;
    }

    // update unique token staked
    function updateUniqueTokensStaked(address user, address token)
        internal
    {
        if (stakingBalance[token][msg.sender] <= 0) {
            uniqueTokenStaked[user] = uniqueTokenStaked[user].add(1);
        }
    }

    // get user staking balance eth value (ORACLE)
    function getUserStakingBalanceEthValue(address user, address token)
        public
        view
        returns (uint256)
    {
        if (uniqueTokenStaked[user] <= 0) {
            return 0;
        }
        return (stakingBalance[token][user].mul(getTokenEthPrice(token).div(1E8)));
    }

    // issue token
    function issueToken()
        public
        onlyOwner
    {
        for (
            uint256 stakersIndex = 0;
            stakersIndex < stakers.length;
            stakersIndex++
        ) {
            address recipeient = stakers[stakersIndex];
            linkToken.transfer(recipeient, getUserTotalValue(recipeient));
        }
    }

    // data feed parser
    function getTokenEthPrice(address token)
        public
        view
        returns (uint256) 
    {
        address priceFeedAddress = tokenPriceFeedMapping[token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredRound
        ) = priceFeed.latestRoundData();

        return uint256(price);
    }

}