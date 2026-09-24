seed = {
  "building": [
    {
      "id": 1,
      "name": "name 1",
      "campus": "campus 1",
      "floor_count": "floor count 1",
      "fire_grade": "fire grade 1",
      "manager_id": 1,
      "address_code": "address code 1"
    },
    {
      "id": 2,
      "name": "name 2",
      "campus": "campus 2",
      "floor_count": "floor count 2",
      "fire_grade": "fire grade 2",
      "manager_id": 2,
      "address_code": "address code 2"
    },
    {
      "id": 3,
      "name": "name 3",
      "campus": "campus 3",
      "floor_count": "floor count 3",
      "fire_grade": "fire grade 3",
      "manager_id": 3,
      "address_code": "address code 3"
    }
  ],
  "fireDevice": [
    {
      "id": 1,
      "building_id": 1,
      "device_code": "device code 1",
      "device_type": "HYDRANT",
      "floor": "floor 1",
      "location_desc": "location desc 1",
      "install_date": "2026-06-11T09:00:00Z",
      "status": "ACTIVE",
      "next_maintenance_at": "2026-06-11T09:00:00Z"
    },
    {
      "id": 2,
      "building_id": 2,
      "device_code": "device code 2",
      "device_type": "SMOKE_DETECTOR",
      "floor": "floor 2",
      "location_desc": "location desc 2",
      "install_date": "2026-06-12T09:00:00Z",
      "status": "ACTIVE",
      "next_maintenance_at": "2026-06-12T09:00:00Z"
    },
    {
      "id": 3,
      "building_id": 3,
      "device_code": "device code 3",
      "device_type": "SPRINKLER",
      "floor": "floor 3",
      "location_desc": "location desc 3",
      "install_date": "2026-06-13T09:00:00Z",
      "status": "ACTIVE",
      "next_maintenance_at": "2026-06-13T09:00:00Z"
    }
  ],
  "inspectionTask": [
    {
      "id": 1,
      "building_id": 1,
      "inspector_id": 1,
      "plan_date": "2026-06-11T09:00:00Z",
      "task_type": "HYDRANT",
      "status": "IN_PROGRESS",
      "checklist_version": "checklist version 1",
      "finished_at": "2026-06-11T09:00:00Z"
    },
    {
      "id": 2,
      "building_id": 2,
      "inspector_id": 2,
      "plan_date": "2026-06-12T09:00:00Z",
      "task_type": "SMOKE_DETECTOR",
      "status": "SUBMITTED",
      "checklist_version": "checklist version 2",
      "finished_at": "2026-06-12T09:00:00Z"
    },
    {
      "id": 3,
      "building_id": 3,
      "inspector_id": 3,
      "plan_date": "2026-06-13T09:00:00Z",
      "task_type": "SPRINKLER",
      "status": "PLANNED",
      "checklist_version": "checklist version 3",
      "finished_at": "2026-06-13T09:00:00Z"
    }
  ],
  "inspectionResult": [
    {
      "id": 1,
      "task_id": 1,
      "device_id": 1,
      "item_code": "item code 1",
      "result_status": "IN_PROGRESS",
      "measured_value": "measured value 1",
      "photo_url": "/mock/photo_url-1.png",
      "note": "note 1"
    },
    {
      "id": 2,
      "task_id": 2,
      "device_id": 2,
      "item_code": "item code 2",
      "result_status": "SUBMITTED",
      "measured_value": "measured value 2",
      "photo_url": "/mock/photo_url-2.png",
      "note": "note 2"
    },
    {
      "id": 3,
      "task_id": 3,
      "device_id": 3,
      "item_code": "item code 3",
      "result_status": "PLANNED",
      "measured_value": "measured value 3",
      "photo_url": "/mock/photo_url-3.png",
      "note": "note 3"
    }
  ],
  "hazardTicket": [
    {
      "id": 1,
      "result_id": 1,
      "severity": "severity 1",
      "owner_id": 1,
      "deadline": "deadline 1",
      "rectify_status": "IN_PROGRESS",
      "rectify_note": "rectify note 1",
      "closed_at": ""
    },
    {
      "id": 2,
      "result_id": 2,
      "severity": "severity 2",
      "owner_id": 2,
      "deadline": "deadline 2",
      "rectify_status": "CLOSED",
      "rectify_note": "rectify note 2",
      "closed_at": "2026-06-12T09:00:00Z"
    },
    {
      "id": 3,
      "result_id": 3,
      "severity": "severity 3",
      "owner_id": 3,
      "deadline": "deadline 3",
      "rectify_status": "OPEN",
      "rectify_note": "rectify note 3",
      "closed_at": ""
    }
  ],
  "deviceOutage": [
    {
      "id": 1,
      "device_id": 1,
      "reason": "报警阀组漏水，需更换密封件",
      "expected_recovery_at": "2026-06-20T09:00:00Z",
      "status": "RECOVERED",
      "applicant": "inspector#1",
      "applied_at": "2026-06-10T09:00:00Z",
      "confirmer": "supervisor#2",
      "confirmed_at": "2026-06-10T10:30:00Z",
      "device_status_before": "ACTIVE",
      "device_status_after": "ACTIVE",
      "check_result": "NORMAL",
      "check_note": "密封件已更换，试压正常",
      "checker": "inspector#1",
      "checked_at": "2026-06-18T15:00:00Z",
      "recoverer": "supervisor#2",
      "recovered_at": "2026-06-18T15:20:00Z",
      "events": [
        {
          "action": "APPLY",
          "handler": "inspector#1",
          "at": "2026-06-10T09:00:00Z",
          "from_status": "",
          "to_status": "PENDING",
          "note": "报警阀组漏水，需更换密封件"
        },
        {
          "action": "CONFIRM",
          "handler": "supervisor#2",
          "at": "2026-06-10T10:30:00Z",
          "from_status": "PENDING",
          "to_status": "DEACTIVATED",
          "note": "设备停用，1 项未开始任务退回排期"
        },
        {
          "action": "CHECK",
          "handler": "inspector#1",
          "at": "2026-06-18T15:00:00Z",
          "from_status": "DEACTIVATED",
          "to_status": "DEACTIVATED",
          "note": "复启检查：正常。密封件已更换，试压正常"
        },
        {
          "action": "RECOVER",
          "handler": "supervisor#2",
          "at": "2026-06-18T15:20:00Z",
          "from_status": "DEACTIVATED",
          "to_status": "RECOVERED",
          "note": "检查正常且关联隐患已闭环，设备复启"
        }
      ]
    },
    {
      "id": 2,
      "device_id": 2,
      "reason": "烟感误报频繁，待厂家检测",
      "expected_recovery_at": "2026-09-30T09:00:00Z",
      "status": "PENDING",
      "applicant": "inspector#3",
      "applied_at": "2026-09-23T08:30:00Z",
      "confirmer": "",
      "confirmed_at": "",
      "device_status_before": "ACTIVE",
      "device_status_after": "",
      "check_result": "",
      "check_note": "",
      "checker": "",
      "checked_at": "",
      "recoverer": "",
      "recovered_at": "",
      "events": [
        {
          "action": "APPLY",
          "handler": "inspector#3",
          "at": "2026-09-23T08:30:00Z",
          "from_status": "",
          "to_status": "PENDING",
          "note": "烟感误报频繁，待厂家检测"
        }
      ]
    }
  ]
}
