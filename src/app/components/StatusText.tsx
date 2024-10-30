import { SimulatedStatus } from "../enum/simulated";

const StatusText = ({ status }: { status: string }) => (
  <p
    className={`text-sm mb-4 ${
      status === SimulatedStatus.COMPLETED ? "text-green-600" : "text-red-600"
    }`}
  >
    Status: {status}
  </p>
);

export default StatusText;
