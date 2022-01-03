import Head from "next/head";
import Intro from "../components/Intro";
import Cards from "../components/Cards";
import Footer from "../components/Footer";
import { AwesomeKurds } from "../kurds";

type HomeProps = {
  readme: string;
  contributors: string[];
};

const BUBBLE_UI_OPTIONS = {
  size: 200,
  minSize: 25,
  gutter: 20,
  provideProps: true,
  numCols: 8,
  fringeWidth: 200,
  yRadius: 130,
  xRadius: 220,
  cornerRadius: 50,
  showGuides: false,
  compact: false,
  gravitation: 5,
};

export default function Home({ readme, contributors }: HomeProps) {
  const awesomeKurds = new AwesomeKurds(readme);

  function isContributor(link: string) {
    link = link.toLowerCase();

    for (const contributor of contributors) {
      if (link.includes(contributor.toLowerCase())) {
        return true;
      }
    }

    return false;
  }

  return (
    <>
      <Head>
        <title>Awesome Kurds</title>
      </Head>
      <Intro kurds={awesomeKurds.kurds} />
      <Cards awesomeKurds={awesomeKurds} isContributor={isContributor} />
      <Footer />
    </>
  );
}

export const getStaticProps = async () => {
  const readme = await (
    await fetch(
      "https://raw.githubusercontent.com/DevelopersTree/awesome-kurds/main/README.md"
    )
  ).text();

  const contributors = (
    await (
      await fetch(
        "https://api.github.com/repos/hezhamen/awesome-kurds/contributors"
      )
    ).json()
  ).map((c: any) => c.login);

  return {
    props: { readme, contributors },
    revalidate: 3600, // seconds
    //Next.js will attempt to re-generate the page
    //when a request comes in atmost every 1 hour
  };
};
