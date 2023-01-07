import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const testUserId = "c00p6qup20000ckkzslahp5pn";
  const firstPostId = "5c03994c-fc16-47e0-bd02-d218a370a078";

  await prisma.user.upsert({
    where: {
      id: testUserId,
    },
    create: {
      id: testUserId,
      name: "Test User",
      username: "testuser",
    },
    update: {},
  });
  await prisma.topic.createMany({
    data: [
      {
        name: "Physics",
        image: "https://cdn-icons-png.flaticon.com/512/3254/3254075.png",
      },
      {
        name: "Math",
        image: "https://cdn-icons-png.flaticon.com/512/2072/2072899.png",
      },
      {
        name: "Chemistry",
        image: "https://cdn-icons-png.flaticon.com/512/995/995446.png",
      },
      {
        name: "Biology",
        image: "https://cdn-icons-png.flaticon.com/512/2941/2941552.png",
      },
      {
        name: "Geography",
        image: "https://cdn-icons-png.flaticon.com/512/869/869196.png",
      },
      {
        name: "History",
        image: "https://cdn-icons-png.flaticon.com/512/2682/2682065.png",
      },
      {
        name: "Computer Science",
        image: "https://cdn-icons-png.flaticon.com/512/4319/4319162.png",
      },
      {
        name: "Kazakh",
        image: "https://cdn-icons-png.flaticon.com/512/6211/6211443.png",
      },
      {
        name: "Russian",
        image: "https://cdn-icons-png.flaticon.com/512/4628/4628645.png",
      },
      {
        name: "English",
        image: "https://cdn-icons-png.flaticon.com/512/197/197374.png",
      },
      {
        name: "Art",
        image: "https://cdn-icons-png.flaticon.com/512/2970/2970785.png",
      },
    ],
    skipDuplicates: true,
  });
  await prisma.room.upsert({
    where: {
      id: firstPostId,
    },
    create: {
      id: firstPostId,
      title: "CMS vs WYSIWYG",
      description: "what's the difference? :/",
      userId: testUserId,
    },
    update: {},
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
