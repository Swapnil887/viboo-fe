import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "Boys", href: "/collections/boys" },
      { label: "Girls", href: "/collections/girls" },
      { label: "Clothing", href: "/collections/clothing" },
      { label: "Accessories", href: "/collections/accessories" },
      { label: "New Arrivals", href: "/collections/new-arrivals" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Return Policy", href: "/return-policy" },
      { label: "Track Order", href: "/track-order" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-12 bg-[#F5EDE4]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-3xl font-bold tracking-tight text-[#292521]"
            >
              viboo<span className="text-[#B77950]">.</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-[#756B63]">
              Making childhood more colourful, one little outfit at a time.
              Discover comfortable, playful and stylish clothing made for little
              adventures.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="https://www.instagram.com/"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#55483F] transition hover:bg-[#B77950] hover:text-white"
              >
                <FaInstagram />
              </Link>

              <Link
                href="https://www.facebook.com/"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#55483F] transition hover:bg-[#B77950] hover:text-white"
              >
                <FaFacebook className="h-4 w-4" />
              </Link>

              <Link
                href="https://www.youtube.com/"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#55483F] transition hover:bg-[#B77950] hover:text-white"
              >
                <FaYoutube className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold text-[#292521]">
                {section.title}
              </h3>

              <ul className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#756B63] transition hover:text-[#B77950]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 flex flex-col gap-4 border-t border-[#DDCBB9] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#756B63]">
            © {new Date().getFullYear()} Viboo. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-xs text-[#756B63]">
            Made with love for little ones
            <span className="text-[#B77950]">♥</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
