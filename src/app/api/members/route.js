
// src/app/api/members/route.js
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises'; // Use promises API for async operations
import { getMembersCollection } from '@/lib/mongodb'; // Import MongoDB utility

// --- File Handling Setup ---
// Ensure the uploads directory exists (run once on server start is tricky in serverless, do it per request)
const ensureUploadsDirExists = async () => {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try {
        await fs.access(uploadDir);
    } catch {
        console.log("Creating uploads directory:", uploadDir);
        try {
             await fs.mkdir(uploadDir, { recursive: true });
        } catch (mkdirError) {
            // Handle potential race conditions if multiple requests try to create the dir
            if (mkdirError.code !== 'EEXIST') {
                console.error("Failed to create upload directory:", mkdirError);
                throw mkdirError; // Re-throw if it's not an existence error
            }
        }
    }
};
// --------------------

export async function GET(request) { // Removed type: NextRequest
  try {
    const membersCollection = await getMembersCollection();
    const members = await membersCollection.find({}).toArray();

    // Convert MongoDB ObjectId to string for JSON serialization
    const membersWithStrId = members.map(member => ({
        ...member,
        _id: undefined, // Remove original _id
        id: member._id.toString() // Add string version as 'id'
    }));

    return NextResponse.json({ success: true, data: membersWithStrId });

  } catch (error) {
    console.error("Error fetching members from MongoDB:", error);
    // Check if the error is a MongoDB connection error
    if (error.message.includes('Could not connect to MongoDB')) {
        return NextResponse.json({ success: false, message: 'Database connection error', error: error.message }, { status: 503 }); // Service Unavailable
    }
    return NextResponse.json({ success: false, message: 'Error fetching members', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}


export async function POST(request) { // Removed type: NextRequest
  try {
    const formData = await request.formData();
    const name = formData.get('name'); // Removed type assertion: as string
    const role = formData.get('role'); // Removed type assertion: as string
    const email = formData.get('email'); // Removed type assertion: as string
    const contactInfo = formData.get('contactInfo'); // Removed type assertion: as string | undefined
    const imageFile = formData.get('image'); // Removed type assertion: as File | undefined

    // Basic server-side validation
    if (!name || !role || !email) {
      return NextResponse.json({ success: false, message: 'Missing required fields (name, role, email)' }, { status: 400 });
    }

    // --- Image Upload Handling (Local Storage - Not suitable for production/serverless) ---
    let imageUrl = undefined; // This will store the relative path if upload is successful
    if (imageFile && imageFile.size > 0) {
        console.log("Image file detected:", imageFile.name, imageFile.size);
        // Validate file type and size server-side as well
        if (imageFile.size > 1024 * 1024 * 2) { // Example: Max 2MB
             return NextResponse.json({ success: false, message: 'Image size exceeds 2MB limit.' }, { status: 400 });
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
         if (!allowedTypes.includes(imageFile.type)) {
            return NextResponse.json({ success: false, message: 'Invalid image file type. Allowed: jpg, png, gif, webp.' }, { status: 400 });
        }

        try {
            await ensureUploadsDirExists(); // Ensure dir exists before writing

            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const safeFilename = imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const filename = `${uniqueSuffix}-${safeFilename}`;
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            const uploadPath = path.join(uploadDir, filename);

            await fs.writeFile(uploadPath, buffer);
            imageUrl = `/uploads/${filename}`; // Relative path accessible by the client
            console.log(`Image saved successfully to local storage: ${imageUrl}`);
            // NOTE: In a real production app, upload to cloud storage (S3, Firebase Storage, etc.) here
            // and store the resulting URL or identifier in imageUrl.
        } catch (uploadError) {
             console.error("Error saving image locally:", uploadError);
             // Fail the request if image upload fails, as the client expects it
             return NextResponse.json({ success: false, message: 'Error saving image file', error: uploadError instanceof Error ? uploadError.message : String(uploadError) }, { status: 500 });
        }
    } else {
         console.log("No image file provided or file is empty.");
    }
    // --- End Image Upload Handling ---


    const membersCollection = await getMembersCollection();

    // Check if email already exists
    const existingMember = await membersCollection.findOne({ email: email });
    if (existingMember) {
        // Clean up uploaded image if member exists and image was saved
        if (imageUrl) {
            try {
                 const deletePath = path.join(process.cwd(), 'public', imageUrl);
                 await fs.unlink(deletePath);
                 console.log(`Cleaned up image due to duplicate email: ${deletePath}`);
            } catch (cleanupError) {
                 console.error(`Error cleaning up image file ${imageUrl}:`, cleanupError);
                 // Log but don't fail the request for cleanup error
            }
        }
        return NextResponse.json({ success: false, message: 'Member with this email already exists.' }, { status: 409 }); // Conflict
    }


    const memberDocument = {
      name,
      role,
      email,
      contactInfo: contactInfo || undefined, // Store as undefined if empty
      imageUrl, // Store the relative path or undefined
      createdAt: new Date(), // Add a timestamp
    };

    const result = await membersCollection.insertOne(memberDocument);

    if (!result.insertedId) {
        // Clean up uploaded image if DB insert fails
        if (imageUrl) {
            try {
                 const deletePath = path.join(process.cwd(), 'public', imageUrl);
                 await fs.unlink(deletePath);
                 console.log(`Cleaned up image due to DB insert failure: ${deletePath}`);
            } catch (cleanupError) {
                 console.error(`Error cleaning up image file ${imageUrl}:`, cleanupError);
            }
        }
        throw new Error("Failed to insert member into database.");
    }

    // Return success response with the newly added member data (including string ID)
    const newMember = {
        ...memberDocument,
        _id: undefined, // Remove original _id
        id: result.insertedId.toString() // Add string version as 'id'
    };

    console.log("Member added successfully to MongoDB:", newMember.name, newMember.id);
    return NextResponse.json({ success: true, message: "Member added successfully!", data: newMember }, { status: 201 });

  } catch (error) {
    console.error("Error processing POST /api/members:", error);
    // Check if the error is a MongoDB connection error
    if (error.message.includes('Could not connect to MongoDB')) {
        return NextResponse.json({ success: false, message: 'Database connection error', error: error.message }, { status: 503 });
    }
     return NextResponse.json({ success: false, message: 'Error adding member', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
