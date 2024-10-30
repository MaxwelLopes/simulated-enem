interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, color }) => (
  <div className={`flex items-center ${color} px-3 py-2 rounded-md`}>
    {icon}
    <span>{label}</span>
  </div>
);

export default StatItem;
