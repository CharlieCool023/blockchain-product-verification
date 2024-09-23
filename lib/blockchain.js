import { ethers } from "ethers";

// Replace with your contract ABI and address
const contractAddress = "0xCE86eBD552581e5169a5f835f7186582459d0908"; // Your actual contract address
const abi = [
  // Your contract ABI goes here
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "productId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ProductAdded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_productionDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_expiryDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_medicalInfo",
        "type": "string"
      }
    ],
    "name": "addProduct",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_productId",
        "type": "uint256"
      }
    ],
    "name": "getProduct",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "productionDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "expiryDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "medicalInfo",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export async function getContract(signer) {
  return new ethers.Contract(contractAddress, abi, signer);
}

export async function addProductToBlockchain(name, productionDate, expiryDate, medicalInfo) {
  try {
    // Initialize provider and request user's wallet
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // Prompt MetaMask to connect

    const signer = await provider.getSigner(); // Get signer for transactions
    const contract = await getContract(signer); // Get contract instance connected to the signer

    // Call the addProduct function
    const tx = await contract.addProduct(name, productionDate, expiryDate, medicalInfo);
    await tx.wait(); // Wait for transaction to complete

    console.log("Product added to blockchain:", tx);
    return tx; // Return transaction details
  } catch (error) {
    console.error("Blockchain interaction failed:", error);
    throw new Error("Failed to add product to blockchain");
  }
}

export async function getProductFromBlockchain(productId) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(); // Get the signer from MetaMask
    const contract = await getContract(signer); // Get contract instance

    const product = await contract.getProduct(productId);
    return product;
  } catch (error) {
    console.error("Error fetching product from blockchain:", error);
    throw new Error("Failed to fetch product from blockchain");
  }
}
