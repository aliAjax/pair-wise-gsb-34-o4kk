class ServiceError(Exception):
    """service 层抛出的业务异常，由 controller/全局处理器分别包装。"""

    def __init__(self, code: str, message: str, status_code: int = 400):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
