import React from "react";
import Link from "next/link";

const footerSections = [
  {
    title: "Services",
    links: [
      { href: "/service", label: "Therapy" },
      { href: "/service", label: "Counseling" },
      { href: "/service", label: "Support Groups" },
      { href: "/service", label: "Crisis Helpline" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/resources", label: "Articles" },
      { href: "/resources", label: "Guides" },
      { href: "/resources", label: "Self Assessments" },
      { href: "/education", label: "Education Center" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/about", label: "Careers" },
      { href: "/about", label: "Contact" },
      { href: "/about", label: "Privacy Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-bg-base border-t border-zinc-200/60 py-16">
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C12 2 14 6 14 8C14 10 13 12 12 12C11 12 10 10 10 8C10 6 12 2 12 2Z" fill="#1a1a1a"/>
                <path d="M12 22C12 22 14 18 14 16C14 14 13 12 12 12C11 12 10 14 10 16C10 18 12 22 12 22Z" fill="#1a1a1a"/>
                <path d="M2 12C2 12 6 10 8 10C10 10 12 11 12 12C12 13 10 14 8 14C6 14 2 12 2 12Z" fill="#1a1a1a"/>
                <path d="M22 12C22 12 18 10 16 10C14 10 12 11 12 12C12 13 14 14 16 14C18 14 22 12 22 12Z" fill="#1a1a1a"/>
              </svg>
              <span className="font-display text-base font-semibold text-[#1a1a1a]">mėntality</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
              Information and resources to help you manage your mental wellbeing.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-200/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-zinc-400">
            &copy; 2024 mėntality. All rights reserved.
          </p>
          <div className="flex gap-6 text-[11px] text-zinc-400">
            <Link href="/about" className="hover:text-zinc-900 transition-colors">
              Privacy
            </Link>
            <Link href="/about" className="hover:text-zinc-900 transition-colors">
              Terms
            </Link>
            <Link href="/help" className="hover:text-zinc-900 transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
