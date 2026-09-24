/**
 * 本地种子数据（与后端 backend/src/bootstrap.py 保持一致）。
 * 前端运行时以 /api 返回为准；此文件仅保留作离线对照，不请求任何第三方服务。
 */
export const mockData = {
  building: [
    {
      id: 1,
      name: "1号研发楼",
      campus: "梧桐园区",
      floor_count: 8,
      fire_grade: "一级",
      manager_id: 31,
      address_code: "310000-A01"
    }
  ],
  fireDevice: [
    { id: 1, building_id: 1, building_name: "1号研发楼", device_code: "FH-0101", device_type: "HYDRANT", floor: "1F", location_desc: "大堂东侧消火栓", install_date: "2024-03-10", status: "NORMAL", next_maintenance_at: "2026-10-01" },
    { id: 2, building_id: 1, building_name: "1号研发楼", device_code: "SD-0205", device_type: "SMOKE_DETECTOR", floor: "2F", location_desc: "205会议室烟感", install_date: "2024-03-10", status: "NORMAL", next_maintenance_at: "2026-10-01" },
    { id: 3, building_id: 1, building_name: "1号研发楼", device_code: "SP-0308", device_type: "SPRINKLER", floor: "3F", location_desc: "308办公区喷淋头", install_date: "2024-05-20", status: "NORMAL", next_maintenance_at: "2026-09-30" },
    { id: 4, building_id: 1, building_name: "1号研发楼", device_code: "EX-0B02", device_type: "EXIT_LIGHT", floor: "B1", location_desc: "地下车库出口指示灯", install_date: "2023-12-01", status: "NORMAL", next_maintenance_at: "2026-10-15" }
  ],
  inspectionTask: [
    { id: 1, building_id: 1, inspector_id: 11, plan_date: "2026-09-28", task_type: "WEEKLY", status: "PLANNED", checklist_version: "v2026.1", finished_at: null, device_ids: [1, 2, 3, 4], return_reason: null },
    { id: 2, building_id: 1, inspector_id: 11, plan_date: "2026-09-21", task_type: "WEEKLY", status: "IN_PROGRESS", checklist_version: "v2026.1", finished_at: null, device_ids: [2, 3], return_reason: null }
  ],
  inspectionResult: [
    { id: 1, task_id: 2, device_id: 3, item_code: "SP-PRESSURE", result_status: "ABNORMAL", measured_value: "0.18MPa", photo_url: "", note: "喷淋压力偏低，疑似管网渗漏" }
  ],
  hazardTicket: [
    { id: 1, result_id: 1, device_id: 3, severity: "HIGH", owner_id: 21, deadline: "2026-09-30", rectify_status: "RECTIFYING", rectify_note: "已报维保商，待更换密封件", closed_at: null },
    { id: 2, result_id: 1, device_id: 1, severity: "LOW", owner_id: 21, deadline: "2026-08-30", rectify_status: "CLOSED", rectify_note: "消火栓箱门铰链已上油", closed_at: "2026-08-26 10:00:00" }
  ],
  deviceStatusOrder: []
};
