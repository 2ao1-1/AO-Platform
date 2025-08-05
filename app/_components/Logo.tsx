import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/images/favicon.png"
      alt="logo"
      className="w-5 h-5"
      width={16}
      height={16}
    />
  );
}
