import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Listcy — the platform where lists are curated by you, and curated for you.",
};

export default function AboutUs() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-16 py-32 px-16 bg-white dark:bg-black">
        {/* Hero */}
        <section className="flex flex-col gap-6">
          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
            About Listcy
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Listcy is the home for curated lists. Whether it&apos;s your
            favourite books, the best restaurants in town, must-watch movies, or
            essential travel destinations — Listcy helps you organise, discover,
            and share the things that matter most.
          </p>
        </section>

        {/* Mission */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Our Mission
          </h2>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            We believe the best recommendations come from real people — not
            algorithms. Listcy gives everyone a platform to curate and share
            lists on any topic, and to discover lists curated by others who share
            their interests.
          </p>
        </section>

        {/* How it works */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            How It Works
          </h2>
          <ul className="flex flex-col gap-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            <li className="flex gap-3">
              <span className="font-semibold text-black dark:text-zinc-50">
                1.
              </span>
              <span>
                <strong className="text-black dark:text-zinc-50">
                  Create
                </strong>{" "}
                — Build lists on any topic you&apos;re passionate about.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-black dark:text-zinc-50">
                2.
              </span>
              <span>
                <strong className="text-black dark:text-zinc-50">Share</strong>{" "}
                — Publish your lists for others to explore and follow.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-black dark:text-zinc-50">
                3.
              </span>
              <span>
                <strong className="text-black dark:text-zinc-50">
                  Discover
                </strong>{" "}
                — Browse lists from the community and find your next favourite
                thing.
              </span>
            </li>
          </ul>
        </section>

        {/* Values */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            What We Value
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
              <h3 className="font-semibold text-black dark:text-zinc-50">
                Community First
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Everything we build starts with the people who use it.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
              <h3 className="font-semibold text-black dark:text-zinc-50">
                Simplicity
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Lists are simple by nature. We keep the experience that way too.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
              <h3 className="font-semibold text-black dark:text-zinc-50">
                Quality Over Quantity
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Curated means intentional. Every item on a list should earn its
                place.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
              <h3 className="font-semibold text-black dark:text-zinc-50">
                Open Discovery
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Great recommendations should be accessible to everyone.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
