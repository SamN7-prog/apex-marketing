export default function Pricing() {
  return (
    <section className="bg-black text-white py-24 px-10">
      <h2 className="text-5xl font-bold text-center mb-16">
        Simple Pricing
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
          <h3 className="text-3xl font-bold mb-4">Starter</h3>
          <p className="text-5xl font-bold mb-6">$29</p>

          <ul className="space-y-3 mb-8">
            <li>✓ AI Ad Generator</li>
            <li>✓ 10 Campaigns</li>
            <li>✓ Email Support</li>
          </ul>

          <button className="w-full bg-blue-600 py-3 rounded-xl">
            Get Started
          </button>
        </div>

        <div className="bg-blue-600 p-8 rounded-2xl shadow-2xl scale-105">
          <h3 className="text-3xl font-bold mb-4">Pro</h3>
          <p className="text-5xl font-bold mb-6">$99</p>

          <ul className="space-y-3 mb-8">
            <li>✓ Unlimited Campaigns</li>
            <li>✓ AI Analytics</li>
            <li>✓ Priority Support</li>
          </ul>

          <button className="w-full bg-black py-3 rounded-xl">
            Start Free Trial
          </button>
        </div>

        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
          <h3 className="text-3xl font-bold mb-4">Enterprise</h3>
          <p className="text-5xl font-bold mb-6">Custom</p>

          <ul className="space-y-3 mb-8">
            <li>✓ Unlimited Everything</li>
            <li>✓ Dedicated Manager</li>
            <li>✓ Custom AI Models</li>
          </ul>

          <button className="w-full bg-blue-600 py-3 rounded-xl">
            Contact Sales
          </button>
        </div>

      </div>
    </section>
  );
}