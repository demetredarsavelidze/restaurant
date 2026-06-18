import { QRDownloader } from "../components/QRDownloader";
import { SectionHeading } from "../components/SectionHeading";

export const QRCodesPage = () => {
  const origin = window.location.origin;

  const codes = [
    {
      title: "Menu",
      description: "General restaurant menu for guests browsing before arrival.",
      value: `${origin}/menu`,
    },
    {
      title: "Reservation Page",
      description: "Direct link for guests to reserve a table online.",
      value: `${origin}/reservation`,
    },
    {
      title: "QR Menu",
      description: "Mobile-first table menu for in-restaurant QR scanning.",
      value: `${origin}/qr-menu`,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="QR codes"
        title="Download guest-facing QR codes"
        description="Generate SVG QR assets for table tents, host stands, printed menus, and reservation cards."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {codes.map((code) => (
          <QRDownloader key={code.title} {...code} />
        ))}
      </div>
    </section>
  );
};
