import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, UserPlus, Rocket } from 'lucide-react'; // Added Target, Group

// Define Team Name (can be fetched or configured elsewhere later)
const TEAM_NAME = "The Innovators";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh_-_theme(spacing.16))]"> {/* Reduced bottom padding */}

      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center text-center px-4 py-16 bg-gradient-to-b from-background to-secondary/10"> {/* Adjusted gradient */}
        <Rocket className="h-16 w-16 text-primary mb-6 animate-bounce" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Welcome to TeamUp!
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl"> {/* Adjusted text size */}
          Efficiently manage your student team: <span className="font-semibold text-foreground">{TEAM_NAME}</span>. Add members, view the roster, and keep track of everyone's details seamlessly.
        </p>
         {/* Removed direct buttons from Hero - they are now in tiles */}
      </section>

       {/* Navigation Tiles Section */}
       <section className="w-full max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Member Tile */}
          <Link href="/add-member" passHref>
            <Card className="h-full flex flex-col items-center justify-center text-center p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary cursor-pointer bg-card hover:bg-secondary/20">
              <CardHeader>
                 <UserPlus className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle className="text-2xl font-semibold">Add New Member</CardTitle>
                <CardDescription>Expand your team by adding a new member profile.</CardDescription>
              </CardHeader>
              {/* <CardContent> */}
                {/* Optional content if needed */}
              {/* </CardContent> */}
            </Card>
          </Link>

          {/* View Members Tile */}
          <Link href="/members" passHref>
             <Card className="h-full flex flex-col items-center justify-center text-center p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary cursor-pointer bg-card hover:bg-secondary/20">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle className="text-2xl font-semibold">View Team Roster</CardTitle>
                <CardDescription>See the full list of current team members and their details.</CardDescription>
              </CardHeader>
              {/* <CardContent> */}
                {/* Optional content if needed */}
              {/* </CardContent> */}
            </Card>
          </Link>
        </div>
      </section>


      {/* Footer Section */}
      <footer className="py-6 bg-muted text-muted-foreground text-center text-sm mt-auto">
           <p>&copy; {new Date().getFullYear()} {TEAM_NAME}. Built with TeamUp.</p>
      </footer>
    </div>
  );
}
