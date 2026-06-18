import { useRef } from "react";
import QRCode from "react-qr-code";
import { FiDownload } from "react-icons/fi";

type QRDownloaderProps = {
  title: string;
  description: string;
  value: string;
};

export const QRDownloader = ({ title, description, value }: QRDownloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const download = () => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replaceAll(" ", "-")}-qr.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <article className="card p-6">
      <div ref={containerRef} className="rounded-3xl bg-white p-5">
        <QRCode value={value} className="h-auto w-full" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-neutral-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
      <button onClick={download} className="btn-primary mt-5 flex w-full items-center justify-center gap-2 py-3">
        <FiDownload /> Download SVG
      </button>
    </article>
  );
};
