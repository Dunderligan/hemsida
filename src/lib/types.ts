export type FullRank = {
	rank: Rank;
	tier: number;
};

export enum Rank {
	BRONZE = 'bronze',
	SILVER = 'silver',
	GOLD = 'gold',
	PLATINUM = 'platinum',
	DIAMOND = 'diamond',
	MASTER = 'master',
	GRANDMASTER = 'grandmaster',
	CHAMPION = 'champion'
}

export enum SocialPlatform {
	YOUTUBE = 'youtube',
	TWITTER = 'twitter'
}

export enum Role {
	DAMAGE = 'damage',
	TANK = 'tank',
	SUPPORT = 'support'
}

export enum MatchType {
	GROUP = 'group',
	BRACKET = 'bracket'
}

export type NestedGroup = {
	name: string;
	slug: string;
	division: {
		name: string;
		slug: string;
		season: {
			name: string;
			slug: string;
		};
	};
};

export type Member = {
	rank: Rank;
	tier: number;
	role: Role;
	isCaptain: boolean;
	player: {
		id: string | null;
		battletag: string;
	};
};

export type Roster = {
	id: string;
	name: string;
	slug: string;
	seasonSlug: string;
	group: NestedGroup;
	members: Member[];
	team?: never;
};

export type TeamSocial = {
	platform: SocialPlatform;
	url: string;
};
