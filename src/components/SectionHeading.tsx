type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) => (
  <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
    {eyebrow ? (
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
        {eyebrow}
      </p>
    ) : null}
    <h2 className="mt-3 font-serif text-3xl tracking-tight text-neutral-950 sm:text-4xl">
      {title}
    </h2>
    {description ? <p className="mt-4 leading-7 text-neutral-600">{description}</p> : null}
  </div>
);
