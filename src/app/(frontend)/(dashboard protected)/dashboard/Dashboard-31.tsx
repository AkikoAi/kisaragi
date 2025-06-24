"use client";

import  { useState } from "react";

export default function ModeratorPage() {
    const [selectedMenu, setSelectedMenu] = useState<"review" | "reports">("review");

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Moderator Dashboard</h1>

            {/* Info Card */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow text-center">
                    <h2 className="font-semibold text-lg">Level</h2>
                    <p className="text-green-500 text-xl">31 - 60</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow text-center">
                    <h2 className="font-semibold text-lg">Privilege</h2>
                    <p>Review Content, Manage Reports</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow text-center">
                    <h2 className="font-semibold text-lg">Status</h2>
                    <p className="text-green-500">Active</p>
                </div>
            </div>

            {/* Menu Tabs */}
            <div className="flex justify-center space-x-4 mb-6">
                {["review", "reports"].map((menu) => (
                    <button
                        key={menu}
                        onClick={() => setSelectedMenu(menu as "review" | "reports")}
                        className={`px-4 py-2 rounded-md text-sm font-medium 
                        ${selectedMenu === menu
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"} 
                        hover:bg-green-500 hover:text-white transition-colors`}
                    >
                        {menu.charAt(0).toUpperCase() + menu.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-4 bg-white dark:bg-gray-700 rounded-md shadow min-h-[200px]">
                {selectedMenu === "review" && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Content Review</h3>
                        <p>Review pending posts, comments, and uploads here.</p>
                        {/* Dummy Review Items */}
                        <ul className="mt-2 space-y-2">
                            <li className="p-3 bg-gray-100 dark:bg-gray-600 rounded">Post #1 - Pending</li>
                            <li className="p-3 bg-gray-100 dark:bg-gray-600 rounded">Comment #23 - Flagged</li>
                        </ul>
                    </div>
                )}
                {selectedMenu === "reports" && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">User Reports</h3>
                        <p>Manage user-reported content or behavior.</p>
                        {/* Dummy Reports */}
                        <ul className="mt-2 space-y-2">
                            <li className="p-3 bg-gray-100 dark:bg-gray-600 rounded">Report #12 - Spam</li>
                            <li className="p-3 bg-gray-100 dark:bg-gray-600 rounded">Report #45 - Harassment</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
