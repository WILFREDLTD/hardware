import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// In-memory storage for base units (in a real app, this would be in a database)
const DEFAULT_UNITS = ['kg', 'g', 'liter', 'pcs', 'meter', 'bag', 'box'];
let customUnits: string[] = [];

const unitSchema = z.object({
  unit: z.string().min(1).toLowerCase(),
});

// GET - Retrieve all base units
export async function GET() {
  try {
    const allUnits = [...DEFAULT_UNITS, ...customUnits];
    return NextResponse.json(allUnits);
  } catch (error: any) {
    console.error('Error fetching base units:', error);
    return NextResponse.json(
      { error: 'Failed to fetch base units' },
      { status: 500 }
    );
  }
}

// POST - Create a new base unit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { unit } = unitSchema.parse(body);

    const allUnits = [...DEFAULT_UNITS, ...customUnits];
    if (allUnits.includes(unit)) {
      return NextResponse.json(
        { error: 'Unit already exists' },
        { status: 400 }
      );
    }

    customUnits.push(unit);
    return NextResponse.json({ unit, success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating base unit:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create base unit' },
      { status: 500 }
    );
  }
}
