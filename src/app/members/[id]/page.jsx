import MemberDetails from './_components/member-details';
import { Card, CardHeader, CardContent } from '@/components/ui/card'; // Removed unused imports
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


// Loading component for Suspense boundary
function LoadingDetails() {
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


export default function MemberDetailPage({ params }) {
  const memberId = params.id;

  return (
    <div className="max-w-2xl mx-auto">
        <Button variant="outline" size="sm" asChild className="mb-4">
         <Link href="/members">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Member List
          </Link>
        </Button>

      {/* Use Suspense to handle loading state */}
      <Suspense fallback={<LoadingDetails />}>
         {/* MemberDetails component will fetch and display data */}
         <MemberDetails memberId={memberId} />
      </Suspense>

    </div>
  );
}
