import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { format, getDictionary } from "dictionaries";
import { defaultSort, sorting } from "lib/constants";
import { asLocale } from "lib/i18n";
import { getProducts } from "lib/shopify";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const lang = asLocale((await props.params).lang);
  const { metadata } = await getDictionary(lang);
  return metadata.shop;
}

export default async function SearchPage(props: Props) {
  const lang = asLocale((await props.params).lang);
  const { shop } = await getDictionary(lang);
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? shop.noResults
            : format(
                products.length === 1 ? shop.resultsOne : shop.resultsMany,
                { count: products.length },
              )}{" "}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems lang={lang} products={products} />
        </Grid>
      ) : null}
    </>
  );
}
