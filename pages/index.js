import { useRouter } from "next/router";

export default function WelcomePage() {
  const router = useRouter();

  const navigateToClient = () => {
    router.push("/client");
  };

  const navigateToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">BLOCKCHAIN PRODUCT VERIFICATION</h1>
        <p className="text-xl mb-6">Easily verify the authenticity of food products to combact food fraud.</p>

        <div className="flex justify-center space-x-4">
          {/* Client Verification Button */}
          <button
            onClick={navigateToClient}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-300"
          >
            Get Started
          </button>

          {/* Admin Authentication Button */}
          <button
            onClick={navigateToLogin}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-300"
          >
            Admin Login
          </button>
        </div>
      </div>
      <footer className="mt-8 text-center text-gray-400 text-xs"> CharlieCool © 2024 - All Rights Reserved.</footer>
    </div>
  );
}
