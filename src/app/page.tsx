import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, UserPlus } from 'lucide-react';

// Define Team Name (can be fetched or configured elsewhere later)
const TEAM_NAME = "The Innovators";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary mb-2">
            Welcome to TeamUp!
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground mb-4">
            Managing Team: <span className="font-semibold text-foreground">{TEAM_NAME}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
           <p className="text-muted-foreground mb-6">
            Efficiently manage your student team members. Add new members, view the roster, and keep track of everyone's details.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/add-member">
                <UserPlus className="mr-2 h-4 w-4" /> Add Member
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/members">
                <Users className="mr-2 h-4 w-4" /> View Members
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
