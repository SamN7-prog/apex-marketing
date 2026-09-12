import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-10 py-6 bg-black/80 backdrop-blur-md text-white border-b border-gray-800 z-50">

      <h1 className="text-2xl font-bold">
        Apex Marketing
      </h1>

      <div className="space-x-6">
        <Link href="/features">Features</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/contact">Contact</Link>
      </div>

    </nav>
  );
}