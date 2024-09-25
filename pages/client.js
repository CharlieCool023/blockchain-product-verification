import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import QRCode from "qrcode";

export default function ClientPage() {
  const [productId, setProductId] = useState("");
  const [productData, setProductData] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null); // Store the QR Code
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [success, setSuccess] = useState(false); // Success state
  const router = useRouter();

  useEffect(() => {
    // Automatically fetch product data if productId is present in the URL
    const productIdFromUrl = router.query.productId;
    if (productIdFromUrl) {
      setProductId(productIdFromUrl);
      fetchProductData(productIdFromUrl);
    }
  }, [router.query.productId]);

  const handleInputChange = (e) => {
    setProductId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchProductData(productId);
  };

  const fetchProductData = async (id) => {
    setIsLoading(true); // Start loading

    try {
      const response = await fetch(`/api/get-product?productId=${id}`);
      const data = await response.json();

      if (data.success) {
        setProductData(data.product);

        // Generate the QR code
        const qrCodeData = `${window.location.origin}/client?productId=${id}`;
        const qrCodeUrl = await QRCode.toDataURL(qrCodeData);
        setQrCodeUrl(qrCodeUrl);

        setSuccess(true); // Show success
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Error fetching product data.");
    }

    setIsLoading(false); // Stop loading
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        {!success ? (
          <div>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Verify Product</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Enter Product ID</label>
                <input
                  type="text"
                  value={productId}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="text-center mt-6">
                <button
                  type="submit"
                  className={`${
                    isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                  } text-white font-semibold py-2 px-6 rounded-lg transition duration-300 shadow-md`}
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify Product"}
                </button>
              </div>
            </form>

            {isLoading && <p className="text-center text-gray-600 mt-4">Fetching product data, please wait...</p>}
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-600 mb-6">Product Verified!</h1>
            <p>The product details have been successfully verified.</p>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-700">Product Details:</h3>
              <p><strong>Name:</strong> {productData.name}</p>
              <p><strong>Production Date:</strong> {productData.productionDate}</p>
              <p><strong>Expiry Date:</strong> {productData.expiryDate}</p>
              <p><strong>Medical Information:</strong> {productData.medicalInfo}</p>
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
              Verify Another Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
