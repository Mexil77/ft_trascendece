export interface CreateUserDto {
	userName: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface AuthUserDto {
	userName: string;
	password: string;
}

export interface VerifyUserDto {
	otpCode: string;
}
