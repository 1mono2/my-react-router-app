import { Link } from "react-router";

type TagPillProps = {
  tag: string;
  size?: "sm" | "md" | "lg";
};

export function TagPill({ tag, size = "md" }: TagPillProps) {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <Link
      to={`/tags/${encodeURIComponent(tag)}`}
      className={`inline-block rounded-full bg-blue-100 ${sizeClasses[size]} font-medium text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800`}
    >
      {tag}
    </Link>
  );
}

