export function getFromStorage<T>(key: string, defaultValue: T): T {
  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return defaultValue;
  }
  return JSON.parse(raw);
}

export function saveToStorage<T>(key: string, data: T): T {
  const dataStr = JSON.stringify(data);
  window.localStorage.setItem(key, dataStr);

  return data;
}
