import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("posts/:slug", "routes/posts.$slug.tsx"),
  route("tags/:tag", "routes/tags.$tag.tsx"),
  route("admin", "routes/admin._index.tsx"),
  route("admin/posts/new", "routes/admin.posts.new.tsx"),
  route("admin/posts/:slug/edit", "routes/admin.posts.$slug.edit.tsx"),
] satisfies RouteConfig;
