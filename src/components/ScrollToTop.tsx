import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 z-40 rounded-full bg-neutral-950 p-3 text-white shadow-lg transition hover:bg-neutral-800"
      aria-label="Scroll to top"
    >
      <FiArrowUp />
    </button>
  );
};
