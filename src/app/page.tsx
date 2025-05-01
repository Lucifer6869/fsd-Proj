import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Rocket, Target, Group } from 'lucide-react';

// Define Team Name (can be fetched or configured elsewhere later)
const TEAM_NAME = "The Innovators";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]"> {/* Adjust height calculation if layout changes */}

      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center text-center px-4 py-16 bg-gradient-to-b from-background to-secondary/30">
        <Rocket className="h-16 w-16 text-primary mb-6 animate-bounce" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Welcome to TeamUp!
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Efficiently manage your student team: <span className="font-semibold text-foreground">{TEAM_NAME}</span>. Add members, view the roster, and keep track of everyone's details seamlessly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/add-member">
              <UserPlus className="mr-2 h-5 w-5" /> Add New Member
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/members">
              <Users className="mr-2 h-5 w-5" /> View Team Roster
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section (Optional Example) */}
      <section className="bg-background py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-foreground">Why TeamUp?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 border rounded-lg shadow-sm bg-card">
              <UserPlus className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Easy Member Addition</h3>
              <p className="text-muted-foreground">Quickly add new members with essential details and profile pictures.</p>
            </div>
            <div className="flex flex-col items-center p-6 border rounded-lg shadow-sm bg-card">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Centralized Roster</h3>
              <p className="text-muted-foreground">View all team members in one place with clear roles and contact information.</p>
            </div>
            <div className="flex flex-col items-center p-6 border rounded-lg shadow-sm bg-card">
              <Target className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Streamlined Management</h3>
              <p className="text-muted-foreground">Keep your team organized and focused, improving collaboration.</p>
            </div>
          </div>
        </div>
      </section>

       {/* Footer Section (Simple Example) */}
       <footer className="py-6 bg-muted text-muted-foreground text-center text-sm">
           <p>&copy; {new Date().getFullYear()} {TEAM_NAME}. Built with TeamUp.</p>
       </footer>
    </div>
  );
}
