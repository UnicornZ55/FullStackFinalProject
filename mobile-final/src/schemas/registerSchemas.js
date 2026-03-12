import { z } from "zod";

const blockedUsernames = ["admin", "root", "superuser"];

export const accountSchema = z.object({
  email: z.string().email("กรุณากรอกอีเมลให้ถูกต้อง"),
  password: z
    .string()
    .min(6, "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร"),
  username: z
    .string()
    .min(3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร"),
});

const urlRegex = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/;

export const profileSchema = z
  .object({
    occupation: z.string().min(1, "โปรดเลือกอาชีพ"),
    company: z.string().optional(),
    github: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.occupation === "Developer") {
      if (!data.github || data.github.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "กรุณากรอก GitHub/Portfolio URL",
          path: ["github"],
        });
        return;
      }

      if (!urlRegex.test(data.github.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "ต้องเป็น URL ที่ถูกต้อง (https://...)",
          path: ["github"],
        });
      }
    }
  });

export const summarySchema = z.object({
  account: accountSchema,
  profile: profileSchema,
});
