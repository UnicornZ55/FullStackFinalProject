import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const LINKS = ["GitHub", "Facebook", "LinkedIn"];

function getRandomHexColor() {
  const hex = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");
  return `#${hex}`;
}

export default function LinkInBio() {
  const [borderColor, setBorderColor] = useState("#2563eb");
  const user = useAuthStore((s) => s.user);

  const displayName =
    user?.username ||
    user?.user?.username ||
    user?.name ||
    user?.user?.name ||
    user?.email?.split("@")[0] ||
    "guest";

  const handlePress = (platform) => {
    setBorderColor(getRandomHexColor());
    alert(platform);
  };

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-lg text-center">
        <img
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400&auto=format&fit=crop"
          alt="Profile"
          className="mx-auto h-[150px] w-[150px] rounded-full border-4 object-cover"
          style={{ borderColor }}
        />

        <h1 className="mt-5 text-2xl font-bold">{displayName}</h1>
        <p className="mt-1 text-sm text-gray-600">Personal Link-in-Bio</p>

        <div className="mt-6 flex flex-col gap-3">
          {LINKS.map((platform) => (
            <div key={platform} className="-m-1 p-1">
              <button
                type="button"
                onClick={() => handlePress(platform)}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                {platform}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}