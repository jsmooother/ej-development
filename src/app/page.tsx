import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import AnimatedWordmark from "@/components/AnimatedWordmark";
import { getBlogPosts, getProperties, getInstagramPosts } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch data from database
  const allBlogPosts = await getBlogPosts();
  const allProperties = await getProperties();
  const allInstagramPosts = await getInstagramPosts();

  // Filter published items
  const blogPosts = allBlogPosts.filter((post) => post.published).slice(0, 6);
  const properties = allProperties.filter((prop) => prop.published).slice(0, 6);
  const instagramPosts = allInstagramPosts.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <SiteHeader />

      <main>
        {/* Hero Title */}
        <section className="border-b border-black/10 bg-white py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <AnimatedWordmark text="COSTA DEL SOL DEVELOPMENTS" className="wordmark--large" />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="border-b border-black/10 bg-white py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center">
              <h2 className="mb-8 text-xs font-semibold uppercase tracking-[0.3em] text-[#c4a676]">
                About
              </h2>
              <div className="space-y-6 text-[#1a1a1a]">
                <p className="text-lg leading-relaxed md:text-xl md:leading-relaxed">
                  We create homes where every square meter is optimized with precision. Through smart layouts and a natural flow between rooms, we design spaces that feel effortless, harmonious, and perfectly balanced.
                </p>
                <p className="text-lg leading-relaxed md:text-xl md:leading-relaxed">
                  Our strength lies in tailoring every detail – from intelligent storage solutions to seamless integrations – ensuring that function and elegance go hand in hand.
                </p>
                <p className="text-lg leading-relaxed md:text-xl md:leading-relaxed">
                  With a foundation of timeless design, refined by a modern touch, we work with warm tones and natural materials to bring a sense of sophistication and comfort. The result is homes that radiate understated luxury while remaining inviting, personal, and truly livable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Masonry Grid - Blog Posts & Properties Mixed */}
        <section id="properties" className="mx-auto max-w-7xl px-6 py-12">
          {blogPosts.length === 0 && properties.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-[#1a1a1a]/60">
                No content available yet. Please add blog posts and properties from the{" "}
                <Link href="/admin" className="text-[#c4a676] underline">
                  admin dashboard
                </Link>
                .
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* First Column */}
                <div className="space-y-6">
                  {blogPosts[0] && (
                    <article className="group cursor-pointer">
                      <Link href={`/blog/${blogPosts[0].id}`}>
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                          <Image
                            src={blogPosts[0].image}
                            alt={blogPosts[0].title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="mt-4 space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c4a676]">
                            {blogPosts[0].category}
                          </p>
                          <h3 className="font-serif text-2xl font-normal leading-tight text-[#1a1a1a] transition group-hover:text-[#c4a676]">
                            {blogPosts[0].title}
                          </h3>
                          <p className="text-sm leading-relaxed text-[#1a1a1a]/70">
                            {blogPosts[0].excerpt}
                          </p>
            </div>
            </Link>
                    </article>
                  )}

                  {properties[0] && (
                    <article className="group cursor-pointer">
                      <Link href={`#property-${properties[0].id}`}>
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                          <Image
                            src={properties[0].image}
                            alt={`Property ${properties[0].size}`}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute bottom-4 right-4 space-y-1 text-right text-white drop-shadow-lg">
                            <p className="text-3xl font-light">{properties[0].size}</p>
                            <p className="text-sm tracking-wider">{properties[0].rooms}</p>
                          </div>
          </div>
                      </Link>
                    </article>
                  )}

                  {blogPosts[3] && (
                    <article className="group cursor-pointer">
                      <Link href={`/blog/${blogPosts[3].id}`}>
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                            src={blogPosts[3].image}
                            alt={blogPosts[3].title}
                    fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                  />
                    </div>
                        <div className="mt-4 space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c4a676]">
                            {blogPosts[3].category}
                          </p>
                          <h3 className="font-serif text-2xl font-normal leading-tight text-[#1a1a1a] transition group-hover:text-[#c4a676]">
                            {blogPosts[3].title}
                          </h3>
                          <p className="text-sm leading-relaxed text-[#1a1a1a]/70">
                            {blogPosts[3].excerpt}
                          </p>
                  </div>
                      </Link>
                    </article>
                  )}
                </div>

                {/* Second Column */}
                <div className="space-y-6">
                  {properties[1] && (
                    <article className="group cursor-pointer">
                      <Link href={`#property-${properties[1].id}`}>
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                          <Image
                            src={properties[1].image}
                            alt={`Property ${properties[1].size}`}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute bottom-4 right-4 space-y-1 text-right text-white drop-shadow-lg">
                            <p className="text-4xl font-light">{properties[1].size}</p>
                            <p className="text-sm tracking-wider">{properties[1].rooms}</p>
                          </div>
                        </div>
                      </Link>
                    </article>
                  )}

                  {blogPosts[1] && (
                    <article className="group cursor-pointer">
                      <Link href={`/blog/${blogPosts[1].id}`}>
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                          <Image
                            src={blogPosts[1].image}
                            alt={blogPosts[1].title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="mt-4 space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c4a676]">
                            {blogPosts[1].category}
                          </p>
                          <h3 className="font-serif text-2xl font-normal leading-tight text-[#1a1a1a] transition group-hover:text-[#c4a676]">
                            {blogPosts[1].title}
                          </h3>
                          <p className="text-sm leading-relaxed text-[#1a1a1a]/70">
                            {blogPosts[1].excerpt}
                          </p>
                        </div>
                      </Link>
                    </article>
                  )}

                  {properties[3] && (
                    <article className="group cursor-pointer">
                      <Link href={`#property-${properties[3].id}`}>
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                          <Image
                            src={properties[3].image}
                            alt={`Property ${properties[3].size}`}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute bottom-4 right-4 space-y-1 text-right text-white drop-shadow-lg">
                            <p className="text-3xl font-light">{properties[3].size}</p>
                            <p className="text-sm tracking-wider">{properties[3].rooms}</p>
                      </div>
                  </div>
                      </Link>
                    </article>
                  )}
                </div>

                {/* Third Column */}
                <div className="space-y-6">
                  {blogPosts[2] && (
                    <article className="group cursor-pointer">
                      <Link href={`/blog/${blogPosts[2].id}`}>
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                          <Image
                            src={blogPosts[2].image}
                            alt={blogPosts[2].title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="mt-4 space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c4a676]">
                            {blogPosts[2].category}
                          </p>
                          <h3 className="font-serif text-2xl font-normal leading-tight text-[#1a1a1a] transition group-hover:text-[#c4a676]">
                            {blogPosts[2].title}
                          </h3>
                          <p className="text-sm leading-relaxed text-[#1a1a1a]/70">
                            {blogPosts[2].excerpt}
                          </p>
                        </div>
                      </Link>
                    </article>
                  )}

                  {properties[2] && (
                    <article className="group cursor-pointer">
                      <Link href={`#property-${properties[2].id}`}>
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                          <Image
                            src={properties[2].image}
                            alt={`Property ${properties[2].size}`}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute bottom-4 right-4 space-y-1 text-right text-white drop-shadow-lg">
                            <p className="text-3xl font-light">{properties[2].size}</p>
                            <p className="text-sm tracking-wider">{properties[2].rooms}</p>
                          </div>
                        </div>
                      </Link>
              </article>
                  )}

                  {properties[4] && (
                    <article className="group cursor-pointer">
                      <Link href={`#property-${properties[4].id}`}>
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                          <Image
                            src={properties[4].image}
                            alt={`Property ${properties[4].size}`}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute bottom-4 right-4 space-y-1 text-right text-white drop-shadow-lg">
                            <p className="text-3xl font-light">{properties[4].size}</p>
                            <p className="text-sm tracking-wider">{properties[4].rooms}</p>
                          </div>
          </div>
                      </Link>
                    </article>
                  )}

                  {blogPosts[4] && (
                    <article className="group cursor-pointer">
                      <Link href={`/blog/${blogPosts[4].id}`}>
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                          <Image
                            src={blogPosts[4].image}
                            alt={blogPosts[4].title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="mt-4 space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c4a676]">
                            {blogPosts[4].category}
                          </p>
                          <h3 className="font-serif text-2xl font-normal leading-tight text-[#1a1a1a] transition group-hover:text-[#c4a676]">
                            {blogPosts[4].title}
                          </h3>
                          <p className="text-sm leading-relaxed text-[#1a1a1a]/70">
                            {blogPosts[4].excerpt}
                          </p>
                        </div>
                      </Link>
                    </article>
                  )}
          </div>
              </div>

              {/* Additional Row */}
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogPosts[5] && (
                  <article className="group cursor-pointer">
                    <Link href={`/blog/${blogPosts[5].id}`}>
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <Image
                          src={blogPosts[5].image}
                          alt={blogPosts[5].title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c4a676]">
                          {blogPosts[5].category}
                        </p>
                        <h3 className="font-serif text-2xl font-normal leading-tight text-[#1a1a1a] transition group-hover:text-[#c4a676]">
                          {blogPosts[5].title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[#1a1a1a]/70">
                          {blogPosts[5].excerpt}
                        </p>
                      </div>
                    </Link>
                  </article>
                )}

                {properties[5] && (
                  <article className="group cursor-pointer">
                    <Link href={`#property-${properties[5].id}`}>
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <Image
                          src={properties[5].image}
                          alt={`Property ${properties[5].size}`}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-4 right-4 space-y-1 text-right text-white drop-shadow-lg">
                          <p className="text-3xl font-light">{properties[5].size}</p>
                          <p className="text-sm tracking-wider">{properties[5].rooms}</p>
                        </div>
                      </div>
                    </Link>
                  </article>
                )}
          </div>
            </>
          )}
        </section>

        {/* Instagram Feed Section */}
        <section id="instagram" className="border-t border-black/10 bg-white py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-light tracking-[0.15em] text-[#1a1a1a]">
                INSTAGRAM
              </h2>
              <p className="mt-2 text-sm text-[#1a1a1a]/60">@ejdevelopment</p>
            </div>
            {instagramPosts.length > 0 ? (
              <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-6">
                {instagramPosts.map((post) => (
                  <a
                    key={post.id}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={post.image}
                      alt={post.caption}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-[#1a1a1a]/60">
                No Instagram posts yet. Add them from the{" "}
                <Link href="/admin/instagram" className="text-[#c4a676] underline">
                  admin dashboard
                </Link>
                .
              </p>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="border-t border-black/10 bg-[#fafafa] py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-lg bg-white p-12 shadow-sm">
              <div className="text-center">
                <h2 className="text-2xl font-light tracking-[0.1em] text-[#1a1a1a]">
                  Interested in Costa del Sol property development?
                </h2>
                <p className="mt-4 text-[#1a1a1a]/70">
                  We at EJ Development deliver more Costa del Sol residences than any
                  other developer. Leave your contact details and one of our
                  experienced consultants will be in touch.
                </p>
              </div>
              <form className="mt-8 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Name"
                    className="rounded border border-black/20 bg-white px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    className="rounded border border-black/20 bg-white px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="tel"
                    placeholder="Phone"
                    className="rounded border border-black/20 bg-white px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="rounded border border-black/20 bg-white px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded bg-[#1a1a1a] px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#c4a676]"
                >
                  Contact me
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#1a1a1a]">
                Office
              </h3>
              <address className="not-italic text-sm text-[#1a1a1a]/70">
                <p>Avenida Ricardo Soriano 72</p>
                <p>29601 Marbella</p>
                <p>Costa del Sol, Spain</p>
              </address>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#1a1a1a]">
                Contact
              </h3>
              <div className="space-y-1 text-sm text-[#1a1a1a]/70">
                <p>
                  <a
                    href="tel:+34951123880"
                    className="transition hover:text-[#c4a676]"
                  >
                    +34 951 123 880
                  </a>
                </p>
                <p>
                  <a
                    href="mailto:info@ejdevelopment.com"
                    className="transition hover:text-[#c4a676]"
                  >
                    info@ejdevelopment.com
                  </a>
                </p>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#1a1a1a]">
                Newsletter
              </h3>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full rounded border border-black/20 bg-white px-4 py-2 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:border-[#c4a676] focus:outline-none focus:ring-1 focus:ring-[#c4a676]"
                />
                <button
                  type="submit"
                  className="w-full rounded bg-[#1a1a1a] px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#c4a676]"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 border-t border-black/10 pt-8 text-center text-xs text-[#1a1a1a]/50">
          <p>© {new Date().getFullYear()} EJ Development. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
