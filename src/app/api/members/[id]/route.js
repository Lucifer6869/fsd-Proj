// src/app/api/members/[id]/route.js
import { NextRequest, NextResponse } from 'next/server';
// Removed type import: import { TeamMember } from '@/lib/types';

// --- IMPORTANT ---
// This is a placeholder API route using the mock database.
// Replace with actual MongoDB fetching logic using the member's ID.
// -----------------

// Assume mockMembers is accessible here because it's defined in the other route file's module scope.
// This relies on module caching in Node.js. In a real app, use a proper DB connection.
// We need to import the route file just to potentially get access to the `mockMembers` array definition.
// This is NOT a good pattern for real applications.
// import { GET as _GET, POST as _POST } from '../route'; // Import sibling route (might not work reliably in JS)

// --- Access Mock Database (Hackish Way) ---
// Directly accessing variables from another module like this is generally bad practice.
// Ideally, the data source (DB connection, mock store) should be separate and imported by both.
// We define it here as a fallback and hope the other module initializes it globally if possible.
let mockMembers = (global ).mockMembers || [
   // Fallback definition
   { id: "1", name: "Alice Wonderland", role: "Project Manager", email: "alice.wonder@example.com", contactInfo: "LinkedIn: /in/alicew", imageUrl: "/uploads/mock-alice.jpg" },
   { id: "2", name: "Bob The Builder", role: "Lead Developer", email: "bob.builder@example.com", contactInfo: "555-1234", imageUrl: "/uploads/mock-bob.jpg" },
   { id: "3", name: "Charlie Chaplin", role: "UI/UX Designer", email: "charlie.c@example.com", contactInfo: "Portfolio: charliedesigns.com" }, // No image
   { id: "4", name: "Diana Prince", role: "Backend Developer", email: "diana.prince@example.com", imageUrl: "/uploads/mock-diana.jpg" },
   { id: "5", name: "Ethan Hunt", role: "QA Tester", email: "ethan.hunt@example.com", contactInfo: "Available on Slack", imageUrl: "/uploads/mock-ethan.jpg" },
];
// Attempt to update the reference if the other module initializes it globally (very unreliable)
if ((global ).mockMembers) {
    mockMembers = (global ).mockMembers;
}
// -----------------------------------------


export async function GET(
  request, // Removed type: NextRequest
  { params } // Removed type: { params: { id: string } }
) {
  const memberId = params.id;

  // Log the state of mockMembers when this route is hit
  // console.log("GET /api/members/[id] - Current mockMembers:", mockMembers.map(m => ({id: m.id, name: m.name})));

  // In a real app, fetch from MongoDB using the memberId
  try {
    // Simulate async operation if needed
    // await new Promise(resolve => setTimeout(resolve, 50));

    // Find member in the potentially shared (but unreliable) mock array
    const currentMembers = (typeof global !== 'undefined' && (global ).mockMembers) ? (global ).mockMembers : mockMembers;
    const member = currentMembers.find(m => m.id === memberId);

    if (member) {
      // Return the found member
      return NextResponse.json({ success: true, data: member });
    } else {
      // Member not found
      return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 });
    }

  } catch (error) {
    console.error(`Error fetching member ${memberId}:`, error);
    return NextResponse.json({ success: false, message: 'Error fetching member', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(
  request, // Removed type: NextRequest
  { params } // Removed type: { params: { id: string } }
) {
  const memberId = params.id;
  console.log(`DELETE /api/members/${memberId} received`);

  try {
    // Access the potentially global array
    let currentMembers = (typeof global !== 'undefined' && (global ).mockMembers) ? (global ).mockMembers : mockMembers;
    const memberIndex = currentMembers.findIndex(m => m.id === memberId);

    if (memberIndex === -1) {
       console.log(`Member with ID ${memberId} not found for deletion.`);
       return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 });
    }

    // Remove the member from the array
    const deletedMember = currentMembers.splice(memberIndex, 1)[0]; // Remove and get the deleted item
    console.log(`Removed member: ${deletedMember.name}`);

     // If using the global hack, update the global array reference directly.
     // If not, this update affects the local `mockMembers` for this module instance.
     if (typeof global !== 'undefined' && (global ).mockMembers) {
         (global ).mockMembers = currentMembers;
         console.log("Global mockMembers updated after deletion.");
     } else {
         mockMembers = currentMembers; // Update local if global doesn't exist
         console.log("Local mockMembers updated after deletion.");
     }

    // Optional: Delete associated image file if it exists
    if (deletedMember.imageUrl && deletedMember.imageUrl.startsWith('/uploads/')) {
        // Implement file deletion logic here (e.g., using fs.unlink)
        // Be cautious with file paths and error handling.
        // Example (needs fs import and error handling):
        // const imagePath = path.join(process.cwd(), 'public', deletedMember.imageUrl);
        // try {
        //   await fs.unlink(imagePath);
        //   console.log(`Deleted image file: ${imagePath}`);
        // } catch (fileError) {
        //   console.error(`Error deleting image file ${imagePath}:`, fileError);
        //   // Decide if this should cause the API call to fail or just log a warning
        // }
    }

    return NextResponse.json({ success: true, message: 'Member deleted successfully' });

  } catch (error) {
    console.error(`Error deleting member ${memberId}:`, error);
    return NextResponse.json({ success: false, message: 'Error deleting member', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}


// Add PUT (update) handler here if needed in the future.
// export async function PUT(request, { params }) { ... }

```