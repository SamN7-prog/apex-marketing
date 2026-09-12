export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

      <h1 className="text-6xl font-bold mb-6">
        Contact Us
      </h1>

      <p className="text-xl text-gray-400 mb-10">
        We'd love to hear about your business.
      </p>

      <button className="bg-blue-600 px-8 py-4 rounded-xl hover:bg-blue-700 transition">
        Schedule a Demo
      </button>

    </main>
  );
}