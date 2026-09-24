import { useState } from "react";
import type { InspectionTask } from "../../types/InspectionTask";
import { useDeviceStatusFlow } from "../../hooks/useDeviceStatusFlow";

export function ReschedulePanel({ task, flow }: { task: InspectionTask; flow: ReturnType<typeof useDeviceStatusFlow> }) {
  const [planDate, setPlanDate] = useState(task.plan_date);
  const [message, setMessage] = useState<string | null>(null);

  if (task.status !== "RETURNED") return null;

  return (
    <div className="reschedule-row">
      <input type="date" value={planDate} onChange={(event) => setPlanDate(event.target.value)} />
      <button
        className="btn primary small"
        onClick={async () => {
          try {
            await flow.reschedule(task.id, planDate);
            setMessage("已重新排期");
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "重新排期失败");
          }
        }}
      >
        重新排期
      </button>
      {message && <span className="muted">{message}</span>}
    </div>
  );
}
