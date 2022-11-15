import { useTheme } from "next-themes";
import { IoMoon, IoSunny } from "react-icons/io5";

export const ToggleTheme = ({ mounted }: { mounted: boolean }) => {
  const { theme, setTheme } = useTheme();
  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="w-8 h-8 p-0 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:ring-2 ring-gray-300 transition-all"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {mounted && (theme === "dark" ? <IoSunny /> : <IoMoon />)}
    </button>
  );
};
