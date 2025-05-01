import MemberList from './_components/member-list';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';

export default function ViewMembersPage() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
         <Button size="sm" asChild>
              <Link href="/add-member">
                <UserPlus className="mr-2 h-4 w-4" /> Add New Member
              </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Here is a list of all members in the team.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* MemberList will handle fetching and displaying */}
          <MemberList />
        </CardContent>
      </Card>
    </div>
  );
}
