import { useState } from "react";
import Link from "next/link";
import { FaSignOutAlt, FaUser } from "react-icons/fa";

interface AvatarDropdownProps {
  avatarUrl: string;
  onLogout: () => void;
}

export default function AvatarDropdown({
  avatarUrl,
  onLogout,
}: AvatarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex text-left items-center flex">
      {/* Nút avatar */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="focus:outline-none"
      >
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-8 h-8 rounded-full object-cover border border-gray-200 hover:opacity-80"
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="z-50 absolute right-0 top-[40px] mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <Link href="/profile" legacyBehavior>
              <a
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                <FaUser/> Profile
              </a>
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
