// src/app/api/members/[id]/route.js
import { NextRequest, NextResponse } from 'next/server';

// --- IMPORTANT ---
// This is a placeholder API route using the mock database.
// Replace with actual database fetching logic using the member's ID.
// -----------------

// Assume mockMembers is accessible here because it's defined in the other route file's module scope.
// This relies on module caching in Node.js. In a real app, use a proper DB connection.
// We need to import the sibling route file just to potentially get access to the `mockMembers` array definition.
// This is NOT a good pattern for real applications.
import { GET as _GET, POST as _POST } from '../route'; // Import sibling route to potentially access shared variables (hacky)

// --- Access Mock Database (Hackish Way) ---
// Directly accessing variables from another module like this is generally bad practice.
// Ideally, the data source (DB connection, mock store) should be separate and imported by both.
// But for this mock setup to work with the in-memory array defined in `../route.js`, we try this.
// @ts-ignore - Accessing the mockMembers array defined in the other file (if possible in the runtime)
let mockMembers = (global ).mockMembers || [
   // Fallback if direct access doesn't work (less likely to be consistent)
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
// Update global reference if needed
global.mockMembers = mockMembers;

// -----------------------------------------


export async function GET(
  request,
  { params }
) {
  const memberId = params.id;

  // Log the state of mockMembers when this route is hit
  // console.log("GET /api/members/[id] - Current mockMembers:", mockMembers.map(m => ({id: m.id, name: m.name})));

  // In a real app, fetch from DB using the memberId
  try {
    // Simulate async operation if needed
    // await new Promise(resolve => setTimeout(resolve, 50));

    // Find member in the potentially shared (but unreliable) mock array
    const member = mockMembers.find(m => m.id === memberId);

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

// Add PUT (update) and DELETE handlers here if needed in the future.
// export async function PUT(request, { params }) { ... }
// export async function DELETE(request, { params }) { ... }
