import QRCode from "qrcode";
import speakeasy from "speakeasy";

export const generateSecret =
	async (): Promise<speakeasy.GeneratedSecret> => {
		return speakeasy.generateSecret();
	};

export const generateQRByUrl = async (
	secret: speakeasy.GeneratedSecret
) => {
	return QRCode.toDataURL(secret.otpauth_url as string);
};

export const constructQRByData = async (qrSecret: string) => {
	return QRCode.toDataURL(
		`otpauth://totp/SecretKey?secret=${qrSecret}`
	);
};

export const otpVerificationCode = (
	qrSecret: string,
	otpCode: string
) => {
	return speakeasy.totp.verify({
		secret: qrSecret,
		encoding: "base32",
		token: otpCode,
		window: 1,
	});
};
