import { SimulatedStatus } from "../enum/simulated";
import Tag from "./Tag";

const StatusText = ({ status }: { status: string }) => (
  <Tag color={status === SimulatedStatus.COMPLETED ? 'green' : 'red' } label={status}/>
);

export default StatusText;
