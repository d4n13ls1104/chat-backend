import * as yup from 'yup';

export class LoginUserDto {
  email: string;
  password: string;
}

export const loginUserValidationSchema = yup.object({
  email: yup.string().required('Email is a required field'),
  password: yup.string().required('Password is a required field'),
});
