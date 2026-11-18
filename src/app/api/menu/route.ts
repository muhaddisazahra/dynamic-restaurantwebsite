
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing");
}

const sql = neon(databaseUrl);

export const dynamic = "force-dynamic";

const validCategories = [
  "Starters",
  "Main Course",
  "Desserts",
  "Drinks",
];

// GET: Fetch all menu items
export async function GET() {
  try {
    const items = await sql`
      SELECT id, name, price, description, category
      FROM menu_items
      ORDER BY id DESC
    `;

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET error:", error);

    return NextResponse.json(
      { error: "Unable to fetch menu items" },
      { status: 500 }
    );
  }
}

// POST: Add a menu item
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, price, description, category } = body;
    const numericPrice = Number(price);

    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      !name.trim() ||
      !description.trim() ||
      price === "" ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0 ||
      !validCategories.includes(category)
    ) {
      return NextResponse.json(
        { error: "Please enter valid menu details" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO menu_items
        (name, price, description, category)
      VALUES
        (
          ${name.trim()},
          ${numericPrice},
          ${description.trim()},
          ${category}
        )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("POST error:", error);

    return NextResponse.json(
      { error: "Unable to add menu item" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a menu item
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Invalid menu item ID" },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM menu_items
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("DELETE error:", error);

    return NextResponse.json(
      { error: "Unable to delete menu item" },
      { status: 500 }
    );
  }
}
