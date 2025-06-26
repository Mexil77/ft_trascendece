export class UserService {
	static async getUser(userId: string) {
		try {
			return { user: "pepito", userId };
		} catch (error) {
			console.error(error);
		}
	}
}
