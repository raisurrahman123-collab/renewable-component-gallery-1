import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-16">
      <h1 className="text-[clamp(2.4rem,7vw,4.75rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
        No component at this address
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        The link may be misspelled, or the component hasn&apos;t been published yet.
      </p>
      <Link href="/" className="mt-6 inline-block underline underline-offset-4">See all components</Link>
    </section>
  );
}
