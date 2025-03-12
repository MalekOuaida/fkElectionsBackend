import csv from "csv-parser";
import XLSX from "xlsx";
import { Readable } from "stream";

export const parseCSV = (buffer: Buffer): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const results: any[] = [];
        const stream = Readable.from(buffer.toString());
        stream.pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (err) => reject(err));
    });
};

export const parseExcel = (buffer: Buffer): any[] => {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);
};
