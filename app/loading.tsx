export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl">
        <div className="h-6 w-48 rounded bg-foreground/10" />
        <div className="mt-4 h-4 w-full rounded bg-foreground/10" />
        <div className="mt-2 h-4 w-5/6 rounded bg-foreground/10" />
        <div className="mt-2 h-4 w-4/6 rounded bg-foreground/10" />
      </div>
    </div>
  );
}
