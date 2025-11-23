import { redirect, useLoaderData, useActionData, useNavigation, Form, Link } from "react-router";
import type { Route } from "./+types/admin.posts.$slug.edit";
import { getPostBySlug, updatePost } from "../data/posts.server";

type ActionData = {
  errors?: {
    title?: string;
    slug?: string;
    summary?: string;
    content?: string;
    general?: string;
  };
  values?: {
    title?: string;
    slug?: string;
    summary?: string;
    content?: string;
    tags?: string;
    status?: string;
  };
};

export async function loader({ request, params }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const adminToken = process.env.ADMIN_TOKEN || "admin123";
  
  if (token !== adminToken) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const post = await getPostBySlug(params.slug);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  return { post };
}

export async function action({ request, params }: Route.ActionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const adminToken = process.env.ADMIN_TOKEN || "admin123";
  
  if (token !== adminToken) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const post = await getPostBySlug(params.slug);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const summary = formData.get("summary") as string;
  const content = formData.get("content") as string;
  const tags = (formData.get("tags") as string)?.split(",").map((t) => t.trim()).filter(Boolean) || [];
  const status = (formData.get("status") as string) || "draft";

  // バリデーション
  const errors: Record<string, string> = {};
  if (!title) errors.title = "タイトルは必須です";
  if (!slug) errors.slug = "スラッグは必須です";
  if (!summary) errors.summary = "概要は必須です";
  if (!content) errors.content = "本文は必須です";

  if (Object.keys(errors).length > 0) {
    return { errors, values: { title, slug, summary, content, tags: tags.join(", "), status } } as ActionData;
  }

  try {
    const updatedPost = await updatePost(post.id, {
      slug,
      title,
      summary,
      content,
      tags,
      status: status as "published" | "draft",
    });

    if (!updatedPost) {
      return { errors: { general: "記事の更新に失敗しました" } } as ActionData;
    }

    return redirect(`/posts/${updatedPost.slug}`);
  } catch (error) {
    return { errors: { general: "記事の更新に失敗しました" } } as ActionData;
  }
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: "記事編集 | 管理画面" },
    { name: "robots", content: "noindex" },
  ];
}

export default function AdminEditPost() {
  const { post } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const values = actionData?.values || {
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    content: post.content,
    tags: post.tags.join(", "),
    status: post.status,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <Link
          to="/admin?token=admin123"
          className="mb-4 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          ← 管理画面に戻る
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">記事を編集</h1>
      </header>

      <Form method="post" className="space-y-6">
        {actionData?.errors?.general && (
          <div className="rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-300">
            {actionData.errors.general}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            タイトル *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={values.title}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          {actionData?.errors?.title && (
            <p className="mt-1 text-sm text-red-600">{actionData.errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            スラッグ（URL） *
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            defaultValue={values.slug}
            required
            pattern="[a-z0-9-]+"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <p className="mt-1 text-sm text-gray-500">英数字とハイフンのみ使用可能</p>
          {actionData?.errors?.slug && (
            <p className="mt-1 text-sm text-red-600">{actionData.errors.slug}</p>
          )}
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            概要 *
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={3}
            defaultValue={values.summary}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          {actionData?.errors?.summary && (
            <p className="mt-1 text-sm text-red-600">{actionData.errors.summary}</p>
          )}
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            タグ（カンマ区切り）
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            defaultValue={values.tags}
            placeholder="React, TypeScript, Web開発"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ステータス
          </label>
          <select
            id="status"
            name="status"
            defaultValue={values.status}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="draft">下書き</option>
            <option value="published">公開</option>
          </select>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            本文（HTML） *
          </label>
          <textarea
            id="content"
            name="content"
            rows={15}
            defaultValue={values.content}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          {actionData?.errors?.content && (
            <p className="mt-1 text-sm text-red-600">{actionData.errors.content}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "更新中..." : "記事を更新"}
          </button>
          <Link
            to="/admin?token=admin123"
            className="rounded-lg bg-gray-200 px-6 py-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
          >
            キャンセル
          </Link>
        </div>
      </Form>
    </div>
  );
}

