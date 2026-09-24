# 消防设施巡检维保平台

面向园区和物业公司的消防设备巡检、隐患整改、维保计划和合规台账系统。

## 报修停用 → 复启闭环（设备生命周期）

设备报修后不再被排进周巡检，修好后必须经补检与隐患校验才能恢复在运：

1. **报修停用申请**：巡检员/维保商在设备页或任务页选择设备，填写停用原因和预计恢复日，生成停用/复启单（`PENDING`）。
2. **主管确认停用**：物业主管确认后设备置为 `DISABLED`；新建巡检任务只自动带入在运设备；所有未开始（`PLANNED`）任务剔除该设备，剔除后无设备的任务置为 `RETURNED` 退回排期（已开始的任务不动）。主管也可驳回。
3. **复启前补检**：停用期间由巡检员/维保商补一次检查（`NORMAL`/`ABNORMAL`），设备仍保持停用。
4. **恢复在运**：主管点击复启时强校验——补检结果正常**且**该设备关联隐患全部 `CLOSED`，二者满足才恢复 `NORMAL`；否则分别返回 `CHECK_ABNORMAL` / `HAZARD_UNFINISHED`。
5. **重新排期**：退回排期的任务可在任务页重新排期，复启后在运设备会重新纳入。

申请、确认、驳回、补检、复启每个环节都记录**处理人、处理时间和设备前后状态**（`audit_log` + 单据字段双留痕），设备页与任务页可直接办理，右上角可切换角色体验权限差异。全程本地数据，不接任何第三方服务。

新增接口（均挂 `/api`）：

- `POST /api/device-status-order/apply` 报修停用申请
- `POST /api/device-status-order/{id}/confirm` 主管确认停用（联动任务退回）
- `POST /api/device-status-order/{id}/reject` 主管驳回
- `POST /api/device-status-order/{id}/check` 复启前补检
- `POST /api/device-status-order/{id}/reactivate` 校验通过后恢复在运
- `GET /api/device-status-order`、`GET /api/device-status-order/{id}` 单据查询
- `POST /api/inspection-task` 新建巡检（自动排除停用设备）、`POST /api/inspection-task/{id}/reschedule` 退回任务重新排期
- `GET /api/audit-log` 操作日志

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20103>

后端健康检查：<http://localhost:21103/health>


## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`（Vite 已把 `/api` 代理到 `http://localhost:21103`）
- 后端：进入 `backend` 后按技术栈运行开发命令，接口统一挂在 `/api`。
  ```bash
  cd backend && pip install -r requirements.txt
  DATABASE_URL="sqlite:///$(pwd)/fire_inspect_local.db" uvicorn src.main:app --port 21103
  ```
  不设置 `DB_HOST` 时默认使用本地 SQLite 文件并在首次启动自动建表灌种子；容器内通过 `DB_HOST` 连接 PostgreSQL。本地演示用 `x-role` 请求头切换角色（INSPECTOR/MAINTAINER/SUPERVISOR/AUDITOR），页面右上角也可切换。

### 分层结构（接口 / 存储 / 页面分离）

- 接口：`routes`（路由）→ `controllers`（参数包装）→ `services`（业务规则）→ `repositories`（数据访问），异常在 service/controller 分别包装，由错误处理中间件统一出口。
- 存储：SQLAlchemy ORM 位于 `models/`，表结构同步 `database/init.sql`；`bootstrap.py` 负责建表和种子。停用/复启单据、审计日志独立建表。
- 页面：`api/`（请求）→ `stores/`（状态）→ `hooks/`（办理流程）→ `components/common`（共用办理面板/时间线/清单）→ `pages`。


## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + Material UI + Redux Toolkit |
| 后端 | FastAPI + Python 3.11 + SQLAlchemy 2.0 |
| 数据库 | PostgreSQL 15 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `fire-inspect`
- `FRONTEND_PORT`: 前端端口，默认 `20103`
- `BACKEND_PORT`: 后端端口，默认 `21103`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: fire-inspect`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-fire-inspect}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- DeviceType: constants/DeviceType、types/DeviceType、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- InspectionStatus: constants/InspectionStatus、types/InspectionStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。新增 `RETURNED`（退回排期）。
- HazardSeverity: constants/HazardSeverity、types/HazardSeverity、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- DeviceStatus（新增，NORMAL/DISABLED）：后端 `constants/device_status.py`、`models/fire_device.py`、service 联动校验、`init.sql`；前端 `constants/DeviceStatus.ts`、`types/FireDevice.ts`、`statusText`、`StatusBadge`、设备筛选器、停用办理面板。
- DeviceStatusOrderState（新增，PENDING/REJECTED/DISABLED/REACTIVATING/REACTIVATED）：后端 `constants/device_status_order_state.py`、`models/device_status_order.py`、service 状态机、控制器、日志模板；前端 `constants/DeviceStatusOrderState.ts`、`types/DeviceStatusOrder.ts`、constructor、store、办理面板与时间线。
- ReactivationCheckResult（新增，NORMAL/ABNORMAL）：后端 `constants/reactivation_check_result.py`、补检 payload、service 复启校验；前端 `constants/ReactivationCheckResult.ts`、constructor、补检表单。
- RectifyStatus（新增，…/CLOSED）：后端 `constants/rectify_status.py`、隐患仓储的“未处理完”判定；前端隐患页展示。
- UserRole（新增，INSPECTOR/MAINTAINER/SUPERVISOR/AUDITOR）：后端 `constants/user_role.py`、auth 中间件、RBAC；前端 `stores/RoleStore.ts` 与角色切换器。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
