import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium mb-8">
          <span className="text-green-600 mr-2">✓</span>
          Production-Ready Component
        </div>

        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Server-Driven Table Component
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
          A production-grade, reusable data table with URL-driven state,
          server-side operations, and flexible API integration.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/users-table"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-base font-medium hover:bg-primary/90 transition-colors"
          >
            View Live Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Learn More
          </a>
        </div>

        <div id="features" className="grid sm:grid-cols-2 gap-6 text-left">
          <div className="rounded-lg border bg-card p-6">
            <div className="text-2xl mb-2">🔗</div>
            <h3 className="font-semibold mb-2">URL-Driven State</h3>
            <p className="text-sm text-muted-foreground">
              All table state persisted in URL. Share links, refresh pages,
              use browser navigation - state always preserved.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="text-2xl mb-2">🔌</div>
            <h3 className="font-semibold mb-2">API Agnostic</h3>
            <p className="text-sm text-muted-foreground">
              Adapter pattern works with any API structure. No coupling to
              specific response formats or field names.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold mb-2">Server-Side Operations</h3>
            <p className="text-sm text-muted-foreground">
              Pagination, sorting, filtering, and search handled server-side
              for optimal performance with large datasets.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="text-2xl mb-2">🎨</div>
            <h3 className="font-semibold mb-2">Highly Customizable</h3>
            <p className="text-sm text-muted-foreground">
              Custom columns, filters, renderers. TypeScript support.
              Built with TanStack Table and shadcn/ui.
            </p>
          </div>
        </div>

        <div className="mt-12 p-6 rounded-lg border bg-muted/50">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Tech Stack:</span> Next.js App Router •
            React • TypeScript • TanStack Table • TanStack Query • shadcn/ui • Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
