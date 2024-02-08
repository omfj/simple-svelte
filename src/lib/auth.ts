import { Bcrypt } from 'oslo/password';

export const SESSION_COOKIE_NAME = 'session';
export const DEFAULT_SESSION_LENGTH = 1000 * 60 * 60 * 24 * 7;

export const bcrypt = new Bcrypt();
