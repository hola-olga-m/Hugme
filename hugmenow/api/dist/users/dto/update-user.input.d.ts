import { CreateUserInput } from './create-user.input';
declare const UpdateUserInput_base: import("@nestjs/common").Type<Partial<Omit<CreateUserInput, "username" | "email">>>;
export declare class UpdateUserInput extends UpdateUserInput_base {
    name?: string;
    password?: string;
    avatarUrl?: string;
}
export {};
