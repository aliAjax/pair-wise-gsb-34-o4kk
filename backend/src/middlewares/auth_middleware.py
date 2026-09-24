from src.constants.user_role import UserRole

# 演示/本地环境用 x-role、x-user-id、x-user-name 头表达身份（不接第三方认证服务）。
DEFAULT_ROLE = "SUPERVISOR"
USER_NAMES = {
    "INSPECTOR": "巡检员-周检",
    "MAINTAINER": "维保商-李修",
    "SUPERVISOR": "物业主管-王管",
    "AUDITOR": "审计员-张审",
}


async def auth_middleware(request, call_next):
    role = request.headers.get("x-role", DEFAULT_ROLE)
    if role not in UserRole:
        role = DEFAULT_ROLE
    try:
        user_id = int(request.headers.get("x-user-id", "0")) or {"INSPECTOR": 11, "MAINTAINER": 21, "SUPERVISOR": 31, "AUDITOR": 41}[role]
    except ValueError:
        user_id = 0
    # 名称固定按角色映射，避免在 HTTP 头传中文
    request.state.user = {
        "id": user_id,
        "role": role,
        "name": USER_NAMES.get(role, role),
    }
    return await call_next(request)
