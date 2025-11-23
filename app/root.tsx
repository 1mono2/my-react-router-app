import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <nav className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  React Router Blog
                </Link>
                <div className="flex gap-4">
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    記事一覧
                  </Link>
                  <Link
                    to="/admin?token=admin123"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    管理画面
                  </Link>
                </div>
              </div>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-200 bg-gray-50 py-8 dark:border-gray-700 dark:bg-gray-900">
            <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
              <p>&copy; 2024 React Router Blog. Built with React Router v7.</p>
            </div>
          </footer>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">{message}</h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">{details}</p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          ホームに戻る
        </Link>
        {stack && (
          <pre className="mt-8 w-full overflow-x-auto rounded-lg bg-gray-100 p-4 text-left dark:bg-gray-800">
            <code className="text-sm">{stack}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
