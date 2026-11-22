import { localizePath, locales } from "lib/i18n";
import { getCollections, getPages, getProducts } from "lib/shopify";
import { baseUrl, validateEnvironmentVariables } from "lib/utils";
import { MetadataRoute } from "next";

type Route = {
  path: string;
  lastModified: string;
};

// One entry per locale for every route, each listing all its translations so
// search engines serve the right language.
const localize = ({ path, lastModified }: Route): MetadataRoute.Sitemap =>
  locales.map((lang) => ({
    url: `${baseUrl}${localizePath(lang, path)}`,
    lastModified,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}${localizePath(l, path)}`]),
      ),
    },
  }));

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const routesMap = ["/"].map((path) => ({
    path,
    lastModified: new Date().toISOString(),
  }));

  const collectionsPromise = getCollections().then((collections) =>
    collections.map((collection) => ({
      path: collection.path,
      lastModified: collection.updatedAt,
    })),
  );

  const productsPromise = getProducts({}).then((products) =>
    products.map((product) => ({
      path: `/product/${product.handle}`,
      lastModified: product.updatedAt,
    })),
  );

  const pagesPromise = getPages().then((pages) =>
    pages.map((page) => ({
      path: `/${page.handle}`,
      lastModified: page.updatedAt,
    })),
  );

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (
      await Promise.all([collectionsPromise, productsPromise, pagesPromise])
    ).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  return [...routesMap, ...fetchedRoutes].flatMap(localize);
}
