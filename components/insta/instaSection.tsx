import { config } from "config/config";
import { Insta } from "./insta";

interface IInstaSection {
  additionalTitle?: string;
}

export const InstaSection = async (props: IInstaSection) => {
  const { additionalTitle = "" } = props;

  const TOTAL_INSTA_ITEMS = 25;
  const userId = config.INSTA_USER_ID;
  const accessToken = config.INSTA_ACCESS_TOKEN;

  const fetchInstaItem = async (itemId: string): Promise<InstaItemProps> => {
    const instaItemURL = `https://graph.instagram.com/${itemId}?access_token=${accessToken}&fields=media_url,permalink,caption,media_type,thumbnail_url`;

    // instagram graph api media urls and thumbnail urls expire over time (usually within a few days)
    // must do revalidation if notice that media_url is expired for images and carousels
    // or if thumbnail_url is expired for videos
    // I can use a cache tag on the request but afterwards I have no way of invalidating it
    // invalidating a cache tag must be done in a server action which are designed for mutations
    // not for data fetching queries...
    // I could create a route handler specifically for the revalidation where I pass the tag to be revalidated as a search param
    // but this seems very contrived for minimal performance gain...
    // Should not cache the requests for individual instagram items to make sure the urls are not expired and always fresh.
    // Cannot have a static page if I do no-store to prevent caching on this request, must be in a dynamic page
    // Solution: only cache for 15 minutes, rebuild static pages every 15 minutes as well
    // to make sure we get up to date instagram data, worst case data is stale for 15 minutes
    // and user sees blank images instead of instagram one
    const res = await fetch(instaItemURL, { next: { revalidate: 900 } });
    const json = await res.json();

    const instaItem: InstaItemProps = {
      permaLink: json.permalink,
      mediaURL: json.media_url,
      mediaType: json.media_type,
      caption: json.caption,
      thumbnailURL:
        (json.media_type as MediaType) === "VIDEO" ? json.thumbnail_url : "",
    };
    return instaItem;
  };

  const fetchInstaItemList = async () => {
    if (!userId || !accessToken) {
      return;
    }

    const instaItemListURL = `https://graph.instagram.com/${userId}/media?access_token=${accessToken}`;

    // insta item list cached for 4 hours
    const res = await fetch(instaItemListURL, { next: { revalidate: 14400 } });
    const { status } = res;

    if (status === 200) {
      const { data } = await res.json();
      const itemPromises: Promise<InstaItemProps>[] = [];

      for (let i = 0; i < TOTAL_INSTA_ITEMS; i++) {
        const itemId = data?.[i]?.id;
        if (!itemId) continue;
        const instaItemPromise = fetchInstaItem(itemId);
        itemPromises.push(instaItemPromise);
      }
      const items = await Promise.all(itemPromises);
      return items;
    } else {
      return [];
    }
  };

  const instaItems = (await fetchInstaItemList()) ?? [];

  if (instaItems.length === 0) {
    return <></>;
  }

  return (
    <section
      id="instagram"
      aria-labelledby="instagram-title"
      className="bg-surface py-20 md:py-28"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6">
        {additionalTitle && (
          <p className="mb-8 text-eyebrow text-ink-subtle uppercase">
            {additionalTitle}
          </p>
        )}
        <div>
          <h2
            id="instagram-title"
            className="mb-1 w-fit font-display text-h2 text-ink"
          >
            <a
              className="block w-fit after:block after:h-px after:w-0 after:bg-accent after:transition-[width] after:duration-300 after:ease-silk after:content-[''] hover:after:w-full"
              href="https://www.instagram.com/gourmandique/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @Gourmandique
            </a>
          </h2>
          <Insta
            instaItems={instaItems}
            totalItems={instaItems.length ? TOTAL_INSTA_ITEMS : 0}
          ></Insta>
        </div>
      </div>
    </section>
  );
};
