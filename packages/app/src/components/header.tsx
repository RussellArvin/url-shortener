import { Link2 } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  email: string;
  onSignOut: () => void;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "text-sm transition-colors",
    isActive
      ? "text-foreground font-medium"
      : "text-muted-foreground hover:text-foreground",
  );

export function Header({ email, onSignOut }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Link2 className="h-5 w-5" />
            <span>URL Shortener</span>
          </Link>
          <nav className="flex items-center gap-4">
            <NavLink to="/" end className={navLinkClass}>
              Shorten
            </NavLink>
            <NavLink to="/links" className={navLinkClass}>
              My links
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {email}
          </span>
          <Button variant="outline" size="sm" onClick={onSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
