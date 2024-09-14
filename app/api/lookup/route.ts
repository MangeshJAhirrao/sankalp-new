import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const data: Record<string, Record<string, string>> = {};

try {
  const csvPath = path.join(process.cwd(), 'public', 'final_app_itinerary.csv');
  const records = parse(fs.readFileSync(csvPath, 'utf-8'), {
    columns: true,
    skip_empty_lines: true
  });
  records.forEach((row: Record<string, string>) => {
    const email = row.Email?.trim().toLowerCase() || '';
    data[email] = row;
  });
  console.log('CSV file successfully processed');
} catch (error) {
  console.error('Error reading CSV file:', error);
}

export async function POST(request: Request) {
  const { email } = await request.json();
  const lookupEmail = email.trim().toLowerCase();
  if (data[lookupEmail]) {
    return NextResponse.json(data[lookupEmail]);
  } else {
    return NextResponse.json({ error: 'Email not found' }, { status: 404 });
  }
}