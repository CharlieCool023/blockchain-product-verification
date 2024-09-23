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
    <div className="p-4">
      {!success ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Verify Product</h1>

          <form onSubmit={handleSubmit}>
            <label className="block mb-2">
              Enter Product ID:
              <input
                type="text"
                value={productId}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
            </label>

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
            >
              {isLoading ? "Verifying..." : "Verify Product"}
            </button>
          </form>

          {isLoading && <p className="mt-4">Please wait, we are fetching the product data...</p>}
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Product Verified!</h1>
          <p>The product details have been successfully verified. Here are the details:</p>

          <div className="mt-4">
            <h3 className="text-xl">Product Details:</h3>
            <p><strong>Product Name:</strong> {productData.name}</p>
            <p><strong>Production Date:</strong> {productData.productionDate}</p>
            <p><strong>Expiry Date:</strong> {productData.expiryDate}</p>
            <p><strong>Medical Information:</strong> {productData.medicalInfo}</p>
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
            Verify Another Product
          </button>
        </div>
      )}
    </div>
  );
}
