import { Link } from "react-router";
import type { Post } from "../data/posts.server";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <Link to={`/posts/${post.slug}`} className="block">
        <h2 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
          {post.title}
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">{post.summary}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/tags/${encodeURIComponent(tag)}`}
              className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
              onClick={(e) => e.stopPropagation()}
            >
              {tag}
            </Link>
          ))}
        </div>
        <time className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </Link>
    </article>
  );
}

