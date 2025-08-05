"use client";
import Image from "next/image";
import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import Link from "next/link";
import { useAuth } from "../_hooks/useAuth";
import useUserInfo from "../_hooks/useUserInfo";
import { User } from "../_types/UserTypes";

export default function Avatar() {
  const [showPInfo, setShowPInfo] = useState(false);
  const { user } = useUserInfo();
  const { logout } = useAuth();

  return (
    <>
      <div className="flex items-center">
        {user && (
          <div className="flex items-center space-x-2">
            <AvatarImg user={user} />
            <button
              onClick={() => {
                setShowPInfo(!showPInfo);
              }}
            >
              <LuChevronDown />
            </button>
          </div>
        )}
      </div>

      {showPInfo && user && (
        <div>
          <div className="absolute right-4 mt-6 w-48 bg-white rounded-lg shadow-lg p-4 border">
            <div className="flex flex-col justify-center items-center text-center">
              <Image
                src={user.avatar}
                alt="User Avatar"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover mb-4 bg-gray-500"
              />
              <h3 className="text-sm font-semibold text-gray-800">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <div className="mt-2 grid">
              <Link
                href={`/profile/${user.id}`}
                className="text-blue-600 hover:underline"
              >
                View Profile
              </Link>
              <Link
                href={`/profile/${user.id}`}
                className="text-blue-600 hover:underline"
              >
                setting
              </Link>
            </div>
            <button
              onClick={logout}
              className="mt-2 text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function AvatarImg({ user }: { user: User }) {
  return (
    <>
      {user.avatar ? (
        <Image
          src={user.avatar}
          alt={`${user.firstName} ${user.lastName}`}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-gray-500 flex items-center justify-center">
          <span className="text-white font-medium">
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </span>
        </div>
      )}
    </>
  );
}
