import { FaUser, FaCogs, FaChartBar, FaEnvelope } from "react-icons/fa";

export default function Page() {
  const cards = [
    { title: "Users", description: "Manage your users", icon: <FaUser size={30} /> },
    { title: "Settings", description: "App configuration", icon: <FaCogs size={30} /> },
    { title: "Reports", description: "View analytics", icon: <FaChartBar size={30} /> },
    { title: "Messages", description: "Check inbox", icon: <FaEnvelope size={30} /> },
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

      {/* Footer Note */}
      <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">© 2025 Kisaragi. All rights reserved.</p>
    </>
  );
}
