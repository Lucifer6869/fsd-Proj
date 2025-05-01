
// src/app/api/members/route.js
import { NextRequest, NextResponse } from 'next/server';
import { getMembersCollection } from '@/lib/mongodb'; // Import MongoDB utility


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

    const membersCollection = await getMembersCollection();

    // Check if email already exists
    const existingMember = await membersCollection.findOne({ email: email });
    if (existingMember) {
        return NextResponse.json({ success: false, message: 'Member with this email already exists.' }, { status: 409 }); // Conflict
    }


    const memberDocument = {
      name,
      role,
      email,
      contactInfo: contactInfo || undefined, // Store as undefined if empty
      imageUrl: undefined, // Image upload is disabled
      createdAt: new Date(), // Add a timestamp
    };

    const result = await membersCollection.insertOne(memberDocument);

    if (!result.insertedId) {
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
