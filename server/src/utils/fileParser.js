/**
 * File Parser Module
 * Handles parsing of CSV and Excel files (.xlsx, .xls, .axls)
 * Validates file structure and normalizes data to database format
 * Supports flexible column naming with automatic header normalization
 */

import { parse } from "csv-parse/sync";
import XLSX from "xlsx";
import { normalizeHeader } from "./validators.js";

/**
 * Map of required columns with their database field names
 * Keys are normalized (lowercase, no spaces), values are database field names
 */
const requiredColumns = {
  firstname: "firstName",  // Lead's first name
  phone: "phone",          // Lead's contact phone number
  notes: "notes"           // Additional notes or context
};

/**
 * Validates and normalizes spreadsheet rows
 * Ensures all required columns are present and values are valid
 * Performs per-row validation and header mapping
 *
 * @param {Array<Object>} rows - Array of objects representing spreadsheet rows
 * @returns {Array<Object>} Validated and normalized rows ready for distribution
 * @throws {Error} If rows are empty, required columns missing, or data invalid
 *
 * @example
 * Input: [{ "First Name": "John", "Phone": "9876543210", "Notes": "VIP" }]
 * Output: [{ "firstName": "John", "phone": "9876543210", "notes": "VIP" }]
 */
const ensureValidRows = (rows) => {
  // Ensure file has at least one data row
  if (!rows.length) {
    throw new Error("The uploaded file does not contain any rows");
  }

  // Map flexible spreadsheet headers into exact database fields
  // Handles variations like "First Name", "first_name", "FirstName", etc.
  const normalizedRows = rows.map((row, index) => {
    const mapped = {};

    // Iterate through each column in the row
    Object.entries(row).forEach(([key, value]) => {
      // Normalize the column header and check if it matches a required column
      const normalizedKey = normalizeHeader(key);
      if (requiredColumns[normalizedKey]) {
        // Map the value to the normalized database field name
        mapped[requiredColumns[normalizedKey]] = value;
      }
    });

    // Extract and trim all required fields
    const firstName = String(mapped.firstName || "").trim();
    const phone = String(mapped.phone || "").trim();
    const notes = String(mapped.notes || "").trim();

    // Validate that firstName and phone are non-empty
    if (!firstName || !phone) {
      throw new Error(`Row ${index + 2} must include FirstName and Phone`);
    }

    // Validate that phone contains only digits
    if (!/^\d+$/.test(phone)) {
      throw new Error(`Row ${index + 2} has an invalid Phone value`);
    }

    return { firstName, phone, notes };
  });

  // Validate headers AFTER mapping to ensure both CSV and Excel follow same rules
  const firstRowKeys = Object.keys(rows[0] || {}).map(normalizeHeader);
  const missing = Object.keys(requiredColumns).filter(
    (column) => !firstRowKeys.includes(column)
  );

  // Report all missing required columns
  if (missing.length) {
    throw new Error("File must include FirstName, Phone and Notes columns");
  }

  return normalizedRows;
};

/**
 * Main file parser - handles CSV, XLSX, XLS, and AXLS formats
 * Detects file type by extension and uses appropriate parser
 * Returns normalized data ready for distribution
 *
 * @param {Object} file - Multer file object with buffer and originalname
 * @param {Buffer} file.buffer - Binary file content
 * @param {string} file.originalname - Original filename from upload
 * @returns {Array<Object>} Array of normalized distribution items
 * @throws {Error} If file format is invalid, parsing fails, or validation fails
 */
export const parseUpload = (file) => {
  // Extract file extension to determine parser type
  const extension = file.originalname.split(".").pop().toLowerCase();

  // CSV files: use csv-parse library for synchronous parsing
  if (extension === "csv") {
    const rows = parse(file.buffer, {
      columns: true,      // First row contains column headers
      skip_empty_lines: true,
      trim: true          // Trim whitespace from values
    });

    return ensureValidRows(rows);
  }

  // Excel files: use XLSX library to read workbook
  const workbook = XLSX.read(file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];

  // Ensure spreadsheet has at least one sheet
  if (!sheetName) {
    throw new Error("The spreadsheet does not contain a sheet");
  }

  // Convert the first sheet to JSON array
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    defval: "",    // Use empty string for missing cells
    raw: false     // Return strings instead of raw numbers
  });

  return ensureValidRows(rows);
};
