import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; priceId: string }> }
) {
  try {
    const { id, priceId } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const body = await request.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/service-plans/${id}/prices/${priceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { message: errText || "Failed to update plan price" },
        { status: res.status }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; priceId: string }> }
) {
  try {
    const { id, priceId } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/service-plans/${id}/prices/${priceId}`, {
      method: "DELETE",
      headers: {
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { message: errText || "Failed to delete plan price" },
        { status: res.status }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}
