import { defineContext } from './util';

const { get, set } = defineContext<ConfirmContext>('$_confirm_state');

export type ConfirmData = {
	title: string;
	description: string;
	negative?: boolean;
	icon?: string;
	action?: () => Promise<void>;
};

export class ConfirmContext {
	static get = get;
	static set = set;

	current: ConfirmData | null = $state(null);

	private resolver: ((confirmed: boolean) => void) | null = null;

	async confirm(data: ConfirmData): Promise<boolean> {
		this.current = data;

		return new Promise<boolean>((resolve) => {
			this.resolver = resolve;
		});
	}

	async submit(result: boolean) {
		if (!this.resolver) return;

		this.resolver(result);
		this.resolver = null;
		this.current = null;
	}
}
