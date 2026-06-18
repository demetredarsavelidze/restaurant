import { FiInbox } from "react-icons/fi";

type EmptyStateProps = {
  title: string;
  description: string;
};

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
    <FiInbox className="mx-auto text-neutral-400" size={34} />
    <h3 className="mt-4 text-lg font-semibold text-neutral-950">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">{description}</p>
  </div>
);
