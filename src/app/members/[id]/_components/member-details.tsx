
"use client"; // This component fetches data client-side based on ID

import * as React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, AlertTriangle, Mail, Phone, Info, Calendar } from "lucide-react"; // Added more icons
import type { TeamMember, FetchMemberResponse } from '@/lib/types'; // Import shared types
// Optional: import { format } from 'date-fns'; // If you add date fields


// Function to fetch a single member from the API
async function fetchMemberById(id: string): Promise<FetchMemberResponse> {
  console.log(`Fetching member with ID: ${id} from API...`);
  try {
    const response = await fetch(`/api/members/${id}`, {
        cache: 'no-store', // Fetch fresh data for details view
    });

    const result: FetchMemberResponse = await response.json(); // Parse the JSON response

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404 Not Found, 500 Server Error)
      console.error(`API Error fetching member ${id}: ${response.status}`, result);
       // Use message from response if available, otherwise generate one
       const errorMessage = result.message || `Request failed with status ${response.status}`;
      return { success: false, error: errorMessage };
    }

    // Check API's internal success flag if it exists (optional but good practice)
    if (!result.success) {
       console.error(`API reported failure fetching member ${id}:`, result.error);
       return { success: false, error: result.message || "API indicated failure." };
    }

     console.log(`Fetched member ${id} successfully.`);
     return result; // { success: true, data: TeamMember }

  } catch (error) {
    console.error(`Network or fetch error fetching member ${id}:`, error);
    return { success: false, error: error instanceof Error ? error.message : "An unknown network error occurred" };
  }
}


interface MemberDetailsProps {
  memberId: string;
}

export default function MemberDetails({ memberId }: MemberDetailsProps) {
  const [member, setMember] = React.useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

   // Function to load member data, separated for potential refresh
   const loadMember = async () => {
      setIsLoading(true);
      setError(null);
      const result = await fetchMemberById(memberId);
      if (result.success && result.data) {
        setMember(result.data);
      } else {
        setError(result.error || "Failed to load member details.");
      }
      setIsLoading(false);
   };


  React.useEffect(() => {
    if (memberId) { // Only fetch if memberId is available
      loadMember();
    } else {
        setError("Invalid Member ID provided.");
        setIsLoading(false);
    }
  }, [memberId]); // Re-fetch if memberId changes


  // Loading State Skeleton
  if (isLoading) {
     return (
       <Card className="shadow-lg overflow-hidden">
         <CardHeader className="bg-secondary/30 p-6">
            <div className="flex flex-col items-center text-center">
                 <Skeleton className="h-24 w-24 rounded-full mb-4" />
                 <Skeleton className="h-7 w-3/4 mb-2" />
                 <Skeleton className="h-5 w-1/2" />
            </div>
         </CardHeader>
         <CardContent className="p-6 space-y-6">
             <div className="flex items-start space-x-3">
                 <Skeleton className="h-5 w-5 mt-1 rounded" />
                 <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-3/4" />
                 </div>
             </div>
              <div className="flex items-start space-x-3">
                 <Skeleton className="h-5 w-5 mt-1 rounded" />
                 <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                 </div>
             </div>
         </CardContent>
       </Card>
    );
  }

  // Error State Alert
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Member</AlertTitle>
        <AlertDescription>
            {error}
            {/* Optional: Add a retry button */}
             <Button variant="link" onClick={loadMember} className="p-0 h-auto ml-2 text-destructive-foreground underline">Try Again?</Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Member Not Found or Null State (Should be caught by error state from 404)
  if (!member) {
     // This might indicate an issue if error is null but member is also null
     return (
       <Alert>
        <User className="h-4 w-4" />
        <AlertTitle>Member Data Unavailable</AlertTitle>
        <AlertDescription>The member data could not be displayed.</AlertDescription>
      </Alert>
     );
  }


  // Success State: Display Member Details
  return (
    <Card className="shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
      <CardHeader className="bg-secondary/30 p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg mb-4">
             {/* Use actual imageUrl from fetched member data */}
             {member.imageUrl ? (
                <AvatarImage
                    src={member.imageUrl}
                    alt={member.name}
                    data-ai-hint="professional portrait large"
                    // onError fallback can be added here if needed
                />
             ) : (
               <AvatarFallback className="text-3xl">
                 {/* Generate initials */}
                 {member.name?.split(' ').map(n => n[0]).join('').toUpperCase() || <User />}
               </AvatarFallback>
             )}
           </Avatar>
           <CardTitle className="text-2xl font-semibold">{member.name}</CardTitle>
           <CardDescription className="text-lg text-primary">{member.role}</CardDescription>
         </div>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
         {/* Email */}
         <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" aria-hidden="true" />
            <div>
                <p className="text-sm font-medium text-muted-foreground" id="email-label">Email</p>
                <a href={`mailto:${member.email}`} className="text-base text-foreground hover:text-primary break-all" aria-labelledby="email-label">{member.email}</a>
            </div>
         </div>

         {/* Contact Info */}
         {member.contactInfo && (
             <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" aria-hidden="true"/>
                <div>
                    <p className="text-sm font-medium text-muted-foreground" id="contact-label">Contact Info</p>
                    {/* Use whitespace-pre-wrap to respect potential newlines */}
                    <p className="text-base text-foreground whitespace-pre-wrap" aria-labelledby="contact-label">{member.contactInfo}</p>
                </div>
             </div>
         )}

          {/* Placeholder for future fields */}
         {/* Example: Join Date (if added to TeamMember type and API)
         {member.joinDate && (
             <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" aria-hidden="true"/>
                <div>
                    <p className="text-sm font-medium text-muted-foreground" id="join-date-label">Join Date</p>
                    <p className="text-base text-foreground" aria-labelledby="join-date-label">
                        {format(new Date(member.joinDate), 'PPP')}
                    </p>
                </div>
             </div>
         )}
         */}

      </CardContent>
       {/* Optional Footer can go here if needed */}
       {/* <CardFooter className="p-6 border-t">
            <Button variant="outline">Edit Member</Button> // Example action
       </CardFooter> */}
    </Card>
  );
}
