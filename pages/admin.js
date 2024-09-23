import { useState } from "react";
import { addProductToBlockchain } from "../lib/blockchain";
import QRCode from "qrcode";
import { ethers } from "ethers";

export default function AdminPage() {
  const [productName, setProductName] = useState("");
  const [productionDate, setProductionDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [medicalInfo, setMedicalInfo] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [productId, setProductId] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [success, setSuccess] = useState(false); // Success state

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed. Please install it to use this feature.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        alert("Wallet connected!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isWalletConnected) {
      alert("Please connect your wallet first.");
      return;
    }

    setIsLoading(true); // Show loading

    try {
      const tx = await addProductToBlockchain(productName, productionDate, expiryDate, medicalInfo);
      const receipt = await tx.wait();
      const blockNumber = receipt.blockNumber;

      const response = await fetch("/api/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: blockNumber,
          name: productName,
          productionDate,
          expiryDate,
          medicalInfo,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }

      const qrCodeData = `${window.location.origin}/client?productId=${blockNumber}`;
      const qrCodeUrl = await QRCode.toDataURL(qrCodeData);
      setQrCodeUrl(qrCodeUrl);
      setProductId(blockNumber);

      setIsLoading(false); // Stop loading
      setSuccess(true); // Show success
    } catch (error) {
      console.error("Error adding product:", error);
      setIsLoading(false); // Stop loading on error
      alert("Error adding product.");
    }
  };

  return (
    <div className="p-4">
      {!success ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Add New Product</h1>

          {/* Connect Wallet Button */}
          {!isWalletConnected ? (
            <button
              onClick={connectWallet}
              className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="mb-4">
              <p className="text-green-500">Wallet Connected: {walletAddress}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block mb-2">
              Product Name:
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
            </label>

            <label className="block mb-2">
              Production Date:
              <input
                type="date"
                value={productionDate}
                onChange={(e) => setProductionDate(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
            </label>

            <label className="block mb-2">
              Expiry Date:
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
            </label>

            <label className="block mb-4">
              Medical Information:
              <input
                type="text"
                value={medicalInfo}
                onChange={(e) => setMedicalInfo(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
            </label>

            <button
              type="submit"
              className={`${
                isWalletConnected ? "bg-green-500" : "bg-gray-500 cursor-not-allowed"
              } text-white py-2 px-4 rounded`}
              disabled={!isWalletConnected}
            >
              {isLoading ? "Adding Product..." : "Add Product"}
            </button>
          </form>

          {isLoading && <p className="mt-4">Please wait, your product is being added...</p>}
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
          <p>Your product has been successfully added to the blockchain.</p>
          <div className="mt-4">
            <h3 className="text-xl">Product Details:</h3>
            <p><strong>Product Name:</strong> {productName}</p>
            <p><strong>Production Date:</strong> {productionDate}</p>
            <p><strong>Expiry Date:</strong> {expiryDate}</p>
            <p><strong>Medical Information:</strong> {medicalInfo}</p>
            <p><strong>Product ID:</strong> {productId}</p>

            {qrCodeUrl && (
              <div className="mt-4">
                <img src={qrCodeUrl} alt="Product QR Code" />
              </div>
            )}
          </div>

          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
          >
            Return to Admin Page
          </button>
        </div>
      )}
    </div>
  );
}
