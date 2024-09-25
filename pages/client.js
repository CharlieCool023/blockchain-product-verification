import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import QRCode from "qrcode";

export default function ClientPage() {
  const [productId, setProductId] = useState("");
  const [productData, setProductData] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
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
    setIsLoading(true);

    try {
      const response = await fetch(`/api/get-product?productId=${id}`);
      const data = await response.json();

      if (data.success) {
        setProductData(data.product);
        const qrCodeData = `${window.location.origin}/client?productId=${id}`;
        const qrCodeUrl = await QRCode.toDataURL(qrCodeData);
        setQrCodeUrl(qrCodeUrl);
        setSuccess(true);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Error fetching product data.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        
        {/* Adding an SVG illustration on the top right corner */}
        <svg className="absolute top-0 right-0 w-32 h-32 opacity-10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#D4CFFF" d="M58.4,-62.5C73.2,-51.4,78.7,-25.7,73.4,-5.6C68.1,14.5,52,29,37.3,43.8C22.7,58.6,9.3,73.8,-5.1,76.7C-19.5,79.6,-38.9,70.2,-52.6,55.4C-66.2,40.6,-74.1,20.3,-74.8,-0.5C-75.5,-21.4,-69,-42.8,-55.4,-54.2C-41.8,-65.5,-20.9,-66.7,2.5,-68.4C25.8,-70.1,51.7,-72.7,58.4,-62.5Z" transform="translate(100 100)" />
        </svg>

        {!success ? (
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Verify Product</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Enter Product ID</label>
                <input
                  type="text"
                  value={productId}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className={`w-full py-3 rounded-lg text-white font-semibold shadow-lg transition duration-300 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-500 hover:bg-indigo-600"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify Product"}
                </button>
              </div>
            </form>

            {isLoading && (
              <p className="text-center text-gray-600 mt-4">Fetching product data, please wait...</p>
            )}
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-green-600 mb-8">Product Verified!</h1>
            <p className="text-gray-600 mb-6">The product details have been successfully verified.</p>

            <div className="bg-gray-50 p-6 rounded-lg shadow-lg mb-6">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">Product Details:</h3>
              <p className="mb-2"><strong>Name:</strong> {productData.name}</p>
              <p className="mb-2"><strong>Production Date:</strong> {productData.productionDate}</p>
              <p className="mb-2"><strong>Expiry Date:</strong> {productData.expiryDate}</p>
              <p className="mb-4"><strong>Medical Information:</strong> {productData.medicalInfo}</p>
              <p className="mb-4"><strong>Product ID:</strong> {productId}</p>

              {qrCodeUrl && (
                <div className="mt-4">
                  <img src={qrCodeUrl} alt="Product QR Code" className="inline-block border border-gray-300 rounded-lg shadow-lg" />
                </div>
              )}
            </div>

            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-lg"
            >
              Verify Another Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
