import React from "react";
import Image from "next/image";

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen mt-12">
      <Image
        src="/assets/images/loading.svg"
        alt="loading"
        width={80}
        height={80}
      />
    </div>
  );
};
