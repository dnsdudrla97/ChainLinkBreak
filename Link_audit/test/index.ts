import { expect, use, util } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from "ethers";
import { MockProvider, deployContract, solidity } from "ethereum-waffle";
import bnJs from "bn.js";
import chai from "chai";

// Enable and inject BN dependency
chai.use(require("chai-bn")(bnJs));
use(solidity);
let deployer: Signer;
let user: Signer;

// contract address
let linkVault: Contract;
let linkToken: Contract;

// user data logic
describe("Greeter", () => {
  beforeEach(async () => {
    [deployer] = await ethers.getSigners();

  });

  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});