from datetime import datetime


def audit_target(kind, id):
    return f"{kind}#{id}"


def now_text() -> str:
    """统一留痕时间格式：本地时间 ISO 字符串（不接第三方时间服务）。"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def parse_device_ids(raw: str | None) -> list[int]:
    if not raw:
        return []
    return [int(part) for part in str(raw).split(",") if part.strip()]


def join_device_ids(ids: list[int]) -> str:
    return ",".join(str(i) for i in ids)


def actor_label(user: dict) -> str:
    return f"{user.get('name') or user.get('role')}#{user.get('id')}"
