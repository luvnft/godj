"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { logout } from "./logout/actions";
import { deleteAccount } from "./delete/actions";
import DemoClientComponent from "./components/DemoClientComponent";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      if (data?.user) {
        setUser(data.user);
      } else {
        console.log("No user found.");
      }
    }
    getUser();
  }, []);

  const handleLogout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await logout();
      router.push("/"); // Redirect to home or another route after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDeleteAccount = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (user) {
      try {
        await deleteAccount(user.id);
        router.push("/"); // Redirect to home or another route after account deletion
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-dvh p-24 mt-4">
      <DemoClientComponent />
      {user?.is_anonymous ? (
        <form onSubmit={handleDeleteAccount}>
          <button
            className="bg-red-500 text-white hover:bg-red-700 font-bold py-2 px-4 rounded"
            type="submit"
          >
            Delete Account
          </button>
        </form>
      ) : (
        <form onSubmit={handleLogout}>
          <button
            className="bg-realBlue text-white hover:bg-yellow-500 hover:text-black font-bold py-2 px-4 rounded"
            type="submit"
          >
            Logout
          </button>
        </form>
      )}
    </main>
  );
}
