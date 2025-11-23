import { useLoaderData } from "react-router";
import type { Route } from "./+types/tags.$tag";
import { getPosts } from "../data/posts.server";
import { PostList } from "../components/PostList";

export async function loader({ params }: Route.LoaderArgs) {
  const tag = decodeURIComponent(params.tag);
  const posts = await getPosts({ tag });

  return { posts, tag };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "タグが見つかりません" }];
  }

  return [
    { title: `タグ: ${data.tag} | React Router Blog` },
    { name: "description", content: `「${data.tag}」タグが付いた記事一覧` },
  ];
}

export default function TagPage() {
  const { posts, tag } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
          タグ: {tag}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {posts.length}件の記事が見つかりました
        </p>
      </header>

      <PostList posts={posts} />
    </div>
  );
}

