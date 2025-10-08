import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with EJ Properties to discuss your vision for precision-crafted living spaces along the Costa del Sol.",
};

export default function ContactPage() {
  return (
    <main className="space-y-24 pb-24">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-28 md:pt-32">
        <div className="flex flex-col gap-8 text-center md:gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Contact</p>
            <h1 className="mt-4 font-serif text-4xl font-light text-foreground md:text-6xl">
              Let's Create Together
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            Ready to discuss your vision for precision-crafted living spaces? We'd love to hear about your project 
            and share how we can bring it to life with our signature attention to detail.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Contact Form */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-3xl font-light text-foreground">Send us a message</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We'll respond within 24 hours to discuss your project.
              </p>
            </div>
            
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                    placeholder="Your last name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                  placeholder="+34 600 123 456"
                />
              </div>
              
              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-foreground mb-2">
                  Project Type
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="">Select project type</option>
                  <option value="new-build">New Build</option>
                  <option value="renovation">Renovation</option>
                  <option value="interior-design">Interior Design</option>
                  <option value="consultation">Consultation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-foreground mb-2">
                  Project Budget
                </label>
                <select
                  id="budget"
                  name="budget"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="">Select budget range</option>
                  <option value="under-500k">Under €500,000</option>
                  <option value="500k-1m">€500,000 - €1,000,000</option>
                  <option value="1m-2m">€1,000,000 - €2,000,000</option>
                  <option value="2m-5m">€2,000,000 - €5,000,000</option>
                  <option value="over-5m">Over €5,000,000</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Project Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none resize-none"
                  placeholder="Tell us about your vision, timeline, and any specific requirements..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full rounded-full border border-foreground bg-foreground px-8 py-3 text-sm font-medium text-background transition hover:bg-foreground/90"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-3xl font-light text-foreground">Get in touch</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We're here to help bring your vision to life.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-light text-foreground">Studio</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Marbella · Costa del Sol</p>
                  <p>Spain</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-light text-foreground">Contact</h3>
                <div className="space-y-2 text-sm">
                  <a href="mailto:hello@ejproperties.com" className="block text-muted-foreground hover:text-foreground transition">
                    hello@ejproperties.com
                  </a>
                  <a href="tel:+34600123456" className="block text-muted-foreground hover:text-foreground transition">
                    +34 600 123 456
                  </a>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-light text-foreground">Press & Partnerships</h3>
                <div className="space-y-2 text-sm">
                  <a href="mailto:press@ejproperties.com" className="block text-muted-foreground hover:text-foreground transition">
                    press@ejproperties.com
                  </a>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-light text-foreground">Office Hours</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Monday – Friday</p>
                  <p>09:00 – 18:00 CET</p>
                  <p className="text-xs mt-2">We typically respond within 24 hours</p>
                </div>
              </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <h3 className="font-serif text-lg font-light text-foreground mb-2">Visit Our Studio</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Located in the heart of Marbella, our studio welcomes visitors by appointment.
              </p>
              <div className="h-48 w-full rounded-lg bg-muted flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Interactive map coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>
        
        <div className="space-y-8">
          <div className="border-b border-border pb-6">
            <h3 className="font-serif text-lg font-light text-foreground mb-2">
              How long does a typical project take?
            </h3>
            <p className="text-sm text-muted-foreground">
              Project timelines vary based on scope and complexity. A full renovation typically takes 6-12 months, 
              while new builds can range from 12-24 months. We'll provide detailed timelines during our initial consultation.
            </p>
          </div>
          
          <div className="border-b border-border pb-6">
            <h3 className="font-serif text-lg font-light text-foreground mb-2">
              Do you work with existing properties?
            </h3>
            <p className="text-sm text-muted-foreground">
              Yes, we specialize in both new builds and renovations. Our precision approach works equally well 
              for optimizing existing spaces and creating new ones from the ground up.
            </p>
          </div>
          
          <div className="border-b border-border pb-6">
            <h3 className="font-serif text-lg font-light text-foreground mb-2">
              What areas do you serve?
            </h3>
            <p className="text-sm text-muted-foreground">
              We focus on the Costa del Sol region, including Marbella, Benahavís, Nueva Andalucía, 
              and surrounding areas. For projects outside this region, please contact us to discuss feasibility.
            </p>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-light text-foreground mb-2">
              What's included in your services?
            </h3>
            <p className="text-sm text-muted-foreground">
              Our comprehensive service includes architectural design, interior planning, material selection, 
              project management, and coordination with trusted local craftspeople and suppliers.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
