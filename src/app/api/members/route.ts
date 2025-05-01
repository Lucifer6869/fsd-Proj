// src/app/api/members/route.ts
import { NextRequest, NextResponse } from 'next/server';

// --- IMPORTANT ---
// This is a placeholder API route. You need to replace the mock logic
// with actual database interactions (e.g., MongoDB) and file handling.
// You would typically use a library like `mongoose` for MongoDB interactions
// and `fs` or a cloud storage service (like Firebase Storage, AWS S3) for image uploads.
// Error handling and validation should also be more robust.
// -----------------


// --- Mock Database ---
interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  contactInfo?: string;
  imageUrl?: string; // This would store the path/URL after saving the image
}

let mockMembers: TeamMember[] = [
  { id: "1", name: "Alice Wonderland", role: "Project Manager", email: "alice.wonder@example.com", contactInfo: "LinkedIn: /in/alicew", imageUrl: "/uploads/alice.jpg" }, // Assuming images are saved in public/uploads
  { id: "2", name: "Bob The Builder", role: "Lead Developer", email: "bob.builder@example.com", contactInfo: "555-1234", imageUrl: "/uploads/bob.jpg" },
  { id: "3", name: "Charlie Chaplin", role: "UI/UX Designer", email: "charlie.c@example.com", contactInfo: "Portfolio: charliedesigns.com" }, // No image
  { id: "4", name: "Diana Prince", role: "Backend Developer", email: "diana.prince@example.com", imageUrl: "/uploads/diana.jpg" },
  { id: "5", name: "Ethan Hunt", role: "QA Tester", email: "ethan.hunt@example.com", contactInfo: "Available on Slack", imageUrl: "/uploads/ethan.jpg" },
];
let nextId = 6;
// --------------------

export async function GET(request: NextRequest) {
  // In a real app, fetch from MongoDB here
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 50));

    // Return the list of members
    // IMPORTANT: Ensure the image URL is correctly formatted for the client
    // If saving to public/uploads, the URL should be relative like '/uploads/filename.jpg'
    return NextResponse.json(mockMembers); // Return the whole array directly

  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ message: 'Error fetching members', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  // In a real app:
  // 1. Parse the FormData from the request.
  // 2. Validate the data (e.g., using Zod on the server too).
  // 3. Handle the image upload:
  //    - Save the file to a designated folder (e.g., `public/uploads`) or cloud storage.
  //    - Generate a unique filename or use the member's ID.
  //    - Store the file path/URL.
  // 4. Insert the member data (including the image path/URL) into MongoDB.
  // 5. Return a success or error response.

  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const email = formData.get('email') as string;
    const contactInfo = formData.get('contactInfo') as string | undefined;
    const imageFile = formData.get('image') as File | undefined;

    // Basic server-side validation (add more robust validation)
    if (!name || !role || !email) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let imageUrl: string | undefined = undefined;

    if (imageFile) {
        // ** VERY IMPORTANT: File Saving Logic Needed Here **
        // This is where you'd save the `imageFile` to your server filesystem (e.g., public/uploads)
        // or upload it to cloud storage (like Firebase Storage, S3).
        // You'll need libraries like `fs` (for filesystem) or the respective cloud SDKs.
        // Example (Conceptual - Needs proper implementation with error handling):
        // const bytes = await imageFile.arrayBuffer();
        // const buffer = Buffer.from(bytes);
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // const filename = `${uniqueSuffix}-${imageFile.name}`;
        // const uploadPath = path.join(process.cwd(), 'public/uploads', filename); // Ensure 'public/uploads' exists
        // await fs.promises.writeFile(uploadPath, buffer);
        // imageUrl = `/uploads/${filename}`; // Path accessible by the client
         console.log(`Simulating save for image: ${imageFile.name}`);
         imageUrl = `/uploads/mock-${Date.now()}.jpg`; // Placeholder URL for demo
    }


    const newMember: TeamMember = {
      id: String(nextId++),
      name,
      role,
      email,
      contactInfo,
      imageUrl,
    };

    mockMembers.push(newMember);
    console.log("Added new member:", newMember);

    // Return success response with the newly added member data
    return NextResponse.json({ success: true, message: "Member added successfully!", data: newMember }, { status: 201 });

  } catch (error) {
    console.error("Error adding member:", error);
     return NextResponse.json({ success: false, message: 'Error adding member', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
