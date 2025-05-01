import AddMemberForm from './_components/add-member-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AddMemberPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6"> {/* Added padding */}
       <Button variant="outline" size="sm" asChild className="mb-4">
         <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Add New Team Member</CardTitle>
          <CardDescription>Fill in the details below to add a new member to the team.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddMemberForm />
        </CardContent>
      </Card>
    </div>
  );
}
