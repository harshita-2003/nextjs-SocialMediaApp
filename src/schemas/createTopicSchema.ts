import * as yup from 'yup';

export const createTopicSchema = yup.object({
  name: yup
    .string()
    .min(3, 'Name must be at least 3 characters')
    .matches(/^[a-z-]+$/, 'Must be lower case letters')
    .required('Name is required'),
  description: yup
    .string()
    .min(5, 'Description must be at least 5 characters')
    .required('Description is required'),
});