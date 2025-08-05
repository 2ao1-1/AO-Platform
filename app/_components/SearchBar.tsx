import { useState } from "react";
import { LuSearch } from "react-icons/lu";

export default function SearchBar() {
  const [showBar, setShowBar] = useState(false);
  return (
    <>
      <input
        type="search"
        placeholder="Search..."
        className={
          "w-full px-2 py-1 border border-gray-300 rounded-full focus:ring-2 focus:ring-main focus:border-main" +
          (showBar ? "block" : "hidden md:block")
        }
      />
      <button
        className="p-2 bg-main text-white rounded-full hover:bg-main"
        onClick={() => setShowBar(!showBar)}
      >
        <LuSearch />
      </button>
    </>
  );
}
