import time

# 只做 HTTP 访问留痕；业务操作日志由 AuditLogService 落库（处理人/时间/前后状态）。
async def audit_log_middleware(request, call_next):
    start = time.time()
    response = await call_next(request)
    elapsed = round((time.time() - start) * 1000)
    print(
        f"[audit] {request.method} {request.url.path} "
        f"{response.status_code} {elapsed}ms actor={getattr(request.state, 'user', {}).get('role', '-')}"
    )
    return response
