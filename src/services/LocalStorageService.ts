import JSZip from "jszip";

export type StorageKey =
  | "companies"
  | "departments"
  | "inventory"
  | "items"
  | "activeCompany"
  | "activeDepartment"
  | "language";

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

  static async exportStorage(exportKeys: StorageKey[]): Promise<File> {
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

    const zip = new JSZip();
    zip.file("data.json", JSON.stringify(exportData, null, 2));

    const blob = await zip.generateAsync({ type: "blob" });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `inventory ${timestamp}.zip`;

    return new File([blob], filename, { type: "application/zip" });
  }

  static importStorage(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const zip = await JSZip.loadAsync(
            event.target?.result as ArrayBuffer
          );
          const jsonFile = zip.file("data.json");
          if (jsonFile) {
            const content = await jsonFile.async("string");
            const importData = JSON.parse(content);
            Object.keys(importData).forEach((key) => {
              localStorage.setItem(key, JSON.stringify(importData[key]));
            });
            resolve();
          } else {
            reject(new Error("No data.json file found in the zip"));
          }
        } catch (error) {
          reject(new Error("Failed to parse import file"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Failed to read import file"));
      };
      reader.readAsArrayBuffer(file);
    });
  }
}
