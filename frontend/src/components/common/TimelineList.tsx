import type { AuditLog } from "../../types/AuditLog";

export interface TimelineStep {
  key: string;
  title: string;
  actor?: string | null;
  time?: string | null;
  detail?: string | null;
  tone?: "ok" | "warn" | "muted";
}

export function TimelineList({ title = "办理轨迹", steps }: { title?: string; steps: TimelineStep[] }) {
  return (
    <div className="timeline">
      <h3>{title}</h3>
      {steps.length === 0 && <p className="muted">暂无办理记录</p>}
      <ol>
        {steps.map((step) => (
          <li key={step.key} className={step.tone ?? ""}>
            <div className="timeline-dot" />
            <div className="timeline-body">
              <div className="timeline-head">
                <strong>{step.title}</strong>
                {step.time && <span className="muted">{step.time}</span>}
              </div>
              {step.actor && <div className="muted">处理人：{step.actor}</div>}
              {step.detail && <div className="timeline-detail">{step.detail}</div>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function logsToTimeline(logs: AuditLog[]): TimelineStep[] {
  return logs.map((log) => ({
    key: String(log.id),
    title: log.action,
    actor: log.actor,
    time: log.created_at,
    detail: log.detail
  }));
}
