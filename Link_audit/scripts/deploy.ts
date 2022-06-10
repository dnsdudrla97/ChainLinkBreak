const { ethers } = require("hardhat");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env.local" });

const deployTest = async () => {
  const pcc = await deployPriceConsumberV3();

  const pccTx = await pcc.getLatestPrice();

  console.log("pcc_price:", pccTx[0]);

  let pccTxRoundData: any = 0;
  if (pccTx[0]) {
    pccTxRoundData = await pcc._getRoundData(pccTx[0]);
  }
  console.log("pcc_roundData:", pccTxRoundData);
};

async function deployPriceConsumberV3() {
  const PriceConsumberFactory = await ethers.getContractFactory(
    "PriceConsumerV3"
  );
  const PCC = await PriceConsumberFactory.deploy();
  const _PCC = await PCC.deployed();

  console.log("PriceConsumber deployed to:", PCC.address);

  return _PCC;
}

deployTest().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
