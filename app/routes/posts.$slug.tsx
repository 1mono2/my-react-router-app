import { useLoaderData, Link } from "react-router";
import type { Route } from "./+types/posts.$slug";
import { getPostBySlug, getPosts } from "../data/posts.server";
import { TagPill } from "../components/TagPill";

export async function loader({ params }: Route.LoaderArgs) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  // 関連記事を取得（同じタグを持つ記事、最大3件）
  const relatedPosts = (await getPosts({ tag: post.tags[0] }))
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return { post, relatedPosts };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "記事が見つかりません" }];
  }

  return [
    { title: `${data.post.title} | React Router Blog` },
    { name: "description", content: data.post.summary },
    { property: "og:title", content: data.post.title },
    { property: "og:description", content: data.post.summary },
    { property: "og:type", content: "article" },
  ];
}

export default function PostDetail() {
  const { post, relatedPosts } = useLoaderData<typeof loader>();

  return (
    <article className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="mb-6 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        ← 一覧に戻る
      </Link>

      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          {post.title}
        </h1>
        <p className="mb-4 text-xl text-gray-600 dark:text-gray-300">{post.summary}</p>
        
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>

        <time className="text-sm text-gray-500 dark:text-gray-400">
          公開日: {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>

      <div
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {relatedPosts.length > 0 && (
        <aside className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">関連記事</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedPosts.map((relatedPost: { id: string; slug: string; title: string; summary: string }) => (
              <Link
                key={relatedPost.id}
                to={`/posts/${relatedPost.slug}`}
                className="block rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                  {relatedPost.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{relatedPost.summary}</p>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}

