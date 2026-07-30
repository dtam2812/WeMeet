"use client";
import { sideBarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SideBar = () => {
  const pathName = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
      <div className="flex flex- flex-col gap-6">
        {sideBarLinks.map((element) => {
          const isActive = pathName === element.route;

          return (
            <Link
              href={element.route}
              key={element.label}
              className={cn(
                "flex gap-4 items-center p-4 rounded-lg justify-start",
                { "bg-blue-1": isActive },
              )}
            >
              <Image
                src={element.imgUrl}
                alt={element.label}
                width={24}
                height={24}
              />
              <p className="text-lg font-semibold max-lg:hidden">
                {element.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SideBar;
