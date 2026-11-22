import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { format, getDictionary } from "dictionaries";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/shopify";
import type { Metadata } from "next";

type Props = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getDictionary();
  return metadata.shop;
}

export default async function SearchPage(props: Props) {
  const { shop } = await getDictionary();
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
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
