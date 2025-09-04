import * as yup from 'yup'

export const createCommentSchema = yup.object({
  content: yup
            .string()
            .trim()
            .min(3, "It should contain atleast 3 characters")
            .max(200,"It cannot have more than 200 characters"),
});