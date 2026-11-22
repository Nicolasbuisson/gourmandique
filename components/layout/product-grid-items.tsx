import Grid from "components/grid";
import { GridTileImage } from "components/grid/tile";
import { getLocale } from "lib/get-locale";
import { localizePath } from "lib/i18n";
import { Product } from "lib/shopify/types";
import Link from "next/link";

export default async function ProductGridItems({
  products,
}: {
  products: Product[];
}) {
  const lang = await getLocale();
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.handle} className="animate-fadeIn">
          <Link
            className="relative inline-block h-full w-full"
            href={localizePath(lang, `/product/${product.handle}`)}
            prefetch={true}
          >
            <GridTileImage
              alt={product.title}
              label={{
                title: product.title,
                amount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode,
              }}
              src={product.featuredImage?.url}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
