// src/app/api/members/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// --- IMPORTANT ---
// This is a placeholder API route using the mock database.
// Replace with actual MongoDB fetching logic using the member's ID.
// -----------------

// Reuse the mock database and type from the other route file
interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  contactInfo?: string;
  imageUrl?: string;
}

// Assume mockMembers is accessible here or fetched/imported
// For simplicity, redefining it here, but ideally share it or use a proper DB connection.
const mockMembers: TeamMember[] = [
 { id: "1", name: "Alice Wonderland", role: "Project Manager", email: "alice.wonder@example.com", contactInfo: "LinkedIn: /in/alicew", imageUrl: "/uploads/alice.jpg" },
  { id: "2", name: "Bob The Builder", role: "Lead Developer", email: "bob.builder@example.com", contactInfo: "555-1234", imageUrl: "/uploads/bob.jpg" },
  { id: "3", name: "Charlie Chaplin", role: "UI/UX Designer", email: "charlie.c@example.com", contactInfo: "Portfolio: charliedesigns.com" }, // No image
  { id: "4", name: "Diana Prince", role: "Backend Developer", email: "diana.prince@example.com", imageUrl: "/uploads/diana.jpg" },
  { id: "5", name: "Ethan Hunt", role: "QA Tester", email: "ethan.hunt@example.com", contactInfo: "Available on Slack", imageUrl: "/uploads/ethan.jpg" },
];
// -----------------------------------------------------------


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const memberId = params.id;

  // In a real app, fetch from MongoDB using the memberId
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 50));

    const member = mockMembers.find(m => m.id === memberId);

    if (member) {
      // Return the found member
       // IMPORTANT: Ensure the image URL is correctly formatted
       return NextResponse.json(member);
    } else {
      // Member not found
      return NextResponse.json({ message: 'Member not found' }, { status: 404 });
    }

  } catch (error) {
    console.error(`Error fetching member ${memberId}:`, error);
    return NextResponse.json({ message: 'Error fetching member', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

// Add PUT (update) and DELETE handlers here if needed in the future.
// export async function PUT(request: NextRequest, { params }: { params: { id: string } }) { ... }
// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) { ... }
