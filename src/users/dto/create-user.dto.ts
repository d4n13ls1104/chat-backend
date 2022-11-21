import * as yup from 'yup';

export class CreateUserDto {
  email: string;
  username: string;
  password: string;
}

export const createUserValidationSchema = yup.object({
  email: yup
    .string()
    .min(3, 'Email must be at least 3 characters')
    .max(254, 'Email must not exceed 254 characters')
    .email('Email must be a valid email')
    .required('Email is a required field'),

  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(16, 'Username must not exceed 16 characters')
    .matches(/^[a-zA-Z0-9_.]*$/, {
      message:
        'Username may only contain letters, numbers, underscores and periods',
    })
    .required('Username is a required field'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is a required field'),
});
