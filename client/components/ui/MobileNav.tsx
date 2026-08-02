"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { sideBarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

function MobileNav() {
  const pathName = usePathname();
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("refreshToken"));
  }, []);

  const onMouseEnter = () => {
    if (timeOutRef.current) clearTimeout(timeOutRef.current);
    setIsOpenDropdown(true);
  };

  const onMouseLeave = () => {
    timeOutRef.current = setTimeout(() => setIsOpenDropdown(false), 150);
  };

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <div className="flex gap-x-3">
          {isLoggedIn ? (
            <div
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              className="relative rounded-full p-4 border border-red-600 cursor-pointer"
            >
              {isOpenDropdown && (
                <div className="absolute bg-slate-300 w-40 top-10 right-0 text-start rounded-lg font-semibold">
                  <div className=" flex items-center gap-2 p-3 hover:bg-slate-700 hover:text-white rounded-t-lg transition-all">
                    <FontAwesomeIcon icon={faUser} />
                    <p className=" "> Your account</p>
                  </div>
                  <hr />
                  <div className=" flex items-center gap-2 p-3 hover:bg-slate-700 hover:text-white rounded-b-lg transition-all">
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    <p className=" "> Log out</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="sign-in"
              className="p-3 font-semibold bg-blue-1 rounded-lg text-white cursor-pointer hover:opacity-75 transition-all"
            >
              <p>Sign in</p>
            </Link>
          )}

          <SheetTrigger>
            <Image
              src="/icons/hamburger.svg"
              width={36}
              height={36}
              alt="hamburger icons"
              className="cursor-pointer sm:hidden"
            />
          </SheetTrigger>
        </div>

        <SheetContent side="left" className="border-none bg-dark-1">
          <Link href="/" className="flex items-center gap-1 p-5">
            <Image
              src="/icons//logo.svg"
              width={32}
              height={32}
              alt="WeMeet Logo"
              className="max-sm:size-10"
            />
            <p className="text-[26px] font-extrabold text-white ">WeMeet</p>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-6 pt-16 text-white">
                {sideBarLinks.map((element) => {
                  const isActive = pathName === element.route;

                  return (
                    <SheetClose asChild key={element.route}>
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
                        <p className="text-lg font-semibold ">
                          {element.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}

export default MobileNav;
