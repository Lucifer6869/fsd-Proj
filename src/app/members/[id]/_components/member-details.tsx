"use client"; // This component fetches data client-side based on ID

import * as React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, AlertTriangle, Mail, Phone, Info } from "lucide-react"; // Added more icons


// Define the structure of a team member (ensure consistency)
interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  contactInfo?: string;
  imageUrl?: string;
  // Add more detailed fields if needed (e.g., bio, join date)
}

// Mock data - normally fetched from API
const MOCK_MEMBERS_DETAILS: Record<string, TeamMember> = {
  "1": { id: "1", name: "Alice Wonderland", role: "Project Manager", email: "alice.wonder@example.com", contactInfo: "LinkedIn: /in/alicew", imageUrl: "https://picsum.photos/seed/alice/200/200" },
  "2": { id: "2", name: "Bob The Builder", role: "Lead Developer", email: "bob.builder@example.com", contactInfo: "555-1234", imageUrl: "https://picsum.photos/seed/bob/200/200" },
  "3": { id: "3", name: "Charlie Chaplin", role: "UI/UX Designer", email: "charlie.c@example.com", contactInfo: "Portfolio: charliedesigns.com" },
  "4": { id: "4", name: "Diana Prince", role: "Backend Developer", email: "diana.prince@example.com", imageUrl: "https://picsum.photos/seed/diana/200/200" },
   "5": { id: "5", name: "Ethan Hunt", role: "QA Tester", email: "ethan.hunt@example.com", contactInfo: "Available on Slack", imageUrl: "https://picsum.photos/seed/ethan/200/200" },
};

// Mock fetch function for a single member (replace with actual API call)
async function fetchMemberById(id: string): Promise<{ success: boolean; data?: TeamMember; error?: string }> {
  console.log(`Fetching member with ID: ${id}...`);
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

   // In a real app:
   // try {
   //   const response = await fetch(`/api/members/${id}`); // Your backend endpoint
   //   if (!response.ok) {
   //       if(response.status === 404) return { success: false, error: "Member not found." };
   //       throw new Error(`HTTP error! status: ${response.status}`);
   //   }
   //   const data = await response.json();
   //   return { success: true, data: data }; // Assuming backend returns TeamMember object
   // } catch (error) {
   //   console.error(`Failed to fetch member ${id}:`, error);
   //   return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
   // }


  const member = MOCK_MEMBERS_DETAILS[id];
  if (member) {
    return { success: true, data: member };
  } else {
    return { success: false, error: "Member not found." };
  }
}


interface MemberDetailsProps {
  memberId: string;
}

export default function MemberDetails({ memberId }: MemberDetailsProps) {
  const [member, setMember] = React.useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadMember() {
      setIsLoading(true);
      setError(null);
      const result = await fetchMemberById(memberId);
      if (result.success && result.data) {
        setMember(result.data);
      } else {
        setError(result.error || "Failed to load member details.");
      }
      setIsLoading(false);
    }
    loadMember();
  }, [memberId]); // Re-fetch if memberId changes


  // Use the same LoadingDetails component structure if needed
  if (isLoading) {
     return (
       <Card className="shadow-lg">
         <CardHeader>
           <Skeleton className="h-8 w-3/4 mb-2" />
           <Skeleton className="h-4 w-1/2" />
         </CardHeader>
         <CardContent className="space-y-4">
             <div className="flex justify-center mb-6">
                <Skeleton className="h-32 w-32 rounded-full" />
             </div>
             <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
             </div>
             <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-1/2" />
             </div>
             <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
             </div>
         </CardContent>
       </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Member</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!member) {
     // This case should ideally be handled by the error state if API returns 404
     return (
       <Alert>
        <User className="h-4 w-4" />
        <AlertTitle>Member Not Found</AlertTitle>
        <AlertDescription>The requested member could not be found.</AlertDescription>
      </Alert>
     );
  }


  return (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader className="bg-secondary/50 p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg mb-4">
             {member.imageUrl ? (
                <AvatarImage src={member.imageUrl} alt={member.name} data-ai-hint="professional portrait large" />
             ) : (
               <AvatarFallback className="text-3xl">
                 {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
               </AvatarFallback>
             )}
           </Avatar>
           <CardTitle className="text-2xl">{member.name}</CardTitle>
           <CardDescription className="text-lg text-primary">{member.role}</CardDescription>
         </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
         <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
            <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <a href={`mailto:${member.email}`} className="text-base text-foreground hover:text-primary break-all">{member.email}</a>
            </div>
         </div>

         {member.contactInfo && (
             <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Info</p>
                    <p className="text-base text-foreground whitespace-pre-wrap">{member.contactInfo}</p>
                </div>
             </div>
         )}

         {/* Add more fields here as needed */}
         {/* Example:
         <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
            <div>
                <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                <p className="text-base text-foreground">{format(new Date(member.joinDate), 'PPP')}</p> // Assuming joinDate exists
            </div>
         </div>
         */}

      </CardContent>
    </Card>
  );
}

// Helper function if you add date fields (requires date-fns)
// import { format } from 'date-fns';
