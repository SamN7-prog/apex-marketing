export default function Features() {
  return (
    <section className="bg-black text-white py-24 px-10">
      <h2 className="text-5xl font-bold text-center mb-16">
        Everything You Need
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
          <h3 className="text-2xl font-bold mb-4">🤖 AI Ad Generator</h3>
          <p>Create high-converting ads in seconds with AI.</p>
        </div>

        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
          <h3 className="text-2xl font-bold mb-4">📊 Analytics</h3>
          <p>Track every campaign with real-time insights.</p>
        </div>

        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
          <h3 className="text-2xl font-bold mb-4">🎯 Targeting</h3>
          <p>Reach the perfect audience automatically.</p>
        </div>

      </div>
    </section>
  );
}