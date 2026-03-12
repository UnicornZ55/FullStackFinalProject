import React, { useContext } from "react";

// ปรับ path ตามไฟล์จริงใน FinalProject/frontend/src/assets
import heroLeftPets from "../assets/pets/leftsidepet.png";
import heroRightPets from "../assets/pets/rightsidepet.png";
import hillsLogo from "../assets/Logo/HillsLogo.png";
import royalCaninLogo from "../assets/Logo/RoyalCaninLogo.png";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const Home = () => {
  const navigate = useNavigate();
  const { config } = useContext(ThemeContext);
  const isDark = config.theme === "dark";

  const handleShopClick = () => {
  navigate("/shop"); // หรือ /shop ตาม route ของคุณ
  };

  return (
    <div
      className={`relative overflow-hidden ${
        isDark ? "text-white" : "text-neutral-900"
      }`}
    >
      <div className="pointer-events-none absolute -left-20 top-16 h-56 w-56 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />

      <section className="relative mx-auto max-w-7xl px-6 pb-8 pt-10 md:px-10 md:pt-16">
        <div
          className={`grid items-center gap-8 rounded-3xl border p-6 md:grid-cols-[1fr_1.2fr_1fr] md:p-10 ${
            isDark
              ? "border-white/15 bg-white/5"
              : "border-black/10 bg-white/75 shadow-lg"
          }`}
        >
          <img
            src={heroLeftPets}
            alt="Happy pets"
            className="mx-auto max-h-52 object-contain md:max-h-72"
          />

          <div className="text-center">
            <p
              className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
                isDark ? "bg-white/10 text-orange-200" : "bg-orange-100 text-orange-700"
              }`}
            >
              Pet Lifestyle Hub
            </p>
            <h1 className="text-3xl font-black leading-tight md:text-5xl">
              ตามหาของให้น้อนๆอยู่หรอ
              <br />
              ที่ <span style={{ color: config.primaryColor }}>PetVerse</span> มีให้
            </h1>
            <p className={`mx-auto mt-4 max-w-xl text-sm md:text-base ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              รวมสินค้าและคำแนะนำสำหรับสัตว์เลี้ยงในที่เดียว ช่วยให้การดูแลเพื่อนสี่ขาเป็นเรื่องง่าย สนุก และแม่นยำยิ่งขึ้น
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleShopClick}
                className="rounded-full px-8 py-3 text-base font-bold text-white transition hover:brightness-95"
                style={{ backgroundColor: config.primaryColor }}
              >
                ช้อปเลย
              </button>
              <div className={`rounded-full border px-5 py-3 text-sm font-semibold ${isDark ? "border-white/30" : "border-black/20"}`}>
                Trusted by pet parents
              </div>
            </div>
          </div>

          <img
            src={heroRightPets}
            alt="Pet products"
            className="mx-auto max-h-52 object-contain md:max-h-72"
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-4 md:grid-cols-3 md:px-10">
        {["ค้นหาง่าย", "แนะนำตรงจุด", "ดูแลครบวงจร"].map((label, idx) => (
          <div
            key={label}
            className={`rounded-2xl border p-4 ${
              isDark ? "border-white/15 bg-white/5" : "border-black/10 bg-white"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Feature 0{idx + 1}</p>
            <p className="mt-1 text-lg font-bold">{label}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <div className={`rounded-3xl border p-7 md:p-10 ${isDark ? "border-white/15 bg-white/5" : "border-black/10 bg-white/80 shadow-md"}`}>
          <h2 className="mb-6 text-3xl font-black md:text-4xl">About Us</h2>

          <p className={`mb-4 text-base leading-relaxed md:text-lg ${isDark ? "text-gray-200" : "text-neutral-900"}`}>
            <span className="font-bold">Petverse</span> คือแพลตฟอร์มสำหรับเจ้าของสัตว์เลี้ยงที่ต้องการหาสินค้าและคำแนะนำที่เหมาะสมสำหรับสุนัขของพวกเขาในที่เดียว แนวคิดของ <span className="font-bold">Petverse</span> เกิดขึ้นจากประสบการณ์จริงของผู้พัฒนา ซึ่งเติบโตมาในครอบครัวที่เลี้ยงสุนัข และพบปัญหาเมื่อต้องหาซื้อของสำหรับสัตว์เลี้ยงออนไลน์
          </p>

          <p className={`mb-4 text-base leading-relaxed md:text-lg ${isDark ? "text-gray-200" : "text-neutral-900"}`}>
            แพลตฟอร์ม <span className="font-bold">E-commerce</span> ทั่วไปมักไม่ได้ออกแบบมาเพื่อการค้นหาสินค้าสำหรับสัตว์เลี้ยงโดยเฉพาะ ทำให้การค้นหาสินค้าที่เหมาะกับช่วงอายุหรือประเภทของสุนัขทำได้ยาก
          </p>

          <p className={`mb-4 text-base leading-relaxed md:text-lg ${isDark ? "text-gray-200" : "text-neutral-900"}`}>
            <span className="font-bold">Petverse</span> จึงถูกสร้างขึ้นเพื่อแก้ปัญหานี้ โดยออกแบบระบบให้เจ้าของสุนัขสามารถค้นหาสินค้าได้ง่ายขึ้น ผ่านระบบการค้นหาและตัวกรองที่เหมาะกับสัตว์เลี้ยง เช่น ช่วงอายุ ขนาด หรือประเภทของสุนัข
          </p>

          <p className={`text-base leading-relaxed md:text-lg ${isDark ? "text-gray-200" : "text-neutral-900"}`}>
            นอกจากการจำหน่ายสินค้าแล้ว <span className="font-bold">Petverse</span> ยังมีระบบให้ผู้ใช้งานสามารถส่งคำขอคำแนะนำเกี่ยวกับการดูแลสัตว์เลี้ยง เพื่อช่วยให้เจ้าของสามารถดูแลสุนัขของตนได้อย่างเหมาะสม
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <div className={`rounded-3xl border px-6 py-8 text-center md:px-10 ${isDark ? "border-white/15 bg-white/5" : "border-black/10 bg-white shadow-md"}`}>
          <h3 className="text-2xl font-bold md:text-3xl">Associated with</h3>
          <div className="mt-8 flex flex-col items-center justify-center gap-10 md:flex-row md:gap-24">
            <img
              src={hillsLogo}
              alt="Hill's Science Diet"
              className="max-h-24 object-contain opacity-90"
            />
            <img
              src={royalCaninLogo}
              alt="Royal Canin"
              className="max-h-24 object-contain opacity-90"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;