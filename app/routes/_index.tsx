import { useLoaderData, useSearchParams } from "react-router";
import type { Route } from "./+types/_index";
import { getPosts, getAllTags } from "../data/posts.server";
import { PostList } from "../components/PostList";
import { TagPill } from "../components/TagPill";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const tag = url.searchParams.get("tag") || undefined;
  const search = url.searchParams.get("search") || undefined;

  const [posts, tags] = await Promise.all([
    getPosts({ tag, search }),
    getAllTags(),
  ]);

  return { posts, tags, currentTag: tag, currentSearch: search };
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: "ブログ | React Router Blog" },
    { name: "description", content: "React Routerを使ったモダンなブログアプリケーション" },
  ];
}

export default function Index() {
  const { posts, tags, currentTag, currentSearch } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    const newParams = new URLSearchParams(searchParams);
    if (search) {
      newParams.set("search", search);
    } else {
      newParams.delete("search");
    }
    newParams.delete("tag");
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          React Router Blog
        </h1>
        <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
          React Routerを使ったモダンなブログアプリケーション
        </p>

        {/* 検索フォーム */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              name="search"
              defaultValue={currentSearch || ""}
              placeholder="記事を検索..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              検索
            </button>
          </div>
        </form>

        {/* タグフィルタ */}
        {tags.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">タグで絞り込む</h2>
            <div className="flex flex-wrap gap-2">
              {currentTag && (
                <a
                  href="/"
                  className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  全て表示
                </a>
              )}
              {tags.map((tag: string) => (
                <TagPill key={tag} tag={tag} />
              ))}
            </div>
          </div>
        )}
      </header>

      {/* 記事一覧 */}
      <PostList posts={posts} />
    </div>
  );
}

