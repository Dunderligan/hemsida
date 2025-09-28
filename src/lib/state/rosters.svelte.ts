import type { FullMatch, Roster } from '$lib/types';
import { defineContext } from './util';

const { get, set } = defineContext<RosterState>('$_roster_state');

export class RosterState {
	static get = get;
	static set = set;

	editingMatch: FullMatch | null;
	canEditRosters: boolean;
	map: Map<string, Roster>;

	constructor(list: Roster[]) {
		this.editingMatch = $state(null);
		this.canEditRosters = true;
		this.map = $state(new Map(list.map((roster) => [roster.id, roster])));
	}

	edit = (match: FullMatch, canEditRosters?: boolean) => {
		if (!match.id) return;

		this.editingMatch = match;
		this.canEditRosters = canEditRosters ?? true;
	};

	stopEditing = () => {
		this.editingMatch = null;
	};

	find = (id?: string | null) => {
		return id ? this.map.get(id) : null;
	};
}
