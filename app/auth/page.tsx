"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LoginForm from "./_components/loginForm";
import RegisterForm from "./_components/RegisterForm";

export default function AuthPage() {
  const [currentPage, setCurrentPage] = useState("login");

  function handleCurrentPage(page: string) {
    setCurrentPage(page);
  }
  return (
    <main className="flex-1 w-full h-screen bg-hero-pattern bg-cover bg-no-repeat bg-center">
      <div className="bg-slate-900/60 w-full h-screen">
        <div className="md:flex justify-between items-start mx-auto h-screen container gap-28">
          <div className="flex flex-col justify-start md:h-screen text-tertiary w-full md:w-1/2 md:py-10 relative">
            <header className="w-full flex justify-between items-start md:items-center p-2 md:p-4 md:border-b border-gray-400">
              <Image
                src="/images/favicon.png"
                width={200}
                height={150}
                alt="logo"
                className="w-4 h-4 md:w-5 md:h-5"
              />
              <div className="flex flex-col md:flex-row justify-end items-end gap-1 md:gap-4 text-xs md:text-sm capitalize">
                <Link href="/about">About</Link>
                <Link href="/new">{`What's new?`}</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </header>
            <div className="flex flex-col justify-center items-center p-4 text-sm md:text-base text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl uppercase font-mainHead pt-20 pb-10">
                Let Him Cook!
              </h1>
              <span className="font-mainHead uppercase pb-4">
                Share Your Art, Let the World Taste Your Creativity
              </span>
              <p className="hidden md:block uppercase text-sm text-center md:px-20">
                {`"This is your stage to showcase your flavor masterpieces to the
                world. The world appreciates your art."`}
              </p>
            </div>
            <footer className="fixed bottom-0 w-full text-xs py-2 text-gray-400">
              <span>AO_STUDIO &copy; All Rights Reserved</span>
            </footer>
          </div>

          {currentPage === "login" ? (
            <LoginForm
              handleCurrentPage={handleCurrentPage}
              currentPage={currentPage}
            />
          ) : (
            <RegisterForm
              handleCurrentPage={handleCurrentPage}
              currentPage={currentPage}
            />
          )}
        </div>
      </div>
    </main>
  );
}
