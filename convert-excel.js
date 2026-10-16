const fs = require('node:fs');
const path = require('node:path');
const XLSX = require('xlsx');

const [, , inputFile = 'friends.xlsx', outputFile = 'wishes.json'] = process.argv;
const workbook = XLSX.readFile(inputFile);
const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

const toBoolean = (value) => ['true', 'yes', '1'].includes(String(value).trim().toLowerCase());
const wishes = rows.map((row, index) => ({
  id: String(row.id || row.name || `friend-${index + 1}`).trim().toLowerCase().replace(/\s+/g, '-'),
  name: String(row.name || '').trim(),
  dodge: toBoolean(row.dodge),
  dodgeSeconds: Number(row.dodgeSeconds) || 7,
  message: String(row.message || '').trim(),
  noMessage: String(row.noMessage || 'Come on, you know you want to know!').trim()
}));

fs.writeFileSync(path.resolve(outputFile), `${JSON.stringify(wishes, null, 2)}\n`);
console.log(`Wrote ${wishes.length} wishes to ${outputFile}`);
