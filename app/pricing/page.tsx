export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-10">
      <h1 className="text-6xl font-bold mb-8">
        Pricing
      </h1>

      <div className="grid md:grid-cols-3 gap-8 mt-10">

        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Starter</h2>
          <p className="text-4xl font-bold mb-4">$29/mo</p>
          <p className="text-gray-400">
            Perfect for individuals and small businesses.
          </p>
        </div>

        <div className="bg-blue-600 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Pro</h2>
          <p className="text-4xl font-bold mb-4">$99/mo</p>
          <p>
            Everything you need to grow your business with AI.
          </p>
        </div>

        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Enterprise</h2>
          <p className="text-4xl font-bold mb-4">Custom</p>
          <p className="text-gray-400">
            Custom solutions for large organizations.
          </p>
        </div>

      </div>
    </main>
  );
}