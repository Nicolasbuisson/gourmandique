import Collections from "components/layout/search/collections";
import FilterList from "components/layout/search/filter";
import { getDictionary } from "dictionaries";
import { sorting } from "lib/constants";
import { asLocale } from "lib/i18n";
import ChildrenWrapper from "./children-wrapper";
import { Suspense } from "react";

export default async function SearchLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { children } = props;
  const lang = asLocale((await props.params).lang);
  const { shop } = await getDictionary(lang);
  const sortList = sorting.map((item) => ({
    ...item,
    title: shop.sort[(item.slug ?? "relevance") as keyof typeof shop.sort],
  }));

  return (
    <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col gap-8 px-4 pb-4 text-black md:flex-row">
      <div className="order-first w-full flex-none md:max-w-[125px]">
        <Collections lang={lang} title={shop.collections} allLabel={shop.all} />
      </div>
      <div className="order-last min-h-screen w-full md:order-none">
        <Suspense fallback={null}>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </Suspense>
      </div>
      <div className="order-none flex-none md:order-last md:w-[125px]">
        <FilterList list={sortList} title={shop.sortBy} />
      </div>
    </div>
  );
}
