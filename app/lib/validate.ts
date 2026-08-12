import z from "zod";

export const LoginSchema = z.object({
    email: z.string().email("email is not valid"),
    password: z.string().min(6, "password must be at least 6 characters").max(30, "password must be maximum 30 characters")
})

const Conversation = z.object({
    titleId: z.uuid(),
    title: z.string().min(2, "title must be at least 2 characters").max(50, "title must be maximum 50 characters"),
    description: z.string().min(2, "description must be at least 2 characters").max(150, "description must be maximum 50 characters")
})


 export const RegisterSchema = z.object({
    fullName: z.string().min(3, "fullName must be at least 3 characters . . .").max(20, "fullName must be maximum 20 characters . . ."),
    email: z.string().email("email is not valid"),
    password: z.string().min(6, "password must be at least 6 characters").max(30, "password must be maximum 30 characters")
})
export type LoginInput = z.infer<typeof LoginSchema>
export type Conversation = z.infer<typeof Conversation>
export type RegisterInput = z.infer<typeof RegisterSchema>