import type { InspectionTask } from "../../types/InspectionTask";
import type { FireDevice } from "../../types/FireDevice";
import { StatusBadge } from "./StatusBadge";

interface ChecklistPanelProps {
  task?: InspectionTask | null;
  devices: FireDevice[];
}

/** 巡检设备清单：直观展示停用设备被剔除、任务退回排期 */
export function ChecklistPanel({ task, devices }: ChecklistPanelProps) {
  if (!task) {
    return (
      <div className="panel">
        <h3>巡检设备清单</h3>
        <p className="muted">选择左侧任务查看设备</p>
      </div>
    );
  }
  const deviceMap = new Map(devices.map((device) => [device.id, device]));
  return (
    <div className="panel">
      <h3>
        巡检设备清单 <StatusBadge value={task.status} />
      </h3>
      {task.return_reason && (
        <p className="alert warn">退回原因：{task.return_reason}</p>
      )}
      {task.device_ids.length === 0 ? (
        <p className="muted">清单为空——在运设备已全部被剔除，任务退回排期。</p>
      ) : (
        <ul className="checklist">
          {task.device_ids.map((id) => {
            const device = deviceMap.get(id);
            return (
              <li key={id}>
                <span>{device ? device.device_code : `设备#${id}`}</span>
                {device && <StatusBadge value={device.status} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
