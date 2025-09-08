import type { Session, User } from 'better-auth';

declare global {
	namespace App {
		interface Locals {
			session?: Session;
			user?: User;
		}
	}
}

export {};
