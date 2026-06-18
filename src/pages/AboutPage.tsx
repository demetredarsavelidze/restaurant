import { SectionHeading } from "../components/SectionHeading";

export const AboutPage = () => (
  <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <SectionHeading
        eyebrow="About"
        title="A modern neighborhood restaurant with a polished point of view"
        description="Aurora Table brings together seasonal cooking, a measured dining room, and gracious hospitality. The menu changes with the market while preserving the familiar comfort of a classic evening out."
      />
      <img
        src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=1200&q=85"
        alt="Restaurant team preparing service"
        className="h-[420px] w-full rounded-[2rem] object-cover shadow-xl shadow-neutral-900/10"
      />
    </div>

    <div className="mt-14 grid gap-5 md:grid-cols-3">
      {[
        ["Kitchen", "Seasonal produce, house-made pastas, dry-aged meats, and seafood prepared with restraint."],
        ["Dining room", "Warm lighting, generous spacing, natural textures, and a comfortable premium feel."],
        ["Reservations", "A table-first reservation system that keeps hosts and guests aligned in real time."],
      ].map(([title, description]) => (
        <article key={title} className="card p-6">
          <h3 className="text-xl font-semibold text-neutral-950">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-neutral-600">{description}</p>
        </article>
      ))}
    </div>
  </section>
);
