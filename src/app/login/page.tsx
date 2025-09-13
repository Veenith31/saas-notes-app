"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setIsLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center w-full max-w-6xl p-6">
        <div className="flex-1 text-left mb-10 lg:mb-0 lg:pr-12">
          <h1 className="text-5xl font-extrabold mb-6 flex items-center gap-3">
             Multi-Tenant SaaS Notes
          </h1>
          <p className="mb-6 text-lg text-gray-200">
            Securely manage notes for your company with strict tenant isolation.
            Invite your team, collaborate, and scale with confidence.
          </p>
          <ul className="space-y-3 text-gray-200">
            <li> Multi-Tenancy: Acme & Globex with secure isolation</li>
            <li> Role-based Access: Admin & Member support</li>
            <li> Free & Pro Plans with note limits</li>
            <li> CRUD operations for Notes</li>
            <li> Hosted on Vercel with API + Frontend</li>
          </ul>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-center text-white">Sign In</h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              Use the test accounts provided to explore the app
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-200"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div>
               { /*<button
                  type="submit"
                  className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
                >
                  Sign In
                </button> */}

                <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
              </div>
            </form>

            <div className="mt-6 text-sm text-gray-300">
              <p className="text-center">Test Accounts:</p>
              <ul className="mt-2 space-y-1">
                <li> admin@acme.test / password</li>
                <li> user@acme.test / password</li>
                <li> admin@globex.test / password</li>
                <li> user@globex.test / password</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);
