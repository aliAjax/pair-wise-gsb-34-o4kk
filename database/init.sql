-- 表结构与后端 SQLAlchemy ORM 保持一致；应用启动时也会 create_all 兜底。

CREATE TABLE IF NOT EXISTS building (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128),
  campus VARCHAR(128),
  floor_count INTEGER,
  fire_grade VARCHAR(32),
  manager_id INTEGER,
  address_code VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS fire_device (
  id SERIAL PRIMARY KEY,
  building_id INTEGER,
  device_code VARCHAR(64) UNIQUE,
  device_type VARCHAR(32),
  floor VARCHAR(16),
  location_desc VARCHAR(255),
  install_date VARCHAR(32),
  status VARCHAR(16),
  next_maintenance_at VARCHAR(32)
);
CREATE INDEX IF NOT EXISTS ix_fire_device_building_id ON fire_device (building_id);
CREATE INDEX IF NOT EXISTS ix_fire_device_status ON fire_device (status);

CREATE TABLE IF NOT EXISTS inspection_task (
  id SERIAL PRIMARY KEY,
  building_id INTEGER,
  inspector_id INTEGER,
  plan_date VARCHAR(32),
  task_type VARCHAR(32),
  status VARCHAR(16),
  checklist_version VARCHAR(32),
  finished_at VARCHAR(32),
  device_ids VARCHAR(255),
  return_reason VARCHAR(255)
);
CREATE INDEX IF NOT EXISTS ix_inspection_task_building_id ON inspection_task (building_id);
CREATE INDEX IF NOT EXISTS ix_inspection_task_status ON inspection_task (status);

CREATE TABLE IF NOT EXISTS inspection_result (
  id SERIAL PRIMARY KEY,
  task_id INTEGER,
  device_id INTEGER,
  item_code VARCHAR(64),
  result_status VARCHAR(16),
  measured_value VARCHAR(64),
  photo_url VARCHAR(255),
  note VARCHAR(255)
);
CREATE INDEX IF NOT EXISTS ix_inspection_result_task_id ON inspection_result (task_id);
CREATE INDEX IF NOT EXISTS ix_inspection_result_device_id ON inspection_result (device_id);

CREATE TABLE IF NOT EXISTS hazard_ticket (
  id SERIAL PRIMARY KEY,
  result_id INTEGER,
  device_id INTEGER,
  severity VARCHAR(16),
  owner_id INTEGER,
  deadline VARCHAR(32),
  rectify_status VARCHAR(16),
  rectify_note VARCHAR(255),
  closed_at VARCHAR(32)
);
CREATE INDEX IF NOT EXISTS ix_hazard_ticket_result_id ON hazard_ticket (result_id);
CREATE INDEX IF NOT EXISTS ix_hazard_ticket_device_id ON hazard_ticket (device_id);
CREATE INDEX IF NOT EXISTS ix_hazard_ticket_rectify_status ON hazard_ticket (rectify_status);

-- 设备停用/复启单：申请到复启的处理人、时间、前后状态留痕
CREATE TABLE IF NOT EXISTS device_status_order (
  id SERIAL PRIMARY KEY,
  device_id INTEGER,
  state VARCHAR(16),
  reason TEXT,
  expected_recover_at VARCHAR(32),
  applicant_id INTEGER,
  applicant_name VARCHAR(32),
  applied_at VARCHAR(32),
  confirmer_id INTEGER,
  confirmer_name VARCHAR(32),
  confirmed_at VARCHAR(32),
  reject_reason TEXT,
  checker_id INTEGER,
  checker_name VARCHAR(32),
  checked_at VARCHAR(32),
  check_result VARCHAR(16),
  check_note TEXT,
  reactivator_id INTEGER,
  reactivator_name VARCHAR(32),
  reactivated_at VARCHAR(32),
  status_before VARCHAR(16),
  status_after VARCHAR(16)
);
CREATE INDEX IF NOT EXISTS ix_device_status_order_device_id ON device_status_order (device_id);
CREATE INDEX IF NOT EXISTS ix_device_status_order_state ON device_status_order (state);

CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  actor VARCHAR(64),
  action VARCHAR(64),
  target_type VARCHAR(32),
  target_id VARCHAR(32),
  detail TEXT,
  created_at VARCHAR(32)
);
CREATE INDEX IF NOT EXISTS ix_audit_log_action ON audit_log (action);
CREATE INDEX IF NOT EXISTS ix_audit_log_created_at ON audit_log (created_at);
