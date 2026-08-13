import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email("email is not valid"),
    password: z.string()
        .min(6, "password must be at least 6 characters")
        .max(20, "password must be maximum 20 characters")
});

export const RegisterSchema = z.object({
    email: z.string().email("email is not valid"),
    
    username: z.string()
        .min(4, "username must be at least 4 characters")
        .max(20, "username must be maximum 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "username can only contain letters, numbers and underscores"),
    
    password: z.string()
        .min(6, "password must be at least 6 characters")
        .max(20, "password must be maximum 20 characters")
        .refine((pass) => /[A-Z]/.test(pass), {
            message: "password must contain at least one uppercase letter"
        })
        .refine((pass) => /[a-z]/.test(pass), {
            message: "password must contain at least one lowercase letter"
        })
        .refine((pass) => /[0-9]/.test(pass), {
            message: "password must contain at least one number"
        })
        .refine((pass) => /[^A-Za-z0-9]/.test(pass), {
            message: "password must contain at least one special character"
        }),
    
    full_name: z.string()
        .min(3, "full_name must be at least 3 characters")
        .max(50, "full_name must be maximum 50 characters"),
    
    avatar_url: z.string()
        .url("avatar must be a valid URL")
        .regex(/\.(jpg|jpeg|png|gif|webp)$/i, "avatar must be an image (jpg, png, gif, webp)")
        .optional()
        .or(z.literal("")),
    
    bio: z.string()
        .max(500, "bio must be maximum 500 characters")
        .optional()
        .or(z.literal("")),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;