import { useRoleStore } from "../stores/RoleStore";

/** 统一请求 /api，不硬编码主机；身份通过本地角色头传递，无第三方服务。 */
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const role = useRoleStore.getState().role;
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-role": role,
      ...(options.headers ?? {})
    }
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const message = data?.message ?? `请求失败（${res.status}）`;
    throw new Error(message);
  }
  return data as T;
}
