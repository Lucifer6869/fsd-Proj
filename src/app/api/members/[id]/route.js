
// src/app/api/members/[id]/route.js
import { NextRequest, NextResponse } from 'next/server';
import { getMembersCollection } from '@/lib/mongodb'; // Import MongoDB utility
import { ObjectId } from 'mongodb'; // Import ObjectId
import path from 'path';
import fs from 'fs/promises'; // For deleting local images

export async function GET(
  request, // Removed type: NextRequest
  { params } // Removed type: { params: { id: string } }
) {
  const memberId = params.id;

  // Validate if the ID is a valid MongoDB ObjectId
  if (!ObjectId.isValid(memberId)) {
      return NextResponse.json({ success: false, message: 'Invalid member ID format' }, { status: 400 });
  }

  try {
    const membersCollection = await getMembersCollection();
    const memberObjectId = new ObjectId(memberId);

    // Find member in MongoDB by _id
    const member = await membersCollection.findOne({ _id: memberObjectId });

    if (member) {
      // Convert MongoDB ObjectId to string for JSON serialization
      const memberWithStrId = {
          ...member,
          _id: undefined, // Remove original _id
          id: member._id.toString() // Add string version as 'id'
      };
      // Return the found member
      return NextResponse.json({ success: true, data: memberWithStrId });
    } else {
      // Member not found
      return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 });
    }

  } catch (error) {
    console.error(`Error fetching member ${memberId} from MongoDB:`, error);
     // Check if the error is a MongoDB connection error
    if (error.message.includes('Could not connect to MongoDB')) {
        return NextResponse.json({ success: false, message: 'Database connection error', error: error.message }, { status: 503 }); // Service Unavailable
    }
    return NextResponse.json({ success: false, message: 'Error fetching member', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(
  request, // Removed type: NextRequest
  { params } // Removed type: { params: { id: string } }
) {
  const memberId = params.id;
  console.log(`DELETE /api/members/${memberId} received`);

  // Validate if the ID is a valid MongoDB ObjectId
  if (!ObjectId.isValid(memberId)) {
      return NextResponse.json({ success: false, message: 'Invalid member ID format' }, { status: 400 });
  }

  try {
    const membersCollection = await getMembersCollection();
    const memberObjectId = new ObjectId(memberId);

    // Find the member first to get image URL for cleanup
    const memberToDelete = await membersCollection.findOne({ _id: memberObjectId });

    if (!memberToDelete) {
       console.log(`Member with ID ${memberId} not found for deletion.`);
       return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 });
    }

    // Attempt to delete the member from the database
    const deleteResult = await membersCollection.deleteOne({ _id: memberObjectId });

    if (deleteResult.deletedCount === 0) {
        // This case should ideally be caught by the findOne check above, but added for safety
        console.log(`Member with ID ${memberId} not found during deletion attempt.`);
        return NextResponse.json({ success: false, message: 'Member not found for deletion' }, { status: 404 });
    }

    console.log(`Deleted member ${memberToDelete.name} (ID: ${memberId}) from MongoDB.`);

    // --- Image Cleanup (Local Storage) ---
    // Optional: Delete associated image file if it exists and is locally stored
    if (memberToDelete.imageUrl && memberToDelete.imageUrl.startsWith('/uploads/')) {
        const imagePath = path.join(process.cwd(), 'public', memberToDelete.imageUrl);
        try {
          await fs.unlink(imagePath);
          console.log(`Deleted local image file: ${imagePath}`);
          // NOTE: If using cloud storage, trigger deletion from the storage service here.
        } catch (fileError) {
          // Log error but don't fail the overall delete operation if file cleanup fails
          if (fileError.code === 'ENOENT') {
            console.warn(`Image file not found for deletion, might have been removed already: ${imagePath}`);
          } else {
             console.error(`Error deleting image file ${imagePath}:`, fileError);
          }
        }
    }
    // --- End Image Cleanup ---

    return NextResponse.json({ success: true, message: 'Member deleted successfully' });

  } catch (error) {
    console.error(`Error deleting member ${memberId} from MongoDB:`, error);
     // Check if the error is a MongoDB connection error
    if (error.message.includes('Could not connect to MongoDB')) {
        return NextResponse.json({ success: false, message: 'Database connection error', error: error.message }, { status: 503 }); // Service Unavailable
    }
    return NextResponse.json({ success: false, message: 'Error deleting member', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}


// Add PUT (update) handler here in the future using MongoDB update operations.
// export async function PUT(request, { params }) { ... }
