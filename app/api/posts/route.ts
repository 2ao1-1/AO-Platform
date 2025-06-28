// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";

// GET /api/posts - جلب جميع المنشورات
export async function GET(request: NextRequest) {
  try {
    // هنا هتجيب البيانات من قاعدة البيانات
    const posts = [
      { id: 1, title: "منشور أول", content: "محتوى المنشور" },
      { id: 2, title: "منشور ثاني", content: "محتوى آخر" },
    ];

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: "خطأ في جلب المنشورات" },
      { status: 500 }
    );
  }
}

// POST /api/posts - إنشاء منشور جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    // التحقق من البيانات
    if (!title || !content) {
      return NextResponse.json(
        { error: "العنوان والمحتوى مطلوبان" },
        { status: 400 }
      );
    }

    // هنا هتضيف المنشور لقاعدة البيانات
    const newPost = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date(),
    };

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "خطأ في إنشاء المنشور" },
      { status: 500 }
    );
  }
}
