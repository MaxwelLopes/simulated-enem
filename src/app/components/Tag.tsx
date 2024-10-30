const Tag = ({ color, label }: { color: string; label: string }) => (
  <span
    className={`bg-${color}-100 text-${color}-600 rounded px-2 py-1 text-sm`}
  >
    {label}
  </span>
);

export default Tag;
