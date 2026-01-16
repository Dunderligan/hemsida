import { env } from '$env/dynamic/private';

export const load = async ({ locals, cookies }) => {
	const theme = cookies.get('theme') ?? null;

	// SOURCE_COMMIT is set by Coolify to the current git commit hash
	const commitHash = env.SOURCE_COMMIT ?? null;

	// pass these down from the server so any component can access them
	return {
		user: locals.user,
		commitHash,
		theme
	};
};
