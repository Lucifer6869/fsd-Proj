import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Rocket } from 'lucide-react'; // Removed Target, Group

// Define Team Name (can be fetched or configured elsewhere later)
const TEAM_NAME = "The Innovators";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh_-_theme(spacing.32))]"> {/* Adjust height calculation if layout changes */}

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

      {/* Footer Section (Simple Example) */}
      <footer className="py-6 bg-muted text-muted-foreground text-center text-sm mt-auto"> {/* Added mt-auto */}
           <p>&copy; {new Date().getFullYear()} {TEAM_NAME}. Built with TeamUp.</p>
      </footer>
    </div>
  );
}
