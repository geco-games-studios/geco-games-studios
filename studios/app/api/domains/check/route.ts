import { domainToASCII } from "node:url"
import { NextRequest, NextResponse } from "next/server"

function isValidDomain(domain: string) {
  const labels = domain.split(".")

  return (
    labels.length >= 2 &&
    labels[labels.length - 1].length >= 2 &&
    labels.every(
      (label) =>
        label.length > 0 &&
        label.length <= 63 &&
        /^[a-z0-9]/.test(label) &&
        /[a-z0-9]$/.test(label) &&
        /^[a-z0-9-]+$/.test(label),
    )
  )
}

export async function GET(request: NextRequest) {
  const domain = domainToASCII(request.nextUrl.searchParams.get("domain")?.trim().toLowerCase() ?? "")

  if (!domain || domain.length > 253 || !isValidDomain(domain)) {
    return NextResponse.json(
      { message: "Enter a valid domain name, such as yourstudio.com." },
      { status: 400 },
    )
  }

  try {
    const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      headers: { Accept: "application/rdap+json" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    })

    if (response.status === 200) {
      return NextResponse.json({
        domain,
        available: false,
        message: "This domain appears to be registered. Availability can change; confirm with a registrar.",
      })
    }

    if (response.status === 404) {
      return NextResponse.json({
        domain,
        available: true,
        message:
          "No registration record was found. The domain may still be reserved or unavailable; confirm with a registrar before purchasing.",
      })
    }

    return NextResponse.json(
      { message: "The domain registry could not confirm availability. Please try again later." },
      { status: 502 },
    )
  } catch {
    return NextResponse.json(
      { message: "The domain lookup service is temporarily unavailable. Please try again later." },
      { status: 502 },
    )
  }
}
