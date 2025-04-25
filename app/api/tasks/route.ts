import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract task data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const image = formData.get("image") as File;
    
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }
    
    let imageUrl: string | undefined;
    
    // Handle image upload if present
    if (image) {
      const bytes = await image.arrayBuffer();
      const uint8Array = new Uint8Array(bytes);
      
      // Generate unique filename
      const uniqueId = uuidv4();
      const filename = `${uniqueId}-${image.name}`;
      
      // Save to public/uploads directory
      const uploadDir = join(process.cwd(), "public", "uploads");
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, uint8Array);
      
      imageUrl = `/uploads/${filename}`;
    }
    
    // Create task object
    const task = {
      id: uuidv4(),
      title,
      description,
      priority,
      completed: false,
      createdAt: new Date(),
      dueDate: new Date(),
      imageUrl,
    };
    
    // TODO: Save task to your database here
    
    return NextResponse.json({
      success: true,
      data: task
    });
    
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
} 