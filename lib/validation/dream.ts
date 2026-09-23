import { z } from 'zod';

export const dreamInputSchema = z.object({ dream: z.string().trim().min(10, '꿈 내용을 10자 이상 입력해 주세요.').max(1000, '꿈 내용은 1,000자 이하로 입력해 주세요.') });
export const dreamResultSchema = z.object({
  title:z.string().min(1).max(80), summary:z.string().min(1).max(300), interpretation:z.string().min(1).max(1200),
  symbols:z.array(z.object({symbolName:z.string().min(1).max(30),symbolMeaning:z.string().min(1).max(300)})).min(1).max(5),
  category:z.string().min(1).max(40), closingMessage:z.string().min(1).max(300)
});
export type DreamResult = z.infer<typeof dreamResultSchema>;
