import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="size-4 text-neutral-500" weight="bold" />
          Back
        </Link>
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <h1>Legal & Disclaimer</h1>
          <p className="text-sm text-muted-foreground">
            This is a proof-of-concept (POC) application. Specifications,
            imagery, and data shown are for demonstration only and do not
            constitute a commercial offer or binding specifications.
          </p>
          <p>
            All product names and trademarks are the property of their
            respective owners.
          </p>
        </article>
      </div>
    </div>
  );
}
