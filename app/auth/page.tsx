"use client";

import Image from "next/image";
import { useState } from "react";
import LoginForm from "./_components/loginForm";
import RegisterForm from "./_components/RegisterForm";

export default function AuthPage() {
  const [currentPage, setCurrentPage] = useState("login");

  function handleCurrentPage(page: string) {
    setCurrentPage(page);
  }
  return (
    <main className="flex-1 w-full h-screen relative">
      <div className="absolute top-0  w-full p-4 ">
        <Image
          src="/images/favicon.png"
          alt="Background Image"
          className="w-5 h-5"
          width={20}
          height={20}
        />
      </div>

      <div className="flex justify-center items-center w-full h-full">
        <div className="hidden md:w-1/2 bg-tertiary md:flex justify-center items-center ">
          <div className="hidden md:block relative pt-16 w-64 bg-white">
            <Image
              src="/images/monalizaa.png"
              alt="Background Image"
              className="w-full object-cover"
              width={350}
              height={500}
              loading="lazy"
            />
            <Image
              src="/images/Limited_Edition.png"
              alt="Limited Edition"
              className="absolute -bottom-32 left-20 object-cover"
              width={350}
              height={500}
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-white flex justify-center items-center ">
          <div className="h-screen w-full flex flex-col items-center justify-center py-8 px-4 md:px-8 relative">
            <div className="absolute sm:relative top-20 p-4 sm:top-0 flex flex-col items-center gap-2 md-6 sm:mb-10 text-center">
              <h1 className="block text-5xl font-mainHead uppercase mb-8 text-main">
                AO Gallary
              </h1>
              <p>{`"Your art is priceless but collectible."`}</p>
              <p>Share your art and choose who deserves to own it.</p>
            </div>
            <div className="absolute bottom-0 sm:relative w-full flex flex-col items-center justify-center py-10 p-4">
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
        </div>
      </div>
    </main>
  );
}
