import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const payload = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { message: errorText || "Failed to update service category" },
        { status: res.status }
      );
    }

    // PUT returns 204 No Content, so we don't parse JSON. We fetch the updated entity to return it to the client!
    const getRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${id}`, {
      cache: "no-store",
    });
    
    if (getRes.ok) {
      const updatedData = await getRes.json();
      return NextResponse.json(updatedData);
    }

    return NextResponse.json({ id, ...payload });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/service-categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { message: errorText || "Failed to delete service category" },
        { status: res.status }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "An error occurred" }, { status: 500 });
  }
}
