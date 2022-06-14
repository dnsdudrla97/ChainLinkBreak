const { ethers } = require("hardhat");
const dotenv = require("dotenv");
const { BigNumber } = require("ethers");
dotenv.config({ path: "./.env.local" });

const deployTest = async () => {
  const tokenTX = await deployToken();

  const vaultTx = await deployVault(tokenTX);
  // 0xa36085F69e2889c224210F603D836748e7dC0088
  // console.log(tokenTX, vaultTx);
  // token allowed
  vaultTx.addAllowedTokens(
    "0x9ab7cb50e11a7fef12aa6d596a604a8916fca1d1"
  );
  // console.log(allowToken);
  await vaultTx.setPriceFeedContract(
    "0x9ab7cb50e11a7fef12aa6d596a604a8916fca1d1",
    "0x9326BFA02ADD2366b30bacB125260Af641031331"
  );
  // stake token , amount testing
  const stakeToken = await vaultTx.stakeTokens(
    1,
    "0x9ab7cb50e11a7fef12aa6d596a604a8916fca1d1"
  );
  console.log(stakeToken);

  // issueToken
  const issueToken = await vaultTx.issueToken();
  console.log(issueToken);

  // getTokenEthPrice
  // const realPriceFeedEth = await vaultTx.getTokenEthPrice(
  //   "0x9ab7cb50e11a7fef12aa6d596a604a8916fca1d1"
  // );
  // console.log(realPriceFeedEth);

  // console.log("Link Vault deployed to: ", vaultTx.address);

  // const pcc = await deployPriceConsumberV3();

  // const pccTx = await pcc.getLatestPrice();

  // console.log("pcc_price:", pccTx[0]);

  // let pccTxRoundData: any = 0;
  // if (pccTx[0]) {
  //   pccTxRoundData = await pcc._getRoundData(pccTx[0]);
  // }
  // console.log("pcc_roundData:", pccTxRoundData);
};

// async function deployPriceConsumberV3() {
//   const PriceConsumberFactory = await ethers.getContractFactory(
//     "PriceConsumerV3"
//   );
//   const PCC = await PriceConsumberFactory.deploy();
//   const _PCC = await PCC.deployed();

//   console.log("PriceConsumber deployed to:", PCC.address);

//   return _PCC;
// }

async function deployToken() {
  const tokenFactory = await ethers.getContractFactory("LinkToken");
  const token = await tokenFactory.deploy();
  const _token = await token.deployed();

  console.log("Link Token deployed to: ", token.address);
  return _token;
}

async function deployVault(token: any) {
  const vaultFactory = await ethers.getContractFactory("LinkVaults");
  const vault = await vaultFactory.deploy(token.address);
  const _vault = await vault.deployed();
  console.log("Link Vault deployed to: ", vault.address);

  return _vault;
}

deployTest().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
