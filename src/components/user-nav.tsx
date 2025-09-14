
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";

type UserNavProps = {
  userRole: 'ngo' | 'buyer';
}

export function UserNav({ userRole }: UserNavProps) {
  const { user, signOut } = useAuth();

  const isNgo = userRole === 'ngo';
  const dashboardLink = isNgo ? "/ngo-dashboard" : "/buyer-dashboard";
  const userName = isNgo ? 'NGO Admin' : 'Sustainability Lead';
  const userEmail = user?.email || (isNgo ? 'admin@conservation.org' : 'lead@globaltech.com');
  const userInitials = isNgo ? 'NA' : 'SL';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://picsum.photos/seed/${isNgo ? 'ngo_logo' : 'avatar'}/32/32`} alt="User avatar" data-ai-hint="avatar" />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={dashboardLink}><LayoutDashboard className="mr-2" />Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile"><UserIcon className="mr-2" />Profile</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
