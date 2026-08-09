import { notFound } from 'next/navigation'

// Blog content isn't built yet — this placeholder keeps the route valid
// (so the build doesn't fail on a real slug) while returning 404 until
// a real blog_posts table + fetching logic replaces this.
export default function BlogPostPage() {
  notFound()
}
