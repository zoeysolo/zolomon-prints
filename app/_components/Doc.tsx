import type { ContentDoc } from "@/lib/content";

// Renders a draft content doc. Folder is underscore-prefixed so it is not a
// route. A small "draft" ribbon shows while the page is still noindex, as a
// visible reminder that this copy is not yet approved/public.
export default function Doc({ doc }: { doc: ContentDoc }) {
  return (
    <main className="container">
      {doc.noindex && (
        <p className="draft-flag">
          draft<span className="dot">.</span> not yet published or indexed
        </p>
      )}
      <article className="doc" dangerouslySetInnerHTML={{ __html: doc.html }} />
    </main>
  );
}
