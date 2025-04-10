// src/controllers/fileUpload.controller.ts

import { RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import * as xlsx from 'xlsx';
// Example DB service (adjust the import if needed)
import * as citizensService from '../services/citizens.service';

export interface CitizenInput {
  firstName: string;
  lastName: string;
  fatherName?: string;
  motherName?: string;
  dob: string;
  personalDoctrine?: string;
  gender: 'Male' | 'Female' | 'Other';
  regNumber: string;
  doctrine?: string;
  town?: string;
  judiciary?: string;
  governorate?: string;
  electionDistrict?: string;
}

// Helper to parse Arabic gender
function parseGender(arabic: string): 'Male' | 'Female' | 'Other' {
  if (arabic === 'الذكور') return 'Male';
  if (arabic === 'الإناث') return 'Female';
  return 'Other';
}

export const uploadFileController: RequestHandler = async (req, res, next) => {
  try {
    console.log('✅ [uploadFileController] Start handling file upload...');

    if (!req.file) {
      console.log('❌ [uploadFileController] No file in request.');
      res.status(400).json({ error: 'No file uploaded' });
      return; // <--- Important: return after sending a response
    }

    console.log(`ℹ️ [uploadFileController] Uploaded file: ${req.file.originalname}`);

    const filePath = req.file.path; // e.g. "uploads/abc123"
    const ext = path.extname(req.file.originalname).toLowerCase(); // e.g. ".csv" or ".xlsx"

    let rowCount = 0;
    const errors: Array<{ row: number; error: string }> = [];

    if (ext === '.csv') {
      console.log('ℹ️ [uploadFileController] Detected CSV file. Parsing...');

      await handleCsvFile(filePath, errors, async (record) => {
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

        // Insert into DB
        await citizensService.createCitizen(citizenData);
      }).then((count) => {
        rowCount = count;
      });

    } else if (ext === '.xlsx' || ext === '.xls') {
      console.log('ℹ️ [uploadFileController] Detected Excel file. Parsing...');

      rowCount = await handleExcelFile(filePath, errors, async (rowObj) => {
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
      console.log('❌ [uploadFileController] Unsupported file type!');
      fs.unlink(filePath, () => {});
      res.status(400).json({ error: 'Unsupported file type' });
      return; // <--- return after responding
    }

    // Remove temp file
    fs.unlink(filePath, () => {
      console.log('ℹ️ [uploadFileController] Temp file removed.');
    });

    // success
    console.log(`✅ [uploadFileController] Upload complete. Rows processed: ${rowCount}`);
    res.json({
      message: 'Upload complete',
      fileType: ext,
      totalRows: rowCount,
      errors
    });
    return; // <--- return after responding
  } catch (err) {
    next(err);
  }
};

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

  // The first row is headers
  const headers = jsonData[0].map((h: any) => (h || '').toString().trim());
  let rowCount = 0;

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!Array.isArray(row) || row.length === 0) {
      continue;
    }

    rowCount++;

    const rowObj: Record<string, string> = {};
    for (let col = 0; col < headers.length; col++) {
      const header = headers[col];
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
