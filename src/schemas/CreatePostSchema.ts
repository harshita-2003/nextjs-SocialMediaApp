import * as yup from 'yup'

export const CreatePostSchema = yup.object({
    title : yup
        .string()
        .min(3, "Title must be atleast 3 characters")
        .required("Title is required"),
    content: yup
        .string()
        .min(5, 'Description must be at least 5 characters')
        .required('Description is required'),
})