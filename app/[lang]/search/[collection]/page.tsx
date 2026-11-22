import { getCollection, getCollectionProducts } from "lib/shopify";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { format, getDictionary } from "dictionaries";
import { defaultSort, sorting } from "lib/constants";
import { asLocale } from "lib/i18n";

export async function generateMetadata(props: {
  params: Promise<{ lang: string; collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { shop } = await getDictionary(asLocale(params.lang));
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description ||
      collection.description ||
      format(shop.collectionProducts, { title: collection.title }),
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ lang: string; collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { shop } = await getDictionary(asLocale(params.lang));
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getCollectionProducts({
    collection: params.collection,
    sortKey,
    reverse,
  });

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{shop.emptyCollection}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems lang={asLocale(params.lang)} products={products} />
        </Grid>
      )}
    </section>
  );
}
