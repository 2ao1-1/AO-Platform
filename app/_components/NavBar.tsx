import {
  LuAmphora,
  LuBell,
  LuFlame,
  LuMessageCircleMore,
} from "react-icons/lu";
import { BarItem } from "./Item-List";

export default function NavBar() {
  return (
    <ul className="flex justify-between items-center space-x-8">
      <BarItem
        to="/"
        itemTitle="Explore"
        icon={<LuFlame className="text-xl text-main" />}
      />
      <BarItem
        to="/profile/panting"
        itemTitle="My Panting"
        icon={<LuAmphora className="text-xl text-main" />}
      />
      <BarItem
        to="/messages"
        itemTitle="Messages"
        icon={<LuMessageCircleMore className="text-xl text-main" />}
      />
      <BarItem
        to="/navigation"
        itemTitle="Navigation"
        icon={<LuBell className="text-xl text-main" />}
      />
    </ul>
  );
}
