// src/controllers/fileUpload.controller.ts

import { RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import * as xlsx from 'xlsx';

// example: import your DB service
import * as citizensService from '../services/citizens.service';

// This interface might exist in your citizensService, or you can define it here.
// We'll show it so the code compiles:
export interface CitizenInput {
  firstName: string;
  lastName: string;
  fatherName?: string;
  motherName?: string;
  dob: string;
  personalDoctrine?: string;
  // gender is a union of 'Male' | 'Female' | 'Other'
  gender: 'Male' | 'Female' | 'Other';
  regNumber: string;
  doctrine?: string;
  town?: string;
  judiciary?: string;
  governorate?: string;
  electionDistrict?: string;
}

// A helper to convert Arabic "الذكور"/"الإناث" to "Male"/"Female".
function parseGender(arabic: string): 'Male' | 'Female' | 'Other' {
  if (arabic === 'الذكور') return 'Male';
  if (arabic === 'الإناث') return 'Female';
  return 'Other';
}

// MAIN CONTROLLER
export const uploadFileController: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const ext = path.extname(originalName).toLowerCase();

    let rowCount = 0;
    const errors: Array<{ row: number; error: string }> = [];

    if (ext === '.csv') {
      // CSV logic
      await handleCsvFile(filePath, errors, async (record) => {
        // record => e.g. { "الاسم": "سليمه", "الشهرة": "دبوسي", ... }
        // We map them to your CitizenInput structure:
        const citizenData: CitizenInput = {
          firstName: record['الاسم'] || 'Unknown',
          lastName: record['الشهرة'] || 'Unknown',
          fatherName: record['اسم الأب'] || '',
          motherName: record['اسم الأم'] || '',
          dob: record['تاريخ الولادة'] || '1990-01-01',
          personalDoctrine: record['المذهب الشخصي'] || '',
          gender: parseGender(record['الجنس'] || ''),
          regNumber: record['رقم السجل'] || 'N/A',
          doctrine: record['مذهب السجل'] || '',
          town: record['البلدة أو الحي'] || '',
          judiciary: record['القضاء'] || '',
          governorate: record['المحافظة'] || '',
          electionDistrict: record['الدائرة الانتخابية'] || ''
        };

        await citizensService.createCitizen(citizenData);
      }).then((count) => {
        rowCount = count;
      });

    } else if (ext === '.xlsx' || ext === '.xls') {
      // Excel logic
      rowCount = await handleExcelFile(filePath, errors, async (rowObj) => {
        // rowObj => e.g. { "الاسم": "سليمه", "الشهرة": "دبوسي", ... }
        const citizenData: CitizenInput = {
          firstName: rowObj['الاسم'] || 'Unknown',
          lastName: rowObj['الشهرة'] || 'Unknown',
          fatherName: rowObj['اسم الأب'] || '',
          motherName: rowObj['اسم الأم'] || '',
          dob: rowObj['تاريخ الولادة'] || '1990-01-01',
          personalDoctrine: rowObj['المذهب الشخصي'] || '',
          gender: parseGender(rowObj['الجنس'] || ''),
          regNumber: rowObj['رقم السجل'] || 'N/A',
          doctrine: rowObj['مذهب السجل'] || '',
          town: rowObj['البلدة أو الحي'] || '',
          judiciary: rowObj['القضاء'] || '',
          governorate: rowObj['المحافظة'] || '',
          electionDistrict: rowObj['الدائرة الانتخابية'] || ''
        };

        await citizensService.createCitizen(citizenData);
      });
    } else {
      // unknown file type
      fs.unlink(filePath, () => {});
      res.status(400).json({ error: 'Unsupported file type' });
      return;
    }

    // remove temp file
    fs.unlink(filePath, () => {});

    // success response
    res.json({
      message: 'Upload complete',
      fileType: ext,
      totalRows: rowCount,
      errors
    });
  } catch (err) {
    next(err);
  }
};

/**
 * handleCsvFile
 * parse CSV line by line with csv-parse,
 * calls rowHandler(record) for each row,
 * returns how many rows we processed
 */
async function handleCsvFile(
  filePath: string,
  errors: Array<{ row: number; error: string }>,
  rowHandler: (record: Record<string, string>) => Promise<void>
): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    let rowCount = 0;
    const fileStream = fs.createReadStream(filePath);
    const parser = fileStream.pipe(parse({ columns: true, trim: true }));

    parser.on('data', (record: Record<string, string>) => {
      rowCount++;
      rowHandler(record).catch((e) => {
        errors.push({ row: rowCount, error: (e as Error).message });
      });
    });

    parser.on('end', () => {
      resolve(rowCount);
    });

    parser.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * handleExcelFile
 * parse XLS/XLSX using xlsx, row 0 = headers, subsequent = data
 */
async function handleExcelFile(
  filePath: string,
  errors: Array<{ row: number; error: string }>,
  rowHandler: (rowObj: Record<string, string>) => Promise<void>
): Promise<number> {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const jsonData = xlsx.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
  if (jsonData.length < 2) {
    return 0;
  }
  const headers = jsonData[0].map((h: any) => (h || '').toString().trim());

  let rowCount = 0;

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!Array.isArray(row) || row.length === 0) {
      continue;
    }
    rowCount++;

    // build an object: Arabic header => cell value
    const rowObj: Record<string, string> = {};
    for (let col = 0; col < headers.length; col++) {
      const header = headers[col];
      // e.g. "الاسم", "الشهرة", ...
      rowObj[header] = row[col] ? row[col].toString() : '';
    }

    try {
      await rowHandler(rowObj);
    } catch (e) {
      errors.push({ row: i + 1, error: (e as Error).message });
    }
  }
  return rowCount;
}
