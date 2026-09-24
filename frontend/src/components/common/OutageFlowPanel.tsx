import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { useOutageFlow } from "../../hooks/useOutageFlow";
import { useDeviceOutageStore } from "../../stores/DeviceOutageStore";
import { createDeviceOutageCheckForm } from "../../constructors/DeviceOutageConstructor";
import { OutageActionText, type OutageAction } from "../../constants/OutageStatus";
import { OutageCheckResult, OutageCheckResultText } from "../../constants/OutageCheckResult";
import { formatDate, formatDeviceStatus, formatOutageStatus, formatCheckResult } from "../../utils/formatters";
import type { FireDevice } from "../../types/FireDevice";

export function OutageFlowPanel({ device }: { device: FireDevice }) {
  const flow = useOutageFlow();
  const store = useDeviceOutageStore();
  const active = flow.activeOutageOf(device.id);
  const history = flow.outagesOf(device.id);
  const openHazards = flow.openHazardsOf(device.id);
  const blockers = flow.recoverBlockers(active);

  const [reason, setReason] = useState("");
  const [expected, setExpected] = useState("");
  const [checkForm, setCheckForm] = useState(createDeviceOutageCheckForm());
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const run = (action: () => Promise<unknown>) => async () => {
    setError("");
    setBusy(true);
    try {
      await flow.run(action);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const submitApply = run(async () => {
    await store.apply({ device_id: device.id, reason, expected_recovery_at: expected ? `${expected}T09:00:00Z` : "" });
    setReason("");
    setExpected("");
  });

  const submitCheck = run(async () => {
    if (!active) return;
    await store.check(active.id, checkForm);
    setCheckForm(createDeviceOutageCheckForm());
  });

  return <div className="panel outage-panel">
    <div className="outage-head">
      <h2>停用 / 复启办理 · {device.device_code}</h2>
      <StatusBadge value={device.status} text={`当前状态：${formatDeviceStatus(device.status)}`} />
    </div>

    {!active && <div className="form">
      <h3>报修申请</h3>
      <label>报修原因
        <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="写明故障现象和报修原因" rows={2} />
      </label>
      <label>预计恢复日
        <input type="date" value={expected} onChange={(event) => setExpected(event.target.value)} />
      </label>
      <div className="actions">
        <button className="btn primary" disabled={busy || !reason.trim() || !expected} onClick={submitApply}>提交报修</button>
      </div>
    </div>}

    {active && <div className="outage-active">
      <div className="row">
        <strong>停用单 #{active.id}</strong>
        <StatusBadge value={active.status} text={formatOutageStatus(active.status)} />
        <span>预计恢复：{formatDate(active.expected_recovery_at)}</span>
      </div>
      <p className="hint">报修原因:{active.reason} ・ 申请人:{active.applicant} ・ {formatDate(active.applied_at)}</p>

      {active.status === "PENDING" && <div className="actions">
        <button className="btn primary" disabled={busy} onClick={run(() => store.confirm(active.id))}>主管确认停用</button>
        <button className="btn" disabled={busy} onClick={run(() => store.cancel(active.id))}>取消申请</button>
      </div>}

      {active.status === "DEACTIVATED" && <div className="form">
        <h3>复启前检查{active.check_result ? `（最近结果：${formatCheckResult(active.check_result)}）` : ""}</h3>
        <label>检查结果
          <select value={checkForm.result} onChange={(event) => setCheckForm({ ...checkForm, result: event.target.value })}>
            {OutageCheckResult.map((value) => <option key={value} value={value}>{OutageCheckResultText[value]}</option>)}
          </select>
        </label>
        <label>检查说明
          <textarea value={checkForm.note} onChange={(event) => setCheckForm({ ...checkForm, note: event.target.value })} placeholder="记录维修与检查情况" rows={2} />
        </label>
        <div className="actions">
          <button className="btn" disabled={busy} onClick={submitCheck}>记录检查结果</button>
          <button className="btn primary" disabled={busy || blockers.length > 0} onClick={run(() => store.recover(active.id))}>复启设备</button>
        </div>
        {blockers.length > 0 && <ul className="blockers">
          {blockers.map((item) => <li key={item}>{item}</li>)}
        </ul>}
        {openHazards.length === 0 && active.check_result === "NORMAL" && <p className="hint">检查正常且关联隐患已闭环，可以复启。</p>}
      </div>}
    </div>}

    {error && <p className="error-text">{error}</p>}

    {history.length > 0 && <div className="timeline">
      <h3>流转记录</h3>
      {history.map((outage) => outage.events.map((event, index) => <div className="event" key={`${outage.id}-${index}`}>
        <strong>{OutageActionText[event.action as OutageAction] ?? event.action}</strong>
        <span>{event.handler} ・ {formatDate(event.at)}</span>
        <span>
          {event.from_status ? `${formatOutageStatus(event.from_status)} → ` : ""}{formatOutageStatus(event.to_status)}
        </span>
        {event.note && <em>{event.note}</em>}
      </div>))}
    </div>}
  </div>;
}
