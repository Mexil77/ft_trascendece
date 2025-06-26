export interface Route {
	path: string;
	component: () => HTMLElement;
	protected: boolean;
}
