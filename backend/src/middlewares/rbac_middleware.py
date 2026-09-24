from src.constants.error_codes import ERROR_CODES
from src.constants.error_messages import ERROR_MESSAGES
from src.utils.errors import ServiceError


def allow_roles(*roles):
    """路由级 RBAC：service 之外再由 controller 包一层校验。"""

    def guard(user: dict):
        if user.get("role") not in roles:
            raise ServiceError(
                ERROR_CODES["RBAC_DENIED"], ERROR_MESSAGES["RBAC_DENIED"], 403
            )

    return guard
