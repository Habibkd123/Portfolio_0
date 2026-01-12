import Link from "next/link"

type AnnouncementBarData = {
  id: string
  isVisible?: boolean | null
  message?: string | null
  linkText?: string | null
  linkUrl?: string | null
  backgroundColor?: string | null
  textColor?: string | null
}

export default function AnnouncementBar({
  data,
}: {
  data?: AnnouncementBarData
}) {
  if (!data?.isVisible || !data?.message) return null

  return (
    <div
      className="w-full border-b"
      style={{
        backgroundColor: data.backgroundColor ?? undefined,
        color: data.textColor ?? undefined,
      }}
    >
      <div className="container mx-auto px-4 py-2 text-sm flex items-center justify-center gap-2 text-center">
        <span>{data.message}</span>
        {data.linkUrl ? (
          <Link
            href={data.linkUrl}
            className="underline underline-offset-4 font-medium"
            style={{ color: data.textColor ?? undefined }}
          >
            {data.linkText || "Learn more"}
          </Link>
        ) : null}
      </div>
    </div>
  )
}
