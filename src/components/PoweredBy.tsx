import Image from "next/image";

export function PoweredBy() {
  return (
    <section>
      <h2 className="text-center text-2xl font-semibold mb-14">Powered by</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 items-baseline gap-20 flex-wrap mx-auto w-fit">
        <Image src="/xl8.png" alt="Powered by" width={200} height={200} />
        <Image src="/claude.png" alt="Powered by" width={200} height={200} />
      </div>
    </section>
  );
}
