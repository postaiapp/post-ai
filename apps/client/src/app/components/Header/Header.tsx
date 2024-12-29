import React from "react";

import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import Image from "next/image";

import { wrapper } from "../wrapper";

const Header = () => {
  return (
    <header className={cn("flex justify-between py-4 items-center", wrapper)}>
      <div className="flex items-center gap-2">
        <Image src={"/logo.png"} width={40} height={40} alt="Logo" />
        <h2 className="text-xl text-purple-950 font-bold">Post AI</h2>
      </div>

      {/* We can change this to "Enter" when the user is already logged in */}
      <Button>Log In</Button>
    </header>
  );
};

export default Header;
