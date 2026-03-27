import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main>
        <Image
          src="/listcy-logo.svg"
          alt="Listcy logo"
          width={100}
          height={100}
          style={{ width: "100%", height: "100%" }}
          priority
        />
        <a href="/about-us"><p>About us</p></a>
      </main>
    </div>
  );
}
