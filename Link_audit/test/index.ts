import chai, { expect, use, util } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from "ethers";
import { MockProvider, deployContract, solidity } from "ethereum-waffle";
import bnJs from "bn.js";

// Enable and inject BN dependency
chai.use(require("chai-bn")(bnJs));
use(solidity);

// user accounts
let deployer: Signer;

// contract address state variable
let linkVault: Contract;
let linkToken: Contract;

// user data logic
describe("ChainLink Oracel Stake", () => {
  beforeEach(async () => {
    [deployer] = await ethers.getSigners();

    // token
    const tokenFactory = await ethers.getContractFactory("LinkToken", deployer);
    linkToken = await tokenFactory.deploy();
    await linkToken.deployed();

    console.log(`linkToken Contract: ${linkToken.address}`)

    const vaultFactory = await ethers.getContractFactory(
      "LinkVaults",
      deployer
    );

    linkVault = await vaultFactory.deploy(linkToken.address);
    await linkVault.deployed();

    // add allowed token process (func call)
    // const allowToken = await linkVault.functions.addAllowedTokens(

    // )
  });
});
