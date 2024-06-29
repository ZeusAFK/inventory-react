export type StorageKey =
  | "companies"
  | "departments"
  | "inventory"
  | "item"
  | "activeCompany";

export class LocalStorageService {
  static getItem<T>(key: StorageKey): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  static setItem<T>(key: StorageKey, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static removeItem(key: StorageKey): void {
    localStorage.removeItem(key);
  }

  static exportStorage(exportKeys: StorageKey[]): File {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exportData: { [key in StorageKey]?: any } = {};

    exportKeys.forEach((key) => {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          exportData[key] = JSON.parse(item);
        } catch {
          exportData[key] = item;
        }
      }
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    return new File([blob], "localStorageBackup.json", {
      type: "application/json",
    });
  }

  static importStorage(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importData = JSON.parse(event.target?.result as string);
          Object.keys(importData).forEach((key) => {
            localStorage.setItem(key, JSON.stringify(importData[key]));
          });
          resolve();
        } catch (error) {
          reject(new Error("Failed to parse import file"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Failed to read import file"));
      };
      reader.readAsText(file);
    });
  }
}
