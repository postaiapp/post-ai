import { getInitials, getColorByInitials } from "@utils/avatar";
import Image from "next/image";

interface SimpleUserAvatarProps {
  username: string;
  image?: string | null;
}

export const SimpleUserAvatar = ({ username, image }: SimpleUserAvatarProps) => {
  const initials = getInitials(username);
  const backgroundColor = getColorByInitials(initials || '');

  return (
    <div className="flex items-center gap-3 min-w-[180px]">
      {image ? (
        <div className="w-8 h-8 relative flex-shrink-0">
          <Image
            src={image}
            alt={username}
            fill
            className="rounded-full object-cover"
          />
        </div>
      ) : (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-medium"
          style={{ backgroundColor }}
        >
          {initials}
        </div>
      )}
      <span className="text-sm truncate">{username}</span>
    </div>
  );
};