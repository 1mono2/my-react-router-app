import { useLoaderData, Link } from "react-router";
import type { Route } from "./+types/admin._index";
import { getPosts } from "../data/posts.server";
import { PostList } from "../components/PostList";
import type { Post } from "../data/posts.server";

export async function loader({ request }: Route.LoaderArgs) {
  // 簡易認証チェック（本番では適切な認証を実装）
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  // 環境変数からトークンを取得（デフォルトは開発用）
  const adminToken = process.env.ADMIN_TOKEN || "admin123";

  if (token !== adminToken) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const posts = await getPosts({ status: undefined }); // 全ての記事を取得

  return { posts };
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: "管理画面 | React Router Blog" },
    { name: "robots", content: "noindex" },
  ];
}

export default function AdminIndex() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">管理画面</h1>
        <Link
          to="/admin/posts/new?token=admin123"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          新規記事を作成
        </Link>
      </header>

      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        全{posts.length}件の記事
      </div>

      <div className="space-y-4">
        {posts.map((post: Post) => (
          <div
            key={post.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{post.title}</h2>
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>ステータス: {post.status === "published" ? "公開" : "下書き"}</span>
                <span>
                  公開日: {new Date(post.publishedAt).toLocaleDateString("ja-JP")}
                </span>
              </div>
            </div>
            <Link
              to={`/admin/posts/${post.slug}/edit?token=admin123`}
              className="ml-4 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              編集
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

