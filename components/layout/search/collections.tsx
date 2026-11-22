import clsx from "clsx";
import { Suspense } from "react";

import { getDictionary } from "dictionaries";
import { getLocale } from "lib/get-locale";
import { localizePath } from "lib/i18n";
import { getCollections } from "lib/shopify";
import FilterList from "./filter";

async function CollectionList() {
  const lang = await getLocale();
  const { shop } = await getDictionary();
  const collections = await getCollections();
  const list = collections.map((collection) => ({
    // The synthetic "All" entry isn't a Shopify collection, so it has no
    // translation there.
    title: collection.handle === "" ? shop.all : collection.title,
    path: localizePath(lang, collection.path),
  }));
  return <FilterList list={list} title={shop.collections} />;
}

const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded-sm";
const activeAndTitles = "bg-neutral-800 dark:bg-neutral-300";
const items = "bg-neutral-400 dark:bg-neutral-700";

export default function Collections() {
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
      <CollectionList />
    </Suspense>
  );
}
