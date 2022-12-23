import { TRPCError } from "@trpc/server";
import { S3 } from "aws-sdk";
import { env } from "env/server.mjs";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

type UploadProps = {
  userId: string;
  noteId: string;
};

export const getObjectKey = ({ userId, noteId }: UploadProps) => {
  return `notes/${userId}/${noteId}`;
};

const s3 = new S3({
  region: "us-east-1",
  accessKeyId: env.AWS_S3_ACCESS_KEY,
  secretAccessKey: env.AWS_S3_SECRET_KEY,
  signatureVersion: "v4",
});

export const noteRouter = router({
  createPresignedUrl: publicProcedure
    .input(
      z.object({
        filename: z.string(),
        roomId: z.string().uuid().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { filename, roomId } = input;
      const userId = ctx.session?.user?.id as string;
      const note = await ctx.prisma.note.create({
        data: { userId, filename, roomId },
      });

      const presignedPost = await new Promise((resolve, reject) => {
        s3.createPresignedPost(
          {
            Fields: {
              key: getObjectKey({
                userId,
                noteId: note.id,
              }),
            },
            Conditions: [
              ["starts-with", "$Content-Type", ""],
              ["content-length-range", 0, 8_388_608],
            ],
            Expires: 30,
            Bucket: env.AWS_S3_BUCKET_NAME,
          },
          (err, signed) => {
            if (err) return reject(err);
            resolve(signed);
          }
        );
      });

      return presignedPost as {
        url: string;
        fields: object;
      };
    }),
  getNotesForUser: publicProcedure.query(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id;
    return await ctx.prisma.note.findMany({ where: { userId } });
  }),
  getNotesForRoom: publicProcedure
    .input(
      z.object({
        roomId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { roomId } = input;
      const room = await ctx.prisma.room.findUnique({
        where: { id: roomId },
        include: { notes: true },
      });

      if (!room) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return room.notes;
    }),
});
