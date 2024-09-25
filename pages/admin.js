import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, []);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-blue-100 p-4">
      <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Adding SVG decoration */}
        <svg className="absolute top-0 right-0 w-40 h-40 opacity-10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#A3D8F4" d="M58.4,-62.5C73.2,-51.4,78.7,-25.7,73.4,-5.6C68.1,14.5,52,29,37.3,43.8C22.7,58.6,9.3,73.8,-5.1,76.7C-19.5,79.6,-38.9,70.2,-52.6,55.4C-66.2,40.6,-74.1,20.3,-74.8,-0.5C-75.5,-21.4,-69,-42.8,-55.4,-54.2C-41.8,-65.5,-20.9,-66.7,2.5,-68.4C25.8,-70.1,51.7,-72.7,58.4,-62.5Z" transform="translate(100 100)" />
        </svg>

        {!success ? (
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Add New Product</h1>

            {/* Connect Wallet Button */}
            {!isWalletConnected ? (
              <div className="text-center">
                <button
                  onClick={connectWallet}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-lg transition duration-300 mb-6"
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div className="mb-6 text-center">
                <p className="text-green-500 font-semibold">Wallet Connected: {walletAddress}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">Product Name:</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  className="mt-2 w-full border border-gray-300 rounded-lg p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Production Date:</label>
                <input
                  type="date"
                  value={productionDate}
                  onChange={(e) => setProductionDate(e.target.value)}
                  required
                  className="mt-2 w-full border border-gray-300 rounded-lg p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Expiry Date:</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                  className="mt-2 w-full border border-gray-300 rounded-lg p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Medical Information:</label>
                <input
                  type="text"
                  value={medicalInfo}
                  onChange={(e) => setMedicalInfo(e.target.value)}
                  required
                  className="mt-2 w-full border border-gray-300 rounded-lg p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className={`${
                    isWalletConnected
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-400 cursor-not-allowed"
                  } text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300`}
                  disabled={!isWalletConnected}
                >
                  {isLoading ? "Adding Product..." : "Add Product"}
                </button>
              </div>
            </form>

            {isLoading && (
              <p className="text-center text-gray-600 mt-4">Please wait, your product is being added...</p>
            )}
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Thank You!</h1>
            <p className="text-gray-600 mb-6">Your product has been successfully added to the blockchain.</p>

            <div className="bg-gray-50 p-6 rounded-lg shadow-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Product Details:</h3>
              <p className="mb-2"><strong>Product Name:</strong> {productName}</p>
              <p className="mb-2"><strong>Production Date:</strong> {productionDate}</p>
              <p className="mb-2"><strong>Expiry Date:</strong> {expiryDate}</p>
              <p className="mb-4"><strong>Medical Information:</strong> {medicalInfo}</p>
              <p className="mb-4"><strong>Product ID:</strong> {productId}</p>

              {qrCodeUrl && (
                <div className="mt-4">
                  <img src={qrCodeUrl} alt="Product QR Code" className="mx-auto w-32 h-32" />
                </div>
              )}
            </div>

            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300"
            >
              Return to Admin Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
