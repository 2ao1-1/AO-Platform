"use client";

import Avatar from "./_components/Avatar";
import Logo from "./_components/Logo";
import NavBar from "./_components/NavBar";
import SearchBar from "./_components/SearchBar";

export default function Home() {
  return (
    <main className="flex-1 p-4">
      {/* header */}
      <header className="grid grid-cols-4 md:grid-cols-12 items-center">
        {/* logo */}
        <div className="col-span-1">
          <Logo />
        </div>

        {/* sitemap */}
        <div className="col-span-4 hidden md:block">
          <NavBar />
        </div>
        <div className="col-span-2"></div>

        <div className="col-span-4 flex items-center">
          <SearchBar />
        </div>

        {/* <div className="col-span-1"> */}
        <div className="col-span-1 justify-end flex items-center space-x-2">
          <Avatar />
        </div>
        {/* </div> */}
      </header>
    </main>
  );
}
