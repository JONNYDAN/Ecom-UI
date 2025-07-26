import React from "react";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"info" | "orders">("info");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: userData?.username,
    email: userData?.email,
    avatar: userData?.avatar,
    phoneNumber: userData?.phoneNumber,
    address: userData?.address
  });

  const handleEdit = () => {
    setFormData({
      name: userData?.username,
      email: userData?.email,
      avatar: userData?.avatar,
      phoneNumber: userData?.phoneNumber,
      address: userData?.address
    });
    setShowModal(true);
  };

  const handleSave = () => {
    setUserData({
      username: formData.name,
      email: formData.email,
      avatar: formData.avatar,
      phoneNumber: formData.phoneNumber,
      address: formData.address
    });
    setShowModal(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Lấy thông tin người dùng từ Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          console.log("User Firestore data:", userDoc.data());
          setUserData(userDoc.data());
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          avatar: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="bg-gray-100 p-4 md:col-span-1">
          <div className="flex flex-col items-center">
            <img
              src={userData?.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border"
            />
            <h2 className="mt-4 font-semibold text-lg">{userData?.username}</h2>
            <p className="text-gray-600 text-xs">{userData?.email}</p>
          </div>
          <nav className="mt-6 space-y-3">
            <button
              onClick={() => setActiveTab("info")}
              className={`block w-full text-left py-2 px-4 rounded ${
                activeTab === "info"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`block w-full text-left py-2 px-4 rounded ${
                activeTab === "orders"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              Orders
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3 p-6">
          {activeTab === "info" && (
            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Personal Information
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={userData?.avatar}
                  alt="Current Avatar"
                  className="w-20 h-20 rounded-full border"
                />
                <div>
                  <p className="text-sm text-gray-600">Current Avatar</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userData?.username}
                    className="w-full border rounded px-3 py-2"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userData?.email}
                    className="w-full border rounded px-3 py-2"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Phone number
                  </label>
                  <input
                    type="text"
                    value={userData?.phoneNumber}
                    className="w-full border rounded px-3 py-2"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={userData?.address}
                    className="w-full border rounded px-3 py-2"
                    readOnly
                  />
                </div>
              </div>
              <button
                onClick={handleEdit}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
            </section>
          )}

          {activeTab === "orders" && (
            <div className="p-6 bg-gray-50 min-h-screen">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold mb-6">Order History</h3>

                <div className="mb-8">
                  <div className="bg-white rounded-lg shadow divide-y">
                    {/* Order Item */}
                    <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <p className="font-medium">Order #12345</p>
                        <div className="flex flex-col md:flex-row md:gap-6 md:items-center text-sm text-gray-600 mt-1">
                          <p className="text-gray-500">Placed on: 20/07/2025</p>
                          <p className="text-green-600 font-medium">
                            Status: Delivered
                          </p>
                          <p>Total: 1.200.000₫</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                        <button className="border border-blue-500 text-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-500 hover:text-white">
                          View order details
                        </button>
                      </div>
                    </div>

                    {/* Order Item */}
                    <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <p className="font-medium">Order #12346</p>
                        <div className="flex flex-col md:flex-row md:gap-6 md:items-center text-sm text-gray-600 mt-1">
                          <p className="text-gray-500">Placed on: 18/07/2025</p>
                          <p className="text-yellow-600 font-medium">
                            Status: Processing
                          </p>
                          <p>Total: 850.000₫</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                        <button className="border border-blue-500 text-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-500 hover:text-white">
                          View order details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Update Info */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full h-full sm:max-w-md shadow-lg sm:max-h-[550px] overflow-auto">
            <h3 className="flex text-lg font-semibold mb-4">Update Information</h3>
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center">
                <img
                  src={formData.avatar}
                  alt="Avatar Preview"
                  className="w-24 h-24 rounded-full border mb-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Phone number
                </label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
