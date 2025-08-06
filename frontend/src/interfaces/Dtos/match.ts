export interface CreateMatchDto {
	player1Id: string;
	player2Id: string;
	score1: number;
	score2: number;
	limitScore: number;
	limitTime: number;
	matchTime: number;
}
