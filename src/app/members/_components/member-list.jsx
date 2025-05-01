
"use client";

import * as React from "react";
import Link from "next/link";
// import Image from "next/image"; // Keep if using next/image later
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, AlertTriangle } from "lucide-react";

// Function to fetch members from the API endpoint
async function fetchMembers() {
  console.log("Fetching members from API...");
  try {
    const response = await fetch('/api/members', {
        cache: 'no-store', // Prevent caching to get the latest list
    });

    // Check if the response status indicates failure
    if (!response.ok) {
        let errorData = {};
        try {
            errorData = await response.json(); // Try to parse error body
        } catch (parseError) {
            console.error("Could not parse error response:", parseError);
        }
        console.error(`API Error: ${response.status}`, errorData);
         throw new Error(errorData.message || `Failed to fetch members. Status: ${response.status}`);
    }

    const result = await response.json(); // Parse the JSON response

    // Additional check if the API returns a specific success flag
    if (!result.success) {
        console.error("API reported failure:", result.error);
        throw new Error(result.message || "Failed to fetch members.");
    }

     console.log("Fetched members successfully:", result.data?.length);
     return result; // Return the successful response { success: true, data: TeamMember[] }

  } catch (error) {
    console.error("Error fetching members:", error);
     // Ensure the returned object matches expected structure on error
     return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred fetching members." };
  }
}


export default function MemberList() {
  const [members, setMembers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Function to load members, separated for potential refresh logic
  const loadMembers = async () => {
      setIsLoading(true);
      setError(null);
      const result = await fetchMembers();
      if (result.success && Array.isArray(result.data)) { // Ensure data is an array
        setMembers(result.data);
      } else {
        setError(result.error || "An unknown error occurred while loading members.");
        setMembers([]); // Clear members on error
      }
      setIsLoading(false);
  };

  React.useEffect(() => {
    loadMembers(); // Load members on initial component mount
  }, []); // Empty dependency array ensures this runs once on mount


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
            <CardFooter className="p-4 pt-0">
                <Skeleton className="h-8 w-full" />
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
            {/* Added retry button styling */}
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
                     {member.name?.split(' ').map(n => n[0]).join('').toUpperCase() || <User />}
                   </AvatarFallback>
                )}
            </Avatar>
            <div className="flex-1 min-w-0">
               <CardTitle className="text-lg truncate" title={member.name}>{member.name}</CardTitle>
               <CardDescription className="truncate" title={member.role}>{member.role}</CardDescription>
             </div>
          </CardHeader>
          {/* Optional CardContent can go here */}
          <CardFooter className="p-4 pt-0 mt-auto"> {/* mt-auto pushes footer down */}
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/members/${member.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
