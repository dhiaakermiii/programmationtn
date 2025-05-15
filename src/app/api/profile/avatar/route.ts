import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse multipart form data
  const formData = await req.formData();
  const file = formData.get("avatar");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Save file to /public/avatars
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop();
  const fileName = `${session.user.email.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}.${ext}`;
  const filePath = path.join(process.cwd(), "public", "avatars", fileName);
  fs.writeFileSync(filePath, buffer);

  // Update user image in DB
  const avatarUrl = `/avatars/${fileName}`;
  await prisma.user.update({
    where: { email: session.user.email },
    data: { image: avatarUrl },
  });

  return NextResponse.json({ avatarUrl });
} 