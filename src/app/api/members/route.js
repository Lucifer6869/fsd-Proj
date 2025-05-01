// src/app/api/members/route.js
import { NextRequest, NextResponse } from 'next/server';
// Removed type import: import { TeamMember } from '@/lib/types';
import path from 'path';
import fs from 'fs/promises'; // Use promises API for async operations

// --- IMPORTANT ---
// This is a placeholder API route using an in-memory array.
// In a real application, replace this with actual database interactions (e.g., MongoDB).
// File handling is simulated here; replace with actual saving to disk or cloud storage.
// Robust error handling and validation are crucial in production.
// -----------------

// --- Mock Database (In-Memory) ---
// Define the mock array outside the handlers to persist across requests *within the same server process*.
// This is NOT suitable for production or even reliable multi-user development.
let mockMembers = [ // Removed type: TeamMember[]
  { id: "1", name: "Alice Wonderland", role: "Project Manager", email: "alice.wonder@example.com", contactInfo: "LinkedIn: /in/alicew", imageUrl: "/uploads/mock-alice.jpg" },
  { id: "2", name: "Bob The Builder", role: "Lead Developer", email: "bob.builder@example.com", contactInfo: "555-1234", imageUrl: "/uploads/mock-bob.jpg" },
  { id: "3", name: "Charlie Chaplin", role: "UI/UX Designer", email: "charlie.c@example.com", contactInfo: "Portfolio: charliedesigns.com" }, // No image
  { id: "4", name: "Diana Prince", role: "Backend Developer", email: "diana.prince@example.com", imageUrl: "/uploads/mock-diana.jpg" },
  { id: "5", name: "Ethan Hunt", role: "QA Tester", email: "ethan.hunt@example.com", contactInfo: "Available on Slack", imageUrl: "/uploads/mock-ethan.jpg" },
];
let nextId = 6; // Simple ID incrementer

// Attempt to make it globally accessible (very hacky, unreliable)
if (typeof global !== 'undefined') {
  (global ).mockMembers = mockMembers;
  (global ).nextId = nextId;
}
// --------------------

// Ensure the uploads directory exists (run once on server start)
const ensureUploadsDirExists = async () => {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try {
        await fs.access(uploadDir);
    } catch {
        console.log("Creating uploads directory:", uploadDir);
        await fs.mkdir(uploadDir, { recursive: true });
    }
};
ensureUploadsDirExists(); // Call it immediately

export async function GET(request) { // Removed type: NextRequest
  // In a real app, fetch from MongoDB here
  try {
    // Simulate async operation if needed (e.g., DB query delay)
    // await new Promise(resolve => setTimeout(resolve, 50));

    // Use the potentially globally updated array
     const currentMembers = (typeof global !== 'undefined' && (global ).mockMembers) ? (global ).mockMembers : mockMembers;


    // Return the current list of members
    // Make sure image URLs are relative paths accessible by the client
    return NextResponse.json({ success: true, data: currentMembers });

  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ success: false, message: 'Error fetching members', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}


export async function POST(request) { // Removed type: NextRequest
  // Real app: Parse, validate, handle file upload, save to DB.
  try {
    const formData = await request.formData();
    const name = formData.get('name'); // Removed type assertion: as string
    const role = formData.get('role'); // Removed type assertion: as string
    const email = formData.get('email'); // Removed type assertion: as string
    const contactInfo = formData.get('contactInfo'); // Removed type assertion: as string | undefined
    const imageFile = formData.get('image'); // Removed type assertion: as File | undefined

    // Basic server-side validation (add more robust validation as needed)
    if (!name || !role || !email) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    let imageUrl = undefined; // Removed type: string | undefined
    let imageSaved = false;

    if (imageFile && imageFile.size > 0) {
        // ** File Saving Logic **
        // This section attempts to save the file to `public/uploads`.
        // Needs proper error handling and potentially more robust filename generation.
        try {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            // Sanitize filename - replace spaces, special chars etc. (basic example)
            const safeFilename = imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const filename = `${uniqueSuffix}-${safeFilename}`;
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            const uploadPath = path.join(uploadDir, filename);

            // Ensure directory exists before writing
            await ensureUploadsDirExists();

            await fs.writeFile(uploadPath, buffer);
            imageUrl = `/uploads/${filename}`; // Path accessible by the client
            imageSaved = true;
            console.log(`Image saved successfully: ${imageUrl}`);
        } catch (uploadError) {
             console.error("Error saving image:", uploadError);
             // Decide if you want to fail the whole request or proceed without image
             // For this example, we'll proceed without image but log the error.
              imageUrl = undefined; // Ensure imageUrl is undefined if save fails
               // Optionally return an error response:
               // return NextResponse.json({ success: false, message: 'Error saving image', error: uploadError instanceof Error ? uploadError.message : String(uploadError) }, { status: 500 });
        }
    } else {
         console.log("No image file provided or file is empty.");
    }


    // Use the potentially globally updated ID counter
    let currentNextId = (typeof global !== 'undefined' && (global ).nextId) ? (global ).nextId : nextId;

    const newMember = { // Removed type: TeamMember
      id: String(currentNextId++),
      name,
      role,
      email,
      contactInfo: contactInfo || undefined, // Ensure it's undefined if empty
      imageUrl, // Will be undefined if no image or save failed
    };

     // Update the global counters if they exist
     if (typeof global !== 'undefined') {
        (global ).nextId = currentNextId;
        if((global ).mockMembers) {
            (global ).mockMembers.push(newMember);
            console.log("Added new member (global):", newMember.name);
            console.log("Current members (global):", (global ).mockMembers.map(m => m.name));
        } else {
            // Fallback to local if global isn't set up correctly
            mockMembers.push(newMember);
            nextId = currentNextId;
             console.log("Added new member (local fallback):", newMember.name);
             console.log("Current members (local fallback):", mockMembers.map(m => m.name));
        }
    } else {
        // Fallback if global is not defined at all
        mockMembers.push(newMember);
        nextId = currentNextId;
         console.log("Added new member (no global):", newMember.name);
         console.log("Current members (no global):", mockMembers.map(m => m.name));
    }

    // Return success response with the newly added member data
    return NextResponse.json({ success: true, message: "Member added successfully!", data: newMember }, { status: 201 });

  } catch (error) {
    console.error("Error processing POST /api/members:", error);
     return NextResponse.json({ success: false, message: 'Error adding member', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
