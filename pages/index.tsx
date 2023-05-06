import { useEffect } from "react";
import useSampler from "./hooks/useSampler";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export default function Home() {
  const { statsLoading, getSampler } = useSampler();
  const { openConnectModal } = useConnectModal();

  const handleConnect = (): void => {
    openConnectModal && openConnectModal();
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black text-black gap-3">
      <div
        className="relative w-fit h-fit flex items-center justify-center cursor-pointer active:scale-95 py-2 px-3 bg-white rounded-lg"
        onClick={() => handleConnect()}
      >
        connect
      </div>
      <div
        className="relative w-fit h-fit flex items-center justify-center cursor-pointer active:scale-95 py-2 px-3 bg-white rounded-lg"
        onClick={() => getSampler()}
      >
        call sampler
      </div>
    </div>
  );
}
