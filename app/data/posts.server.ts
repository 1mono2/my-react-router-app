export type Post = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  heroImage?: string;
  publishedAt: string;
  updatedAt: string;
  status: "published" | "draft";
};

// 簡易的なインメモリデータストア（本番ではデータベースを使用）
let posts: Post[] = [
  {
    id: "1",
    slug: "getting-started-with-react-router",
    title: "React Router入門：モダンなWebアプリケーションの構築",
    summary: "React Router v7を使ったモダンなWebアプリケーションの構築方法を学びます。SSR、データローディング、ルーティングの基本を解説します。",
    content: `<h2>React Routerとは</h2>
<p>React Routerは、Reactアプリケーションのための強力なルーティングライブラリです。最新のv7では、サーバーサイドレンダリング（SSR）とクライアントサイドルーティングをシームレスに統合しています。</p>

<h2>主な機能</h2>
<ul>
  <li><strong>サーバーサイドレンダリング</strong>: SEOに最適化された初期レンダリング</li>
  <li><strong>データローディング</strong>: ルートベースのデータフェッチング</li>
  <li><strong>型安全性</strong>: TypeScriptの完全サポート</li>
  <li><strong>パフォーマンス</strong>: 自動的なコード分割と最適化</li>
</ul>

<h2>基本的な使い方</h2>
<p>React Routerを使い始めるには、まずルートを定義します。各ルートは独立したファイルとして管理でき、loader関数でデータを取得できます。</p>

<pre><code>export async function loader({ request }: Route.LoaderArgs) {
  const data = await fetchData();
  return json({ data });
}</code></pre>

<h2>まとめ</h2>
<p>React Routerを使うことで、モダンでパフォーマンスの高いWebアプリケーションを構築できます。次の記事では、より高度な機能について解説します。</p>`,
    tags: ["React", "React Router", "Web開発"],
    publishedAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    status: "published",
  },
  {
    id: "2",
    slug: "ssr-and-data-loading",
    title: "SSRとデータローディングのベストプラクティス",
    summary: "React Routerを使ったサーバーサイドレンダリングと効率的なデータローディングの方法を解説します。",
    content: `<h2>サーバーサイドレンダリングの利点</h2>
<p>サーバーサイドレンダリング（SSR）により、以下のような利点が得られます：</p>

<ul>
  <li>SEOの向上：検索エンジンがコンテンツを正しくインデックスできる</li>
  <li>初期表示速度の向上：HTMLがサーバーから送信されるため、最初の描画が速い</li>
  <li>メタタグの制御：各ページで適切なOGPタグを設定できる</li>
</ul>

<h2>Loader関数の活用</h2>
<p>React Routerのloader関数を使うことで、ルートごとにデータを取得できます。これにより、データフェッチングのロジックをルートに集約できます。</p>

<h2>エラーハンドリング</h2>
<p>ErrorBoundaryコンポーネントを使うことで、エラーが発生した際の適切な処理が可能です。</p>`,
    tags: ["React Router", "SSR", "パフォーマンス"],
    publishedAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
    status: "published",
  },
  {
    id: "3",
    slug: "typescript-with-react-router",
    title: "TypeScriptでReact Routerを使う",
    summary: "React RouterとTypeScriptを組み合わせて、型安全なアプリケーションを構築する方法を学びます。",
    content: `<h2>型安全性の重要性</h2>
<p>TypeScriptを使うことで、コンパイル時にエラーを検出でき、開発効率が大幅に向上します。</p>

<h2>React Routerの型定義</h2>
<p>React Router v7では、ルートごとに自動的に型が生成されます。これにより、loaderやactionの引数や戻り値が型安全になります。</p>

<h2>実践例</h2>
<p>型定義を活用することで、IDEの補完機能が強化され、バグの発生を防げます。</p>`,
    tags: ["TypeScript", "React Router"],
    publishedAt: "2024-01-25T10:00:00Z",
    updatedAt: "2024-01-25T10:00:00Z",
    status: "published",
  },
];

// 全ての公開済み記事を取得
export async function getPosts(options?: {
  tag?: string;
  search?: string;
  status?: Post["status"];
}): Promise<Post[]> {
  let filteredPosts = posts;

  // ステータスでフィルタ
  if (options?.status) {
    filteredPosts = filteredPosts.filter((post) => post.status === options.status);
  } else {
    // デフォルトは公開済みのみ
    filteredPosts = filteredPosts.filter((post) => post.status === "published");
  }

  // タグでフィルタ
  if (options?.tag) {
    filteredPosts = filteredPosts.filter((post) =>
      post.tags.some((tag) => tag.toLowerCase() === options.tag!.toLowerCase())
    );
  }

  // 検索でフィルタ
  if (options?.search) {
    const searchLower = options.search.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.summary.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower)
    );
  }

  // 公開日でソート（新しい順）
  return filteredPosts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// スラッグで記事を取得
export async function getPostBySlug(slug: string): Promise<Post | null> {
  return posts.find((post) => post.slug === slug) || null;
}

// IDで記事を取得
export async function getPostById(id: string): Promise<Post | null> {
  return posts.find((post) => post.id === id) || null;
}

// 全てのタグを取得
export async function getAllTags(): Promise<string[]> {
  const tagSet = new Set<string>();
  posts
    .filter((post) => post.status === "published")
    .forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });
  return Array.from(tagSet).sort();
}

// 記事を作成
export async function createPost(post: Omit<Post, "id" | "publishedAt" | "updatedAt">): Promise<Post> {
  const newPost: Post = {
    ...post,
    id: Date.now().toString(),
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  posts.push(newPost);
  return newPost;
}

// 記事を更新
export async function updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) return null;

  posts[index] = {
    ...posts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return posts[index];
}

// 記事を削除
export async function deletePost(id: string): Promise<boolean> {
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) return false;
  posts.splice(index, 1);
  return true;
}

