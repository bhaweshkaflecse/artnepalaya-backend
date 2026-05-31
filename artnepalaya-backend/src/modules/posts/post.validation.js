import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    caption: z.string().max(2200).optional(),
    
    // 1. Convert form-data string "true" into boolean, keep your custom error
    isHumanMade: z.preprocess(
      (val) => val === 'true' || val === true, 
      z.literal(true, {
        errorMap: () => ({ message: "You must declare that this artwork is human-made." })
      })
    ),

    // NSFW flag - convert form-data string "true" into boolean
    isNsfw: z.preprocess(
      (val) => val === 'true' || val === true,
      z.boolean()
    ).optional().default(false),
    
    // 2. Convert form-data string into array, keep your max(15) and lowercase rules
    tags: z.preprocess(
      (val) => {
        if (typeof val === 'string') {
          try { return JSON.parse(val); } catch (e) { return [val]; }
        }
        return val || [];
      }, 
      z.array(z.string().toLowerCase()).max(15).optional()
    ),

    // 3. Media is optional in Zod because Multer/Cloudinary handles the actual file validation!
    media: z.any().optional() 
  })
});

export const feedPaginationSchema = z.object({
  query: z.object({
    cursor: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid cursor").optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).default("15")
  })
});