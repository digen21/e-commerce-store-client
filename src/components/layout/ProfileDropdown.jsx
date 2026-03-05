import { User, Settings, LogOut, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * User Profile Dropdown Component
 * 
 * A glassmorphism-styled profile card with dropdown menu.
 * Features circular avatar, user name, role, and menu items.
 * 
 * @param {Object} props
 * @param {string} props.name - User's display name
 * @param {string} props.role - User's role (e.g., "Admin", "User")
 * @param {string} props.avatarUrl - URL to user's avatar image
 * @param {Function} props.onProfile - Callback when Profile is clicked
 * @param {Function} props.onSettings - Callback when Settings is clicked
 * @param {Function} props.onLogout - Callback when Logout is clicked
 */
export function ProfileDropdown({
  name,
  role,
  avatarUrl,
  onProfile,
  onSettings,
  onLogout,
}) {
  const initials = name
    ? name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-3 rounded-lg border bg-background/60 px-3 py-2",
            "backdrop-blur-sm shadow-sm",
            "transition-all duration-200",
            "hover:bg-background/80 hover:shadow-md",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
          aria-label={`User menu for ${name}`}
        >
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-foreground">{name}</span>
            <span className="text-xs text-muted-foreground">{role}</span>
          </div>
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <ChevronDown
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-popover/95 backdrop-blur-sm"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">{role}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onProfile}
          className="cursor-pointer transition-colors"
        >
          <User className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onSettings}
          className="cursor-pointer transition-colors"
        >
          <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer text-destructive focus:text-destructive transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown
