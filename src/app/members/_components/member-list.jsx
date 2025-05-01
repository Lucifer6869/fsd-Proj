

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button"; // Import buttonVariants
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, AlertTriangle, Trash2, Loader2 } from "lucide-react"; // Added Trash2, Loader2
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"; // Added useToast


// Function to fetch members from the API endpoint
async function fetchMembers() { // Removed return type: Promise<FetchMembersResponse>
  console.log("Fetching members from API...");
  try {
    const response = await fetch('/api/members', {
        cache: 'no-store', // Prevent caching to get the latest list
    });

    // Check if the response status is indicates failure
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to parse error body
        console.error(`API Error: ${response.status}`, errorData);
         // Return structure matching expected error format
         return { success: false, error: errorData.message || `Failed to fetch members. Status: ${response.status}` };
    }

    const result = await response.json(); // Removed type: FetchMembersResponse

    // Additional check if the API returns a specific success flag
    if (result && !result.success) { // Check result exists
        console.error("API reported failure:", result.error);
        // Return structure matching expected error format
        return { success: false, error: result.message || "Failed to fetch members." };
    }

     console.log("Fetched members successfully:", result?.data?.length);
     return result; // Return the successful response { success: true, data: TeamMember[] }

  } catch (error) {
    console.error("Error fetching members:", error);
     // Ensure the returned object matches FetchMembersResponse structure on error
     return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred fetching members." };
  }
}

// Function to delete a member via API
async function deleteMember(id) { // Removed type: string -> Promise<{ success: boolean; message?: string; error?: string }>
    console.log(`Attempting to delete member with ID: ${id}`);
    try {
        const response = await fetch(`/api/members/${id}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok) {
            console.error(`API Error deleting member ${id}: ${response.status}`, result);
            return { success: false, error: result.message || `Request failed with status ${response.status}` };
        }

        if (result && !result.success) {
             console.error(`API reported failure deleting member ${id}:`, result.error);
            return { success: false, error: result.message || "API indicated failure during deletion." };
        }

        console.log(`Member ${id} deleted successfully via API.`);
        return { success: true, message: result.message || 'Member deleted successfully' };

    } catch (error) {
        console.error(`Network or fetch error deleting member ${id}:`, error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown network error occurred during deletion" };
    }
}


export default function MemberList() {
  const [members, setMembers] = React.useState([]); // Removed type: TeamMember[]
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null); // Removed type: string | null
  const [isDeleting, setIsDeleting] = React.useState(false); // State for delete loading
  const [memberToDelete, setMemberToDelete] = React.useState(null); // Removed type: TeamMember | null
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
  const { toast } = useToast();

  // Function to load members, separated for potential refresh logic
  const loadMembers = async () => {
      setIsLoading(true);
      setError(null);
      const result = await fetchMembers();
      if (result?.success && Array.isArray(result.data)) { // Check result and data type
        setMembers(result.data);
      } else {
        setError(result?.error || "An unknown error occurred while loading members."); // Check result exists
      }
      setIsLoading(false);
  };

  React.useEffect(() => {
    loadMembers(); // Load members on initial component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs once on mount

  const openDeleteConfirm = (member) => { // Removed type: TeamMember
      setMemberToDelete(member);
      setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    setIsDeleting(true);
    const result = await deleteMember(memberToDelete.id);

    if (result.success) {
      toast({
        title: "Success!",
        description: result.message || "Member removed successfully.",
      });
      // Update state to remove the member visually
      setMembers((prevMembers) => prevMembers.filter(m => m.id !== memberToDelete.id));
    } else {
      toast({
        variant: "destructive",
        title: "Error Removing Member",
        description: result.error || "Could not remove the member. Please try again.",
      });
    }

    setIsDeleting(false);
    setIsConfirmDialogOpen(false);
    setMemberToDelete(null);
  };


  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Render multiple skeletons for loading state */}
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="shadow-md overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
               <Skeleton className="h-12 w-12 rounded-full" />
               <div className="space-y-2">
                 <Skeleton className="h-4 w-[150px]" />
                 <Skeleton className="h-4 w-[100px]" />
               </div>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex gap-2"> {/* Adjusted footer for two buttons */}
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-8 w-1/2" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
       <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Members</AlertTitle>
        <AlertDescription>
            {error}
            <Button variant="link" onClick={loadMembers} className="p-0 h-auto ml-2 text-destructive-foreground underline">Try Again?</Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (members.length === 0) {
     return (
       <Alert>
        <User className="h-4 w-4" />
        <AlertTitle>No Members Found</AlertTitle>
        <AlertDescription>
            There are currently no members added to this team.
             <Button variant="link" asChild className="p-0 h-auto ml-1">
                <Link href="/add-member">Add the first member?</Link>
             </Button>
        </AlertDescription>
      </Alert>
     );
  }


  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {members.map((member) => (
        <Card key={member.id} className="shadow-md overflow-hidden flex flex-col transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4 p-4">
             <Avatar className="h-12 w-12 border">
               {/* Use member's actual imageUrl from the API */}
               {member.imageUrl ? (
                    // Using next/image requires proper configuration for external URLs if not just local paths
                    // For local '/uploads/...' paths, ensure they are served correctly.
                    <AvatarImage
                        src={member.imageUrl}
                        alt={member.name}
                        // Add error handling for images if needed
                        // onError={(e) => e.currentTarget.style.display = 'none'} // Simple hide on error
                        data-ai-hint="professional portrait"
                    />
                ) : (
                   // Fallback if no image URL
                   <AvatarFallback>
                     {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                   </AvatarFallback>
                )}
            </Avatar>
            <div className="flex-1 min-w-0">
               <CardTitle className="text-lg truncate" title={member.name}>{member.name}</CardTitle>
               <CardDescription className="truncate" title={member.role}>{member.role}</CardDescription>
             </div>
          </CardHeader>
          {/* Optional CardContent can go here */}
          <CardFooter className="p-4 pt-0 mt-auto flex gap-2"> {/* mt-auto pushes footer down, added gap */}
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/members/${member.id}`}>View</Link>
            </Button>
             <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => openDeleteConfirm(member)}
                disabled={isDeleting && memberToDelete?.id === member.id}
              >
                 {isDeleting && memberToDelete?.id === member.id ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                 ) : (
                     <Trash2 className="h-4 w-4" />
                 )}
                 <span className="ml-1">{isDeleting && memberToDelete?.id === member.id ? 'Removing...' : 'Remove'}</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>

     {/* Confirmation Dialog */}
     <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove{' '}
              <strong>{memberToDelete?.name}</strong> from the team.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className={buttonVariants({ variant: "destructive" })} // Ensure it uses destructive variant
             >
              {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isDeleting ? 'Removing...' : 'Yes, remove member'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
