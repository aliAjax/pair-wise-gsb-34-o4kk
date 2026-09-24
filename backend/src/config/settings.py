import os

PORT = int(os.getenv("PORT", "8000"))

# 容器内默认连 PostgreSQL；本地/测试缺省回退到 SQLite，保证不依赖外部服务。
DEFAULT_SQLITE_URL = "sqlite:///" + os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "fire_inspect_local.db")
)

DB_HOST = os.getenv("DB_HOST", "")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "app_db")
DB_USER = os.getenv("DB_USER", "app_user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "app_password")

if DB_HOST:
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}",
    )
else:
    DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_SQLITE_URL)

JWT_SECRET = os.getenv("JWT_SECRET", "local-dev-secret")
