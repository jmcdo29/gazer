import { TypeschemaDto } from '@nest-lab/typeschema';
import { email, object, Output, string } from 'valibot';

const LoginSchema = object({
  email: string([email()]),
  password: string(),
});

export type Login = Output<typeof LoginSchema>;

export class LoginDto extends TypeschemaDto(LoginSchema) {}
