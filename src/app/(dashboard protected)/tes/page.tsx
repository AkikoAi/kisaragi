import { FaUser, FaCogs, FaChartBar, FaEnvelope } from "react-icons/fa";

export default function Page() {
  const cards = [
    { title: "Users", description: "Manage your users", icon: <FaUser size={30} /> },
    { title: "Settings", description: "App configuration", icon: <FaCogs size={30} /> },
    { title: "Reports", description: "View analytics", icon: <FaChartBar size={30} /> },
    { title: "Messages", description: "Check inbox", icon: <FaEnvelope size={30} /> },
  ];
  const cards2 = [
    {
      id: 1,
      title: "Produk A",
      description: "Deskripsi singkat produk A yang menarik.",
      price: "Rp 120.000",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,
      title: "Produk B",
      description: "Deskripsi singkat produk B untuk pelanggan.",
      price: "Rp 95.000",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 3,
      title: "Produk C",
      description: "Produk ini sangat diminati di pasar.",
      price: "Rp 150.000",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 4,
      title: "Produk D",
      description: "Produk unggulan kami dengan fitur terbaik.",
      price: "Rp 200.000",
      image: "https://via.placeholder.com/300x200",
    },
  ];

  return (
    <>
      {/* Grid Card Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-7">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-700 dark:text-gray-100 p-4 rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center"
          >
            <div className="mb-2 text-blue-500 dark:text-blue-300">{card.icon}</div>
            <h3 className="font-semibold text-lg">{card.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{card.description}</p>
          </div>
        ))}
      </section>

      {/* Table Section */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-left">
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Action</th>
                <th className="py-2 px-4">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-600">
                <td className="py-2 px-4">Alice</td>
                <td className="py-2 px-4">Logged In</td>
                <td className="py-2 px-4">2 mins ago</td>
              </tr>
              <tr>
                <td className="py-2 px-4">Bob</td>
                <td className="py-2 px-4">Updated Profile</td>
                <td className="py-2 px-4">5 mins ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold">150</p>
          <p>Users</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold">75</p>
          <p>Orders</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold">24</p>
          <p>Pending Tasks</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold">5</p>
          <p>Issues</p>
        </div>
      </section>

      {/* Text Content Section */}
      <section className="mt-10 text-center">
        <h2 className="text-2xl font-semibold mb-2">Welcome to the Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          This is your admin control panel. Use the sections above to navigate between different modules and manage your
          application efficiently.
        </p>
      </section>


      <section className="mt-10">
        <h1 className="text-2xl font-bold">Button Template Demo</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            Primary
          </button>
          <button className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors">
            Secondary
          </button>
          <button className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Outline
          </button>
          <button className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">
            Danger
          </button>
          <button className="px-4 py-2 rounded-md bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Ghost
          </button>
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white opacity-50 cursor-not-allowed">
            Loading...
          </button>
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white opacity-50 cursor-not-allowed">
            Disabled
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-8">
          All button variants are reusable and styled for both light & dark modes.
        </p>
      </section>

      <section className="mt-10">
        <h1 className="text-2xl font-bold mb-6">Form Input Template Demo</h1>

        <form className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
          {/* Text Input */}
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Select */}
          <div>
            <label htmlFor="role" className="block mb-1 font-medium">
              Role
            </label>
            <select
              id="role"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="guest">Guest</option>
            </select>
          </div>

          {/* Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              id="terms"
              type="checkbox"
              className="accent-blue-600 w-4 h-4"
            />
            <label htmlFor="terms" className="text-sm">
              I agree to the terms and conditions
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
          This is a reusable input form template supporting light & dark mode.
        </p>
      </section>

      <section className="mt-10">
        <h1 className="text-2xl font-bold mb-6">Modal Template Demo</h1>

        {/* Trigger Button (for example purpose only) */}
        <label htmlFor="my-modal" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Open Modal
        </label>

        {/* Hidden checkbox toggle for modal */}
        <input type="checkbox" id="my-modal" className="peer z-[90]" />

        {/* Modal Overlay */}
        <div className="fixed inset-0  bg-opacity-50 hidden peer-checked:flex items-center justify-center z-50">
          {/* Modal Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-11/12 max-w-md p-6 space-y-4 relative">
            <h2 className="text-xl font-semibold">Example Modal</h2>
            <p className="text-gray-600 dark:text-gray-300">
              This is a reusable modal template using only TailwindCSS and native checkbox toggle.
            </p>
            <div className="flex justify-end space-x-2">
              {/* Close Button */}
              <label htmlFor="my-modal" className="cursor-pointer bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition">
                Cancel
              </label>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Katalog Produk</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards2.map((card) => (
            <div
              key={card.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow flex flex-col"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="font-semibold text-lg mb-2">{card.title}</h2>
                <p className="text-sm flex-grow text-gray-600 dark:text-gray-300">
                  {card.description}
                </p>
                <p className="font-semibold mt-4">{card.price}</p>
                <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Beli Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Total Produk: {cards.length}
        </p>
      </section>

      {/* Footer Note */}
      <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">© 2025 Kisaragi. All rights reserved.</p>
    </>
  );
}
