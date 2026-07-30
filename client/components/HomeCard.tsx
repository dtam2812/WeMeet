import Image from "next/image";
import React from "react";

type HomeCardProps = {
  className: string;
  title: string;
  description: string;
  img: string;
  handleClick: () => void;
};

const HomeCard = ({
  className,
  img,
  title,
  description,
  handleClick,
}: HomeCardProps) => {
  return (
    <div
      onClick={handleClick}
      className={`${className} px-4 py-6 flex flex-col justify-between w-full xl:max-w-96
      min-h-65 rounded-[14px] cursor-pointer`}
    >
      <div className="flex-center glassmorphism size-12 rounded-[10px]">
        <Image src={img} alt="meeting" width={27} height={27} />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-lg font-normal">{description}</p>
      </div>
    </div>
  );
};

export default HomeCard;
