import React from "react";
import { GiFox } from "react-icons/gi";
import { MdOutlineDangerous } from "react-icons/md";

export default function Loading() {
  return (
    <section className="mt-10 flex flex-col items-center justify-center text-center">
      <GiFox size={64} className="text-orange-400 dark:text-orange-300 mb-4 animate-pulse" />

      <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2 text-gray-800 dark:text-white">
        Tunggu Sebentar... Fubuki Lagi Ngecek Ekor~ <MdOutlineDangerous className="text-red-500 dark:text-red-400 animate-spin-slow" />
      </h1>

      <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md text-sm md:text-base">
        Shirakami Fubuki sedang mempersiapkan halaman ini... <br />
        (Kalau kamu buru-buru, hati-hati ya... soalnya Kurokami suka muncul tiba-tiba)
      </p>

      <div className="flex space-x-2 justify-center">
        <span className="h-3 w-3 bg-orange-400 dark:bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
        <span className="h-3 w-3 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        <span className="h-3 w-3 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
      </div>

      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        (Kurokami sedang mengawasi di balik bayangan...)
      </p>
    </section>
  );
}
