require("dotenv").config();
const { ethers } = require("ethers");

const { abi } = require("../artifacts/contracts/LuxuryProductPassport.sol/LuxuryProductPassport.json");

async function main() {

    const provider = new ethers.JsonRpcProvider(process.env.POLYGON_MAINNET_RPC_URL);

    const wallet = new ethers.Wallet(
        process.env.METAMASK_PRIVATE_KEY,
        provider
    );

    const contract = new ethers.Contract(
        process.env.LUXURY_PRODUCT_PASSPORT_ADDRESS,
        abi,
        wallet
    );

    const receiver = process.env.METAMASK_RECEIVER_ADDRESS;

    const tokenURI =
        "ipfs://bafkreihod7ilyy2kuvygpman3hxkw76pocwlvoeefuopchjvqrsua7sxae";

    console.log("Minting NFT...");

    const tx = await contract.mint(receiver, tokenURI);

    console.log("Transaction:", tx.hash);

    const receipt = await tx.wait();

    console.log("Mint success");
    console.log("Block:", receipt.blockNumber);
}

main().catch(console.error);