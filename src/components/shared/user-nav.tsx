import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { removeAllTokens } from '@/lib/axios';
import { usePersistStore } from '@/store/persist';

export default function UserNav(user) {
  const userData = usePersistStore((store) => store.app.userData)
  const initUserData = usePersistStore((store) => store.actions.init)

  const handleLogout = async () => {
    await initUserData()
    removeAllTokens()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-2 p-2 bg-transparent hover:bg-transparent !outline-none !ring-0 !ring-offset-0 border-2 border-[#4a278da1]"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={"/assets/icons/gold-avatar.png"} alt={''} />
          </Avatar>
          <p className='text-white'>
            {userData.username}
          </p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 border-none bg-dark bg-opacity-90 text-gray50"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-lg leading-none text-white">
              {userData.username}
            </p>
            <p className="text-xs leading-none text-white">
              {userData.userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
