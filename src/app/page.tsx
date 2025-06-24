"use client";

import Image from "next/image";
import Link from "next/link";
import { FaNetworkWired, FaShieldAlt, FaServer } from "react-icons/fa";
import { MdSpeed, MdSecurity, MdPublic } from "react-icons/md";
import { SiApacheairflow } from "react-icons/si";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <div className="relative flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex items-center flex-col">
          <Image
            width={200}
            height={200}
            alt="Kisaragi Networks Logo"
            src="/images/brand.png"
            className="rounded-full w-10 h-10" />
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/register" className="text-lg text-blue-600 dark:text-blue-400 hover:underline">
            Daftar
          </Link>
          <Link href="/login" className="text-lg text-blue-600 dark:text-blue-400 hover:underline">
            Masuk
          </Link>
        </div>
      </div>
      <section className="py-20 px-4 max-w-6xl mx-auto text-center">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold flex justify-center items-center gap-3">
            <FaNetworkWired className="text-blue-500" />
            Kisaragi Networks
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Solusi Jaringan Proxy Cepat, Aman, dan Andal
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon={<FaShieldAlt className="text-4xl text-blue-500" />}
            title="Keamanan Tingkat Tinggi"
            description="Enkripsi end-to-end, firewall cerdas, dan perlindungan DDoS bawaan."
          />
          <FeatureCard
            icon={<MdSpeed className="text-4xl text-green-500" />}
            title="Kecepatan Optimal"
            description="Rute global dan cache pintar untuk latensi minimum dan kecepatan maksimum."
          />
          <FeatureCard
            icon={<FaServer className="text-4xl text-purple-500" />}
            title="Manajemen Server"
            description="Panel kontrol intuitif untuk mengatur node proxy dan distribusi lalu lintas."
          />
          <FeatureCard
            icon={<MdSecurity className="text-4xl text-red-500" />}
            title="Privasi dan Anonimitas"
            description="Teknologi masking IP dan rotating proxy untuk menjaga kerahasiaan."
          />
          <FeatureCard
            icon={<SiApacheairflow className="text-4xl text-yellow-500" />}
            title="Otomatisasi Routing"
            description="Integrasi alur kerja cerdas untuk pengaturan jaringan otomatis."
          />
          <FeatureCard
            icon={<MdPublic className="text-4xl text-indigo-500" />}
            title="Akses Global"
            description="Jangkauan server di berbagai negara untuk koneksi lintas batas."
          />
        </div>
      </section>

      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Kisaragi Network. All rights reserved.
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 text-left">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );
}
