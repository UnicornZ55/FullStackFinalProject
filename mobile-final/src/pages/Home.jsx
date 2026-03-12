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
    <div className={isDark ? "text-white" : "text-neutral-900"}>
      {/* HERO SECTION */}
      <section
        className={`flex flex-col items-center justify-center gap-6 py-16 md:flex-row md:items-end md:justify-between md:pt-20 md:pb-0 border-b ${
          isDark ? "border-white/90" : "border-black/90"
        }`}
      >
        {/* ซ้าย */}
        <img
          src={heroLeftPets}
          alt="Pets"
          className="max-h-52 object-contain md:max-h-64 md:self-end"
        />

        {/* กลาง: ข้อความ + ปุ่ม */}
        <div className="text-center px-6 md:px-20 md:pb-10">
          <p className="text-2xl leading-snug mb-6 md:text-4xl md:leading-snug">
            ตามหาของให้น้อนๆอยู่หรอ
            <br />
            ที่ <span className="font-bold">PetVerse</span> มีให้
          </p>
          <button
            onClick={handleShopClick}
            className="px-10 py-3 rounded-full bg-blue-600 text-white text-lg hover:bg-blue-700 transition"
          >
            ช๊อปเลย
          </button>
        </div>

        {/* ขวา */}
        <img
          src={heroRightPets}
          alt="Pets"
          className="max-h-52 object-contain md:max-h-64 md:self-end"
        />
      </section>

      {/* ABOUT + ASSOCIATED */}
      <section className="px-6 py-12 md:px-20 md:py-16">
        {/* About Us */}
        <div className="max-w-5xl">
          <h2 className="text-3xl font-bold mb-6 md:text-4xl">About Us</h2>

          <p className={`text-base leading-relaxed mb-3 md:text-lg ${isDark ? "text-gray-200" : "text-neutral-900"}`}>
            <span className="font-bold">Petverse</span>{" "}
            คือแพลตฟอร์มสำหรับเจ้าของสัตว์เลี้ยงที่ต้องการหาสินค้าและคำแนะนำที่เหมาะสมสำหรับสุนัขของพวกเขาในที่เดียว
            แนวคิดของ <span className="font-bold">Petverse</span>{" "}
            เกิดขึ้นจากประสบการณ์จริงของผู้พัฒนา ซึ่งเติบโตมาในครอบครัวที่เลี้ยงสุนัข
            และพบปัญหาเมื่อต้องหาซื้อของสำหรับสัตว์เลี้ยงออนไลน์
            แพลตฟอร์ม <span className="font-bold">E-commerce</span>{" "}
            ทั่วไปมักไม่ได้ออกแบบมาเพื่อการค้นหาสินค้าสำหรับสัตว์เลี้ยงโดยเฉพาะ
            ทำให้การค้นหาสินค้าที่เหมาะกับช่วงอายุหรือประเภทของสุนัขทำได้ยาก
          </p>

          <p className={`text-base leading-relaxed mb-3 md:text-lg ${isDark ? "text-gray-200" : "text-neutral-900"}`}>
            <span className="font-bold">Petverse</span>{" "}
            จึงถูกสร้างขึ้นเพื่อแก้ปัญหานี้ โดยออกแบบระบบให้เจ้าของสุนัขสามารถค้นหาสินค้าได้ง่ายขึ้น
            ผ่านระบบการค้นหาและตัวกรองที่เหมาะกับสัตว์เลี้ยง เช่น ช่วงอายุ ขนาด หรือประเภทของสุนัข
          </p>

          <p className={`text-base leading-relaxed mb-3 md:text-lg ${isDark ? "text-gray-200" : "text-neutral-900"}`}>
            นอกจากการจำหน่ายสินค้าแล้ว{" "}
            <span className="font-bold">Petverse</span>{" "}
            ยังมีระบบให้ผู้ใช้งานสามารถส่งคำขอคำแนะนำเกี่ยวกับการดูแลสัตว์เลี้ยง
            เพื่อช่วยให้เจ้าของสามารถดูแลสุนัขของตนได้อย่างเหมาะสม
          </p>

          <p className={`text-base leading-relaxed mb-3 md:text-lg ${isDark ? "text-gray-200" : "text-neutral-900"}`}>
            <span className="font-bold">Petverse</span>{" "}
            มุ่งหวังที่จะเป็นพื้นที่ที่ช่วยให้เจ้าของสัตว์เลี้ยงสามารถดูแลเพื่อนสี่ขาของพวกเขาได้ดียิ่งขึ้น
            ผ่านการเข้าถึงสินค้าและข้อมูลที่ถูกออกแบบมาเพื่อสัตว์เลี้ยงโดยเฉพาะ
          </p>
        </div>

        {/* Associated with */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-10 md:text-3xl">
            Associated with
          </h3>
          <div className="flex flex-col items-center justify-center gap-10 md:flex-row md:gap-24">
            <img
              src={hillsLogo}
              alt="Hill's Science Diet"
              className="max-h-24 object-contain"
            />
            <img
              src={royalCaninLogo}
              alt="Royal Canin"
              className="max-h-24 object-contain"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;