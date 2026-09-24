import { useState } from "react";
import type { FireDevice } from "../../types/FireDevice";
import type { DeviceStatusOrder } from "../../types/DeviceStatusOrder";
import { useDeviceStatusFlow } from "../../hooks/useDeviceStatusFlow";
import { buildOrderTimeline } from "../../utils/orderTimeline";
import { TimelineList } from "./TimelineList";
import { StatusBadge } from "./StatusBadge";

interface Props {
  device: FireDevice;
  order: DeviceStatusOrder | null;
  flow: ReturnType<typeof useDeviceStatusFlow>;
}

const APPLY_ROLES = ["INSPECTOR", "MAINTAINER"];
const SUPERVISOR = "SUPERVISOR";

export function DisableReactivatePanel({ device, order, flow }: Props) {
  const { role } = flow;
  const [reason, setReason] = useState("");
  const [expectedRecoverAt, setExpectedRecoverAt] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [checkResult, setCheckResult] = useState<"NORMAL" | "ABNORMAL">("NORMAL");
  const [checkNote, setCheckNote] = useState("");

  const busy = false;
  const unfinished = flow.unfinishedHazardCount(device.id);

  const afterAction = async (next: DeviceStatusOrder | null) => {
    if (next) {
      await flow.refreshAll();
      setReason("");
      setExpectedRecoverAt("");
      setRejectReason("");
      setCheckNote("");
    }
  };

  const canApply = APPLY_ROLES.includes(role);

  return (
    <div className="panel action-panel">
      <div className="panel-head">
        <h3>停用 / 复启办理</h3>
        <StatusBadge value={device.status} />
      </div>

      {flow.lastError && <p className="alert error">{flow.lastError}</p>}

      {/* 无在途单据：报修停用申请 */}
      {!order && device.status === "NORMAL" && (
        <form
          className="form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            void flow
              .applyDisable({ device_id: device.id, reason, expected_recover_at: expectedRecoverAt })
              .then(afterAction);
          }}
        >
          <label>
            报修停用原因
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} required minLength={2} />
          </label>
          <label>
            预计恢复日
            <input
              type="date"
              value={expectedRecoverAt}
              onChange={(e) => setExpectedRecoverAt(e.target.value)}
              required
            />
          </label>
          <button className="btn danger" type="submit" disabled={!canApply || busy}>
            提交停用申请
          </button>
          {!canApply && <p className="muted">巡检员 / 维保商可提交报修停用申请</p>}
        </form>
      )}

      {/* 待主管确认 */}
      {order?.state === "PENDING" && (
        <div className="action-block">
          <p>报修停用申请待主管确认。确认后设备立即停用，新建巡检不再带入，未开始任务退回排期。</p>
          {role === SUPERVISOR && (
            <>
              <div className="btn-row">
                <button
                  className="btn danger"
                  onClick={() => void flow.confirmDisable(order.id).then(afterAction)}
                >
                  确认停用
                </button>
              </div>
              <label>
                驳回意见（可选填，驳回时必填）
                <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
              </label>
              <button
                className="btn ghost"
                disabled={rejectReason.trim().length < 2}
                onClick={() => void flow.rejectDisable(order.id, rejectReason).then(afterAction)}
              >
                驳回申请
              </button>
            </>
          )}
          {role !== SUPERVISOR && <p className="muted">等待物业主管确认。</p>}
        </div>
      )}

      {/* 已停用：复启前必须先补一次检查 */}
      {order?.state === "DISABLED" && (
        <form
          className="form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            void flow
              .submitCheck(order.id, { result: checkResult, note: checkNote })
              .then(afterAction);
          }}
        >
          <p>设备停用中。复启前需补一次检查。</p>
          <label>
            补检结果
            <select value={checkResult} onChange={(e) => setCheckResult(e.target.value as "NORMAL" | "ABNORMAL")}>
              <option value="NORMAL">检查正常</option>
              <option value="ABNORMAL">检查异常</option>
            </select>
          </label>
          <label>
            检查备注
            <textarea value={checkNote} onChange={(e) => setCheckNote(e.target.value)} />
          </label>
          <button className="btn" type="submit" disabled={!APPLY_ROLES.concat(SUPERVISOR).includes(role)}>
            提交补检结果
          </button>
        </form>
      )}

      {/* 复启检查已录入：异常可重新补检；正常则主管校验隐患后恢复 */}
      {order?.state === "REACTIVATING" && (
        <div className="action-block">
          <p>
            补检结论：
            <StatusBadge value={order.check_result ?? ""} />
          </p>

          {order.check_result === "NORMAL" ? (
            <>
              <p className={unfinished > 0 ? "alert warn" : "alert ok"}>
                关联隐患未处理完：{unfinished} 条{unfinished === 0 ? "（已全部关闭）" : "，需先到隐患整改页处理关闭"}
              </p>
              {role === SUPERVISOR && (
                <button
                  className="btn primary"
                  disabled={unfinished > 0}
                  title={unfinished > 0 ? "关联隐患未处理完，不能恢复" : "恢复在运"}
                  onClick={() => void flow.reactivate(order.id).then(afterAction)}
                >
                  恢复在运
                </button>
              )}
              {role !== SUPERVISOR && <p className="muted">补检正常且关联隐患处理完后，由物业主管恢复在运。</p>}
            </>
          ) : (
            <form
              className="form-grid"
              onSubmit={(event) => {
                event.preventDefault();
                void flow
                  .submitCheck(order.id, { result: checkResult, note: checkNote })
                  .then(afterAction);
              }}
            >
              <p className="alert warn">补检结果为异常，设备继续停用。处理完可在此重新补检。</p>
              <label>
                重新补检结果
                <select
                  value={checkResult}
                  onChange={(e) => setCheckResult(e.target.value as "NORMAL" | "ABNORMAL")}
                >
                  <option value="NORMAL">检查正常</option>
                  <option value="ABNORMAL">检查异常</option>
                </select>
              </label>
              <label>
                检查备注
                <textarea value={checkNote} onChange={(e) => setCheckNote(e.target.value)} />
              </label>
              <button className="btn" type="submit">
                重新提交补检
              </button>
            </form>
          )}
        </div>
      )}

      {order && <TimelineList steps={buildOrderTimeline(order)} />}
    </div>
  );
}
