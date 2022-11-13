import { TRPCError } from "@trpc/server";
import { S3 } from "aws-sdk";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const BUCKET_NAME = "jazbahana-image-upload-test";

type UploadProps = { userId: string; noteId: string };

export const getObjectKey = ({ userId, noteId }: UploadProps) => {
  return `notes/${userId}/${noteId}`;
};

const s3 = new S3();

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
      const userId = ctx.session?.user?.id || "";
      const note = await ctx.prisma.note.create({
        data: { userId, filename, roomId },
      });

      const presignedPost = await new Promise((resolve, reject) => {
        s3.createPresignedPost(
          {
            Fields: {
              key: getObjectKey({
                userId: ctx.session?.user?.id || "",
                noteId: note.id,
              }),
            },
            Conditions: [
              ["starts-with", "$Content-Type", ""],
              ["content-length-range", 0, 1000000],
            ],
            Expires: 30,
            Bucket: BUCKET_NAME,
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
  add: publicProcedure
    .input(
      z.object({
        filename: z.string(),
        roomId: z.string().uuid().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { filename, roomId } = input;
      const userId = ctx.session?.user?.id as string;
      await ctx.prisma.note.create({ data: { filename, roomId, userId } });
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
