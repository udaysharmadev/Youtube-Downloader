import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const response = await fetch("https://api.github.com/repos/udaysharmadev/Youtube-Downloader", {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      // If we hit a rate limit or repo doesn't exist, return a fallback gracefully
      return NextResponse.json({ stars: null }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json({ stars: data.stargazers_count }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ stars: null }, { status: 200 });
  }
}
