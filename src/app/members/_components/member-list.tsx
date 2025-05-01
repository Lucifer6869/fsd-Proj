"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, AlertTriangle } from "lucide-react";

// Define the structure of a team member
interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl?: string; // Optional image URL (path from backend)
  // Add other fields if needed
}

// Mock data for demonstration (replace with actual API fetch)
const MOCK_MEMBERS: TeamMember[] = [
  { id: "1", name: "Alice Wonderland", role: "Project Manager", imageUrl: "https://picsum.photos/seed/alice/100/100" },
  { id: "2", name: "Bob The Builder", role: "Lead Developer" , imageUrl: "https://picsum.photos/seed/bob/100/100" },
  { id: "3", name: "Charlie Chaplin", role: "UI/UX Designer" }, // Member without image
  { id: "4", name: "Diana Prince", role: "Backend Developer", imageUrl: "https://picsum.photos/seed/diana/100/100" },
  { id: "5", name: "Ethan Hunt", role: "QA Tester", imageUrl: "https://picsum.photos/seed/ethan/100/100" },
];

// Mock fetch function (replace with actual API call using fetch or axios)
async function fetchMembers(): Promise<{ success: boolean; data?: TeamMember[]; error?: string }> {
  console.log("Fetching members...");
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success/failure
  const shouldSucceed = Math.random() > 0.1; // 90% success rate

   // In a real app, this would be:
  // try {
  //   const response = await fetch('/api/members'); // Your backend endpoint
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }
  //   const data = await response.json();
  //   return { success: true, data: data }; // Assuming backend returns { data: TeamMember[] }
  // } catch (error) {
  //   console.error("Failed to fetch members:", error);
  //   return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  // }

  if (shouldSucceed) {
    return { success: true, data: MOCK_MEMBERS };
  } else {
    return { success: false, error: "Failed to load members from the server." };
  }
}


export default function MemberList() {
  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadMembers() {
      setIsLoading(true);
      setError(null);
      const result = await fetchMembers();
      if (result.success && result.data) {
        setMembers(result.data);
      } else {
        setError(result.error || "An unknown error occurred.");
      }
      setIsLoading(false);
    }
    loadMembers();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
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
        <AlertDescription>{error}</AlertDescription>
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
        <Card key={member.id} className="shadow-md overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center gap-4 p-4">
             <Avatar className="h-12 w-12 border">
              {/* Use next/image if imageUrl exists, otherwise fallback */}
               {member.imageUrl ? (
                    <AvatarImage src={member.imageUrl} alt={member.name} data-ai-hint="professional portrait" />
                ) : (
                   // Placeholder Icon or Initials
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
          {/* Add more content if needed */}
          {/* <CardContent className="p-4 pt-0"> */}
             {/* Optional: Add more details here if desired in the list view */}
          {/* </CardContent> */}
          <CardFooter className="p-4 pt-0 mt-auto">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/members/${member.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
