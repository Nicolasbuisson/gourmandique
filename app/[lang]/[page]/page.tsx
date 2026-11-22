import type { Metadata } from "next";

import Prose from "components/prose";
import { format, getDictionary } from "dictionaries";
import { asLocale, intlLocale } from "lib/i18n";
import { getPage } from "lib/shopify";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ lang: string; page: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = await getPage(params.page);

  if (!page) return notFound();

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: "article",
    },
  };
}

export default async function Page(props: {
  params: Promise<{ lang: string; page: string }>;
}) {
  const params = await props.params;
  const dict = await getDictionary(asLocale(params.lang));
  const page = await getPage(params.page);

  if (!page) return notFound();

  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>
      <Prose className="mb-8" html={page.body} />
      <p className="text-sm italic">
        {format(dict.page.lastUpdated, {
          date: new Intl.DateTimeFormat(intlLocale[asLocale(params.lang)], {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(new Date(page.updatedAt)),
        })}
      </p>
    </>
  );
}
