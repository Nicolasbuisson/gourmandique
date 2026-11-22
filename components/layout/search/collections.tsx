import clsx from "clsx";
import { Suspense } from "react";

import { localizePath, type Locale } from "lib/i18n";
import { getCollections } from "lib/shopify";
import FilterList from "./filter";

type CollectionsProps = {
  lang: Locale;
  title: string;
  // Label for the synthetic "All" entry, which isn't a Shopify collection.
  allLabel: string;
};

async function CollectionList({ lang, title, allLabel }: CollectionsProps) {
  const collections = await getCollections();
  const list = collections.map((collection) => ({
    title: collection.handle === "" ? allLabel : collection.title,
    path: localizePath(lang, collection.path),
  }));
  return <FilterList list={list} title={title} />;
}

const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded-sm";
const activeAndTitles = "bg-neutral-800 dark:bg-neutral-300";
const items = "bg-neutral-400 dark:bg-neutral-700";

export default function Collections(props: CollectionsProps) {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <CollectionList {...props} />
    </Suspense>
  );
}
