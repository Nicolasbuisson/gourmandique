import { Carousel } from "components/carousel";
import { FloatingGallery } from "components/floatingGallery/floatingGallery";
import { ThreeItemGrid } from "components/grid/three-items";
import { HomeHero } from "components/home/hero";
import { Header } from "components/layout/navigation/header";
import { CtaBanner } from "components/sections/cta-banner";
import { Faq } from "components/sections/faq";
import { Stats } from "components/sections/stats";
import { getDictionary } from "dictionaries";
import { asLocale, intlLocale, localizePath, locales } from "lib/i18n";
import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const lang = asLocale((await props.params).lang);
  const dict = await getDictionary(lang);

  return {
    description: dict.metadata.home.description,
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      type: "website",
      // Repeated from the root layout: a page's `openGraph` replaces the
      // layout's rather than merging with it.
      locale: intlLocale[lang].replace("-", "_"),
    },
  };
}

// Joins the lines of a dictionary entry with <br />, for copy that breaks
// where the design wants it to.
const lines = (parts: string[]): ReactNode =>
  parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 ? <br /> : null}
      {part}
    </Fragment>
  ));

export default async function HomePage(props: Props) {
  const lang = asLocale((await props.params).lang);
  const dict = await getDictionary(lang);
  const { hero, stats, faq, cta } = dict.home;

  return (
    <>
      {/* <Navbar /> */}
      <Header
        lang={lang}
        labels={dict.header}
        nav={dict.nav}
        languageLabels={dict.languageSwitcher}
      />
      <HomeHero lang={lang} copy={hero} />
      <ThreeItemGrid lang={lang} />
      {/* Placeholder copy from the gallery tutorial. */}
      <FloatingGallery
        title={dict.home.gallery.title}
        subtitle={dict.home.gallery.subtitle}
      />
      <Carousel lang={lang} />
      {/* Mock figures until the real ones are in. */}
      <Stats
        eyebrow={stats.eyebrow}
        title={stats.title}
        items={stats.items}
        locale={intlLocale[lang]}
      />
      {/* Mock questions until the real copy is in. */}
      <Faq eyebrow={faq.eyebrow} title={faq.title} items={faq.items} />
      <CtaBanner
        body={lines(cta.body)}
        primary={{ text: cta.primary, href: localizePath(lang, "/shop") }}
        secondary={{
          text: cta.secondary,
          href: localizePath(lang, "/wedding"),
        }}
        // Placeholder until real photography lands.
        images={Array(4).fill("/images/mimiWeddingCake.jpg")}
      >
        {lines(cta.title)}
      </CtaBanner>
    </>
  );
}
