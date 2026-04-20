import * as XLSX from "xlsx";
import { toJsDate } from "./firestoreService";

const normalizeValue = (value) => {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") {
    if (value?.seconds || value?.nanoseconds || typeof value?.toDate === "function") {
      return toJsDate(value).toLocaleString();
    }
    return JSON.stringify(value);
  }
  return value;
};

const rowsFromRecords = (records) =>
  records.map((record) =>
    Object.fromEntries(
      Object.entries(record).map(([key, value]) => [key, normalizeValue(value)])
    )
  );

export const exportWorksheet = (records, fileName, sheetName) => {
  const wb = XLSX.utils.book_new();
  const rows = rowsFromRecords(records);
  const ws = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ message: "No records found" }]);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const exportFullWorkbook = (moduleRecords) => {
  const wb = XLSX.utils.book_new();

  Object.entries(moduleRecords).forEach(([moduleName, records]) => {
    const rows = rowsFromRecords(records);
    const ws = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ message: "No records found" }]);
    XLSX.utils.book_append_sheet(wb, ws, moduleName);
  });

  XLSX.writeFile(wb, `smart-business-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
};
