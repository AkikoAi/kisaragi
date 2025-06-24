import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";
import { FaNetworkWired, FaShieldAlt, FaServer } from "react-icons/fa";
import { MdSpeed, MdSecurity, MdPublic } from "react-icons/md";
import { SiApacheairflow } from "react-icons/si";

// Reusable FeatureCard component
const FeatureCard = ({ icon, title, description }: { icon: JSX.Element, title: string, description: string }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
  </div>
);

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col">

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md w-full fixed top-0 left-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              width={40}
              height={40}
              alt="Kisaragi Networks Logo"
              src="/images/brand.png"
              className="rounded-full"
            />
            <span className="font-semibold text-lg">Kisaragi Networks</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/features" className="hover:text-blue-600 dark:hover:text-blue-400">Fitur</Link>
            <Link href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400">Harga</Link>
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">Tentang Kami</Link>
          </nav>
          <div className="flex space-x-4">
            <Link href="/register" className="text-sm px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-colors">
              Daftar
            </Link>
            <Link href="/login" className="text-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              Masuk
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold flex items-center justify-center gap-3">
          <FaNetworkWired className="text-blue-500" />
          Kisaragi Networks
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300">
          Proxy Jaringan Premium untuk Kecepatan, Keamanan, dan Anonimitas Maksimal.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Mulai Sekarang
          </Link>
          <Link href="/features" className="px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
            Lihat Fitur
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">Mengapa Memilih Kisaragi?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FaShieldAlt className="text-4xl text-blue-500" />}
              title="Keamanan Tingkat Tinggi"
              description="Enkripsi end-to-end, firewall cerdas, dan perlindungan DDoS bawaan."
            />
            <FeatureCard
              icon={<MdSpeed className="text-4xl text-green-500" />}
              title="Kecepatan Optimal"
              description="Routing global cerdas dengan cache pintar untuk performa maksimal."
            />
            <FeatureCard
              icon={<FaServer className="text-4xl text-purple-500" />}
              title="Manajemen Mudah"
              description="Dashboard lengkap untuk memonitor koneksi dan lalu lintas proxy Anda."
            />
            <FeatureCard
              icon={<MdSecurity className="text-4xl text-red-500" />}
              title="Privasi Total"
              description="IP masking otomatis dan rotating proxy untuk perlindungan identitas."
            />
            <FeatureCard
              icon={<SiApacheairflow className="text-4xl text-yellow-500" />}
              title="Otomatisasi Jaringan"
              description="Pengaturan proxy otomatis sesuai kebutuhan lalu lintas Anda."
            />
            <FeatureCard
              icon={<MdPublic className="text-4xl text-indigo-500" />}
              title="Akses Global"
              description="Server proxy tersedia di berbagai negara untuk akses konten lintas batas."
            />
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      {/* Produk Proxy Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">Paket Proxy Premium Kami</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Produk 1 */}
            <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow hover:scale-105 transition-transform">
              <FaNetworkWired className="text-blue-500 text-4xl mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Dummy 1 - Indonesia</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Kecepatan 1Gbps, Asia/Indonesia, Unlimited Bandwidth, Uptime 99%</p>
            </div>

            {/* Produk 2 */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg p-6 shadow-md hover:scale-105 transition-transform">
              <MdSpeed className="text-4xl mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Dummy 2 - Singapore</h3>
              <p className="text-sm">Kecepatan 2Gbps, Asia/Singapore, Unlimited Bandwidth, Uptime 99%</p>
            </div>

            {/* Produk 3 */}
            <div className="border-2 border-purple-500 rounded-xl p-6 bg-white dark:bg-gray-800 shadow">
              <FaServer className="text-purple-500 text-4xl mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Dummy 3 - Japan</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Kecepatan 5Gbps, Asia/Japan, Unlimited Bandwidth, Uptime 99.9%</p>
            </div>

            {/* Produk 4 */}
            <div className="bg-gray-800 text-white rounded-lg p-6 shadow-md">
              <MdSecurity className="text-red-400 text-4xl mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Dummy 4 - USA</h3>
              <p className="text-sm">Kecepatan 1Gbps, North America/USA, Unlimited Bandwidth, Uptime 99.9%</p>
            </div>

            {/* Produk 5 */}
            <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <MdPublic className="text-indigo-500 text-4xl mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Dummy 5 - Germany</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Kecepatan 3Gbps, Europe/Germany, Unlimited Bandwidth, Uptime 99.8%</p>
            </div>

            {/* Produk 6 */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-lg p-6 shadow">
              <FaShieldAlt className="text-4xl mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Dummy 6 - France</h3>
              <p className="text-sm">Kecepatan 2Gbps, Europe/France, Unlimited Bandwidth, Uptime 99%</p>
            </div>

            {/* Produk 7 */}
            <div className="border-l-4 border-green-400 bg-white dark:bg-gray-800 p-6 shadow">
              <MdSpeed className="text-green-400 text-4xl mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Dummy 7 - Australia</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Kecepatan 4Gbps, Oceania/Australia, Unlimited Bandwidth, Uptime 99%</p>
            </div>

            {/* Produk 8 */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 shadow-md">
              <FaNetworkWired className="text-blue-400 text-4xl mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Dummy 8 - India</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Kecepatan 1Gbps, Asia/India, Unlimited Bandwidth, Uptime 98%</p>
            </div>

            {/* Produk 9 */}
            <div className="border-dashed border-2 border-red-400 rounded-lg p-6 bg-white dark:bg-gray-800">
              <MdPublic className="text-red-400 text-4xl mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Dummy 9 - Brazil</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Kecepatan 2Gbps, South America/Brazil, Unlimited Bandwidth, Uptime 97%</p>
            </div>

            {/* Produk 10 */}
            <div className="bg-gradient-to-tl from-yellow-400 to-orange-500 text-white rounded-lg p-6 shadow-lg">
              <FaServer className="text-4xl mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Dummy 10 - South Africa</h3>
              <p className="text-sm">Kecepatan 1Gbps, Africa/South Africa, Unlimited Bandwidth, Uptime 96%</p>
            </div>

          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 mt-auto">
        &copy; {new Date().getFullYear()} Kisaragi Networks. All rights reserved.
      </footer>
    </main>
  );
}
