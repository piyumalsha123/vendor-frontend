import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const VendorDashboard = () => {

  const [loading, setLoading] = useState(true);

  const [isVendor, setIsVendor] = useState(false);

  const [hasStore, setHasStore] = useState(false);

  const [store, setStore] = useState<any>(null);

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const categories = [
    "Crafts",
    "Clothing",
    "Food",
    "Electronics",
    "Beauty",
    "Home Decor"
  ];

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  const initDashboard = async () => {

    try {

      setLoading(true);

      // ==========================================
      // USER DATA
      // ==========================================

      const userDataString =
        localStorage.getItem("user");

      if (!userDataString) {
        setLoading(false);
        return;
      }

      const userData =
        JSON.parse(userDataString);

      const roles =
        userData?.data?.roles ||
        userData?.roles ||
        [];

      // ==========================================
      // CHECK VENDOR
      // ==========================================

      if (roles.includes("VENDOR")) {

        setIsVendor(true);

      } else {

        // normal user
        setIsVendor(false);

        setLoading(false);

        return;
      }

      // ==========================================
      // TOKEN
      // ==========================================

      const token =
        localStorage.getItem("ACCESS_TOKEN");

      if (!token) {
        setLoading(false);
        return;
      }

      // ==========================================
      // CHECK STORE
      // ==========================================

      const res = await axios.get(
        `${API}/store/check`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data?.hasStore) {

        setHasStore(true);

        setStore(res.data.store);

      } else {

        setHasStore(false);
      }

    } catch (err) {

      console.error(
        "Dashboard init error:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // CREATE STORE
  // =====================================================

  const createStore = async () => {

    try {

      const token =
        localStorage.getItem("ACCESS_TOKEN");

      if (!token) return;

      const res = await axios.post(
        `${API}/store/create`,
        {
          category: selectedCategory
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setHasStore(true);

      setStore(res.data.store);

    } catch (err) {

      console.error(
        "Create store error:",
        err
      );
    }
  };

  // =====================================================
  // USE EFFECT
  // =====================================================

  useEffect(() => {

    initDashboard();

  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div>
        Loading...
      </div>
    );
  }

  // =====================================================
  // NORMAL USER DASHBOARD
  // =====================================================

  if (!isVendor) {

    return (
      <div className="p-6">

        <h1 className="text-2xl font-bold">
          User Dashboard
        </h1>

        <p>
          Browse and buy products.
        </p>

      </div>
    );
  }

  // =====================================================
  // VENDOR CATEGORY SELECTION
  // =====================================================

  if (isVendor && !hasStore) {

    return (

      <div className="p-6">

        <h1 className="text-2xl font-bold mb-4">
          Select Store Category
        </h1>

        <select
          className="border p-2 rounded w-full"
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value
            )
          }
        >

          <option value="">
            Select Category
          </option>

          {categories.map((cat) => (

            <option
              key={cat}
              value={cat}
            >
              {cat}
            </option>

          ))}

        </select>

        <button
          onClick={createStore}
          className="mt-4 px-4 py-2 bg-black text-white rounded"
        >
          Continue
        </button>

      </div>
    );
  }

  // =====================================================
  // VENDOR DASHBOARD
  // =====================================================

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold">
        Vendor Dashboard
      </h1>

      <div className="mt-4">

        <p>
          <strong>Store:</strong>{" "}
          {store?.storeName}
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {store?.category}
        </p>

      </div>

    </div>
  );
};

export default VendorDashboard;