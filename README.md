
---

# Blockchain Product Verification dApp Documentation

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Setup and Installation](#setup-and-installation)
4. [Smart Contract Deployment](#smart-contract-deployment)
5. [Application Architecture](#application-architecture)
6. [Features](#features)
7. [API Endpoints](#api-endpoints)
8. [Security Considerations](#security-considerations)
9. [Testing and Debugging](#testing-and-debugging)
10. [Deployment Guide](#deployment-guide)
11. [Future Enhancements](#future-enhancements)

---

## 1. Overview

This dApp allows users to verify the authenticity of products on the blockchain. It includes an **Admin Dashboard** for adding new products to the blockchain and a **Client Page** for verifying existing products by scanning a QR code or entering a product ID.

### Key Features:
- Admin can add new products, including production date, expiry date, and medical information.
- Each product is stored on the blockchain, making the data tamper-proof and immutable.
- A QR code is generated for each product, allowing for easy verification by clients.
- Clients can verify products using a product ID or by scanning the QR code.

---

## 2. Tech Stack

### Frontend:
- **Next.js**: A React framework for building server-rendered applications.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **ethers.js**: A library for interacting with Ethereum blockchain.

### Backend:
- **Node.js** with **Next.js API Routes**: Backend API for interacting with the blockchain and database.
- **MongoDB**: Used for storing additional product information (optional).
  
### Smart Contracts:
- **Solidity**: Smart contracts are written in Solidity and deployed on Ethereum testnets (e.g., Goerli or Sepolia).
- **Hardhat**: Ethereum development environment used for compiling and deploying contracts.

### Blockchain:
- **Ethereum Testnet**: For deployment and testing (e.g., Goerli).
- **MetaMask**: For wallet interactions with Ethereum.

---

## 3. Setup and Installation

### Prerequisites
- **Node.js** and **npm** installed.
- **MetaMask** extension installed and configured.
- **MongoDB** installed or use MongoDB Atlas (optional).

### Installation Steps:
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd blockchain-product-verification
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following values:
   ```bash
   NEXT_PUBLIC_INFURA_URL="https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID"
   NEXT_PUBLIC_ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
   MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority"
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 4. Smart Contract Deployment

### Using Hardhat:

1. Compile the contract:
   ```bash
   npx hardhat compile
   ```

2. Deploy the contract to the Goerli testnet:
   Update the `deploy.js` script in the `scripts` folder to your desired network.
   ```bash
   npx hardhat run scripts/deploy.js --network goerli
   ```

3. Verify the contract on Etherscan:
   ```bash
   npx hardhat verify --network goerli YOUR_CONTRACT_ADDRESS
   ```

---

## 5. Application Architecture

### Frontend
- **Admin Dashboard**: 
  - Contains a form to add product details (e.g., name, production date, expiry date).
  - Connects to MetaMask for wallet interaction.
  - Once a product is added, a QR code is generated for easy client verification.
- **Client Page**: 
  - Allows users to verify a product by entering the product ID or scanning a QR code.
  - Fetches product details from the blockchain and displays them to the user.

### Backend
- **API Routes**: 
  - **/api/add-product**: Adds a product to MongoDB after it has been added to the blockchain.
  - **/api/get-product**: Retrieves product data from MongoDB or directly from the blockchain if not available in MongoDB.
  
- **MongoDB** (Optional):
  - Stores additional information about products, such as product details for efficient lookup.

---

## 6. Features

### Admin Dashboard:
- **Wallet Connection**: The admin connects their MetaMask wallet to interact with the blockchain.
- **Add New Product**: Admin enters product details (e.g., name, production date, expiry date, medical info) and submits them to the blockchain.
- **QR Code Generation**: Once a product is added, a unique QR code is generated and displayed.
- **Success Screen**: After a product is added, a confirmation screen shows the product ID, details, and QR code.

### Client Page:
- **Verify Product**: Clients can enter a product ID or scan a QR code to verify its authenticity.
- **View Product Details**: The details of the product are fetched from the blockchain and displayed.
- **Success Screen**: Upon successful verification, a confirmation page shows the product details and QR code.

---

## 7. API Endpoints

### POST `/api/add-product`
Adds a new product to MongoDB after it's successfully added to the blockchain.
- **Request Body**:
  ```json
  {
    "productId": "12345",
    "name": "Product Name",
    "productionDate": "2023-09-01",
    "expiryDate": "2024-09-01",
    "medicalInfo": "Medical description"
  }
  ```

### GET `/api/get-product?productId={productId}`
Fetches product information based on the product ID from MongoDB or blockchain.
- **Response**:
  ```json
  {
    "success": true,
    "product": {
      "name": "Product Name",
      "productionDate": "2023-09-01",
      "expiryDate": "2024-09-01",
      "medicalInfo": "Medical description"
    }
  }
  ```

---

## 8. Security Considerations

### a) **MetaMask Integration Security**:
- Ensure that users connect their MetaMask wallet before interacting with the blockchain.
- Always check that the connected wallet is on the correct network (Goerli Testnet).

### b) **HTTPS & SSL**:
- Deploy the app on a platform that supports HTTPS (e.g., Vercel).
- Enable SSL for secure data transmission between the client and server.

### c) **Rate Limiting**:
- Implement rate limiting on the API endpoints to prevent abuse.

### d) **Environment Variables**:
- Use environment variables to store sensitive data like API keys and private keys.

---

## 9. Testing and Debugging

### Frontend Testing:
- Test the wallet connection using MetaMask.
- Test the form validation on the Admin Dashboard.

### Backend Testing:
- Test the `/api/add-product` endpoint to ensure products are added to MongoDB.
- Ensure the smart contract interacts correctly with the blockchain (testnet).

---

## 10. Deployment Guide

### Frontend Deployment (Vercel):
1. Create a new Vercel project.
2. Connect the GitHub repository to Vercel.
3. Add environment variables (e.g., NEXT_PUBLIC_INFURA_URL, MONGODB_URI) in the Vercel settings.
4. Deploy the project.

### Backend Deployment (Optional if using a custom server):
- If using a custom backend, deploy the Next.js API routes on AWS, Heroku, or similar cloud platforms.

### Contract Deployment:
- Make sure your contract is deployed on a testnet (e.g., Goerli) and verified on Etherscan.

---

## 11. Future Enhancements

### a) **Product Ownership Tracking**:
- Extend the contract to include product ownership, allowing transfer of ownership on the blockchain.

### b) **Email or SMS Alerts**:
- Integrate a notification system that sends an alert when a product is verified or about to expire.

### c) **Mobile Wallet Integration**:
- Extend the dApp to work seamlessly with mobile wallets like WalletConnect.

---

### Conclusion

This documentation provides a detailed guide to understanding, setting up, and deploying your blockchain-based product verification dApp. By following the instructions, you can interact with Ethereum testnets, add products, and verify them using the blockchain for authenticity.
