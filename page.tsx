import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getItem, registry } from "@/registry";
import { CodeTabs } from "@/components/CodeTabs";

type Props = { params: Promise<{ slug: string }> };

// One static page per component, generated at build time
export function generateStaticParams() {
  return registry.map((item) => ({ slug: item.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getItem((await params).slug);
  return item ? { title: item.name, description: item.description } : {};
}

const link = "underline-offset-4 hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf";

export default async function ComponentPage({ params }: Props) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) notFound();

  // Read the real component file so the source shown always matches what runs
  const source = await readFile(path.join(process.cwd(), "registry", item.slug, item.sourceFile), "utf8");

  const index = registry.indexOf(item);
  const prev = registry[index - 1];
  const next = registry[index + 1];

  return (
    <>
      <Link href="/" className={`mt-4 inline-block text-muted ${link}`}>All components</Link>

      <header className="pb-8 pt-6 sm:pb-10">
        <span className="text-[0.95rem] text-muted">No. {index + 1}, week {item.week}, {item.type}, added {item.added}</span>
        <h1 className="mt-1 text-[clamp(2.4rem,7vw,4.75rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
          {item.name}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted sm:text-xl">{item.description}</p>
      </header>

      {/* Preview and code side by side on large screens, stacked below */}
      <div className="grid gap-5 lg:grid-cols-2">
        <section aria-label="Live preview" className="flex min-w-0 items-center rounded-2xl border border-line bg-surface p-3 sm:p-4">
          <item.Demo />
        </section>
        <CodeTabs
          tabs={[
            { label: "Usage", code: item.usage },
            { label: item.sourceFile, code: source },
          ]}
        />
      </div>

      <h2 className="mb-4 mt-12 text-2xl font-semibold">Props</h2>
      {/* Phones: one block per prop */}
      <dl className="divide-y divide-line rounded-2xl border border-line sm:hidden">
        {item.props.map((p) => (
          <div key={p.name} className="p-4">
            <dt className="font-mono text-sm font-semibold">{p.name}</dt>
            <dd className="mt-1 font-mono text-sm text-muted">
              {p.type}
              {p.default && <> = {p.default}</>}
            </dd>
            <dd className="mt-2">{p.description}</dd>
          </div>
        ))}
      </dl>

      {/* Tablet and up: table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-line sm:block">
        <table className="w-full min-w-[36rem] text-left text-[0.95rem]">
          <thead className="bg-surface">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Prop</th>
              <th scope="col" className="px-4 py-3 font-semibold">Type</th>
              <th scope="col" className="px-4 py-3 font-semibold">Default</th>
              <th scope="col" className="px-4 py-3 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {item.props.map((p) => (
              <tr key={p.name} className="border-t border-line align-top">
                <td className="px-4 py-3 font-mono text-sm">{p.name}</td>
                <td className="px-4 py-3 font-mono text-sm text-muted">{p.type}</td>
                <td className="px-4 py-3 font-mono text-sm text-muted">{p.default ?? "none"}</td>
                <td className="px-4 py-3">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav aria-label="More components" className="mt-14 flex flex-col justify-between gap-4 border-t border-line pt-6 sm:flex-row">
        {prev ? <Link href={`/components/${prev.slug}`} className={link}>Previous: {prev.name}</Link> : <span />}
        {next ? <Link href={`/components/${next.slug}`} className={link}>Next: {next.name}</Link> : <span />}
      </nav>
    </>
  );
}
