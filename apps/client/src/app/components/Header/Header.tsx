import React from "react";

import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import Image from "next/image";
import Link from "next/link";

import { wrapper } from "../wrapper";

const Header = () => {
  const items = [
    {
      label: "Home",
      href: "#home"
    },
    {
      label: "Funcionalidades",
      href: "#features"
    },
    {
      label: "FAQ",
      href: "#faq"
    }
  ];

  return (
    <header className={cn("flex justify-between py-4 items-center", wrapper)}>
      <div className="flex items-center gap-2">
        <Image src={"/logo.png"} width={40} height={40} alt="Logo" />
        <h2 className="text-xl text-purple-950 font-bold">Post AI</h2>
      </div>

      <nav className="flex gap-16 items-center">
        {items.map((item) => (
          <Link
            href={item.href}
            key={item.label}
            className="hover:underline font-semibold"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <Button>Log In</Button>
    </header>
  );
};

export default Header;
