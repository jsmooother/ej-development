import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio",
  description: "Our philosophy, craft, and approach to precision property development with timeless design and refined luxury.",
};

export default function StudioPage() {
  return (
    <main className="space-y-24 pb-24">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-28 md:pt-32">
        <div className="flex flex-col gap-8 text-center md:gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Studio</p>
            <h1 className="mt-4 font-serif text-4xl font-light text-foreground md:text-6xl">
              Philosophy & Craft
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            We create homes where every square meter is optimized with precision, combining timeless design
            principles with modern functionality for truly livable luxury.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="space-y-8">
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
            <p>
              EJ Properties choreographs sites, layouts, and material palettes with a calm confidence. We balance
              editorial minimalism with Andalusian warmth, working shoulder-to-shoulder with artisans from initial
              sketches through final styling.
            </p>
            <p>
              Every project is bespoke. We prototype joinery, test lighting compositions, and choreograph flows to
              suit the specific rhythms of our clients. Our strength lies in tailoring every detail – from intelligent
              storage solutions to seamless integrations – ensuring that function and elegance go hand in hand.
            </p>
            <p>
              With a foundation of timeless design, refined by a modern touch, we work with warm tones and natural
              materials to bring a sense of sophistication and comfort. The result is homes that radiate understated
              luxury while remaining inviting, personal, and truly livable.
            </p>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-light text-foreground">Precision Planning</h3>
            <p className="text-sm text-muted-foreground">
              Every square meter is optimized through smart layouts and natural flow between rooms,
              creating spaces that feel effortless and perfectly balanced.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-light text-foreground">Material Selection</h3>
            <p className="text-sm text-muted-foreground">
              We source sustainable materials from local quarries and artisans, ensuring each element
              contributes to both aesthetic excellence and environmental responsibility.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-light text-foreground">Timeless Design</h3>
            <p className="text-sm text-muted-foreground">
              Our approach combines classical proportions with contemporary functionality,
              creating homes that will remain elegant and relevant for generations.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl border border-border bg-card p-12">
          <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl text-center mb-8">
            Our Process
          </h2>
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background">
                1
              </div>
              <div>
                <h4 className="font-serif text-lg font-light text-foreground">Discovery</h4>
                <p className="text-sm text-muted-foreground">
                  We begin by understanding your lifestyle, needs, and vision for the space.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background">
                2
              </div>
              <div>
                <h4 className="font-serif text-lg font-light text-foreground">Design Development</h4>
                <p className="text-sm text-muted-foreground">
                  Through sketches, models, and material studies, we develop the concept into detailed plans.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background">
                3
              </div>
              <div>
                <h4 className="font-serif text-lg font-light text-foreground">Execution</h4>
                <p className="text-sm text-muted-foreground">
                  Working with trusted craftspeople, we bring the design to life with meticulous attention to detail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl border border-border bg-card p-12">
          <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl text-center mb-4">
            Our Team
          </h2>
          <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
            A dedicated team of architects, designers, and craftspeople working together to create exceptional
            living spaces along the Costa del Sol. We combine local expertise with international standards,
            bringing precision and care to every project from concept through completion.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-border bg-card p-12 text-center">
          <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl">
            Ready to Create Together?
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Let&apos;s discuss your vision for precision-crafted living spaces.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full border border-foreground bg-foreground px-8 py-3 text-sm font-medium text-background transition hover:bg-foreground/90"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </main>
  );
}
