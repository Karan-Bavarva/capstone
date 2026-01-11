import React from "react";
import {
  AiFillFacebook,
  AiFillTwitterSquare,
  AiFillInstagram,
} from "react-icons/ai";

const Footer = () => {
  return (
    <footer
      className="py-8 text-white"
      style={{
        background:
          "linear-gradient(135deg, #1E3A8A 0%, #0D9488 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto text-center px-4">
        <p className="text-sm md:text-base leading-relaxed">
          &copy; {new Date().getFullYear()} Edu-Platform. All rights
          reserved.
          <a
            href="#"
            className="font-semibold underline hover:text-green-200 transition"
          >
            Team EduPlatform
          </a>
        </p>

        {/* Social Icons */}
        {/* <div className="flex justify-center gap-6 mt-4 text-2xl">
          <a
            href="#"
            className="hover:text-green-200 transition"
            aria-label="Facebook"
          >
            <AiFillFacebook />
          </a>

          <a
            href="#"
            className="hover:text-green-200 transition"
            aria-label="Twitter"
          >
            <AiFillTwitterSquare />
          </a>

          <a
            href="#"
            className="hover:text-green-200 transition"
            aria-label="Instagram"
          >
            <AiFillInstagram />
          </a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
