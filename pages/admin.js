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

  // Connect wallet function
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

  // Handle form submit to add product
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        {!success ? (
          <div>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Add New Product</h1>

            {/* Connect Wallet Button */}
            {!isWalletConnected ? (
              <div className="text-center mb-6">
                <button
                  onClick={connectWallet}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 shadow-md"
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div className="text-center mb-6">
                <p className="text-green-600 font-medium">Wallet Connected: {walletAddress}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Production Date</label>
                <input
                  type="date"
                  value={productionDate}
                  onChange={(e) => setProductionDate(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Medical Information</label>
                <input
                  type="text"
                  value={medicalInfo}
                  onChange={(e) => setMedicalInfo(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="text-center mt-6">
                <button
                  type="submit"
                  className={`${
                    isWalletConnected ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 cursor-not-allowed"
                  } text-white font-semibold py-2 px-6 rounded-lg transition duration-300 shadow-md`}
                  disabled={!isWalletConnected}
                >
                  {isLoading ? "Adding Product..." : "Add Product"}
                </button>
              </div>
            </form>

            {isLoading && <p className="text-center text-gray-600 mt-4">Please wait, your product is being added...</p>}
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-600 mb-6">Thank You!</h1>
            <p>Your product has been successfully added to the blockchain.</p>
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-700">Product Details:</h3>
              <p><strong>Name:</strong> {productName}</p>
              <p><strong>Production Date:</strong> {productionDate}</p>
              <p><strong>Expiry Date:</strong> {expiryDate}</p>
              <p><strong>Medical Info:</strong> {medicalInfo}</p>
              <p><strong>Product ID:</strong> {productId}</p>

              {qrCodeUrl && (
                <div className="mt-6">
                  <img src={qrCodeUrl} alt="Product QR Code" className="inline-block" />
                </div>
              )}
            </div>

            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg mt-6 transition duration-300 shadow-md"
            >
              Return to Admin Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
