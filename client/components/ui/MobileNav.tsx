"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { sideBarLinks } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { api } from "@/common";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub: string;
  email: string;
  name: string;
};

function MobileNav() {
  const pathName = usePathname();
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<JwtPayload | null>(null);

  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      setIsLoggedIn(true);
    }

    if (accessToken) {
      try {
        const payload = jwtDecode<JwtPayload>(accessToken);
        setUser(payload);
      } catch {
        setUser(null);
      }
    }
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const onMouseEnter = () => {
    if (timeOutRef.current) clearTimeout(timeOutRef.current);
    setIsOpenDropdown(true);
  };

  const onMouseLeave = () => {
    timeOutRef.current = setTimeout(() => setIsOpenDropdown(false), 150);
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      // Dù API lỗi, vẫn tiếp tục xóa token phía client bên dưới —
      // không để user bị "kẹt" ở trạng thái tưởng đã đăng nhập
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsLoggedIn(false);
      setUser(null);
      router.push("/sign-in");
    }
  };

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <div className="flex gap-x-3">
          {isLoggedIn ? (
            <div
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              className="relative w-10 h-10 rounded-full bg-blue-1 text-white flex items-center justify-center font-semibold cursor-pointer"
            >
              {getInitials(user?.name)}

              {isOpenDropdown && (
                <div className="absolute bg-slate-300 w-52 top-12 right-0 text-start rounded-lg font-semibold text-black">
                  <div className="p-3 border-b border-slate-400">
                    <p className="text-sm font-semibold ">{user?.name}</p>
                    <p className="text-xs text-slate-600 ">{user?.email}</p>
                  </div>
                  <div className="flex items-center gap-2 p-3 hover:bg-slate-700 hover:text-white transition-all">
                    <FontAwesomeIcon icon={faUser} />
                    <p>Your account</p>
                  </div>
                  <hr />
                  <div
                    onClick={handleLogout}
                    className="flex items-center gap-2 p-3 hover:bg-slate-700 hover:text-white rounded-b-lg transition-all cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    <p>Log out</p>
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
