import { SiEventbrite } from "react-icons/si";

export function Footer() {
  return (
    <div className="w-100 p-10 flex flex-col md:flex-row justify-between bg-black text-zinc-100">
      <SiEventbrite className="h-16 w-auto" />
      <nav className="flex space-x-4 mt-2 md:mt-0">
        <a href="/" className="hover:underline">
          Home
        </a>
        <a href="/about" className="hover:underline">
          About
        </a>
        <a href="/contact" className="hover:underline">
          Contact
        </a>
      </nav>
      <p className="mt-2 md:mt-0 text-sm text-gray-400">
        © 2024 Eventful. All rights reserved.
      </p>
    </div>
  );
}
