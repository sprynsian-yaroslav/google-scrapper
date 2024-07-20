
const LINK_AUTH = "/auth";
const ROUTE_AUTH = "/auth/*"

export const AUTH_GROUP_ROUTES = {
	BASE: ROUTE_AUTH,
	LINK_LOGIN: `/login`,
	LINK_MFA: `/multi-factor-authentication`,
	LINK_LOG_OUT: `/logout`,
	LINK_FORGOT_PASSWORD: `/forgot-password`,
	LINK_RESET_PASSWORD: `/restore-password`,
	LINK_REGISTER: `/register`,
	LINK_EXPIRED: `/expired`,
	LINK_SENT: `/link-sent`,
	LINK_BLOCKED_ACCOUNT: `/blocked-account`,
	EXTERNAL: {
		TERMS_OF_USE: `/privacy`,
		AFTER_LOGIN: "/app"
	}
}

export const AUTH_GROUP_LINKS = {
	BASE: LINK_AUTH,
	LINK_LOGIN: `${LINK_AUTH}/login`,
	LINK_MFA: `${LINK_AUTH}/multi-factor-authentication`,
	LINK_LOG_OUT: `${LINK_AUTH}/logout`,
	LINK_FORGOT_PASSWORD: `${LINK_AUTH}/forgot-password`,
	LINK_RESET_PASSWORD: `${LINK_AUTH}/restore-password`,
	LINK_EXPIRED: `${LINK_AUTH}/expired`,
	LINK_SENT: `${LINK_AUTH}/link-sent`,
	LINK_BLOCKED_ACCOUNT: `${LINK_AUTH}/blocked-account`,
	EXTERNAL: {
		AFTER_LOGIN: "/app"
	}
};