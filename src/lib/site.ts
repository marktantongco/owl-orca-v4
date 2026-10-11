/**
 * Single source of truth for site-wide URLs and commands.
 *
 * The GitHub repo was renamed to `owl-orca-v4`; older links pointed at
 * `owl-orca-v3` / `owl-orca-v3-v3` / `owl-orca`, which 404 or lead to
 * stale code. All user-facing links and the one-line installer must be
 * derived from these constants.
 */
export const SITE_URL = "https://owl-orca-v3.vercel.app";
export const REPO_URL = "https://github.com/marktantongco/owl-orca-v4";
export const REPO_RAW_BASE = "https://raw.githubusercontent.com/marktantongco/owl-orca-v4/main";
export const INSTALL_COMMAND = `curl -fsSL ${REPO_RAW_BASE}/install.sh | bash`;
export const SITE_VERSION = "8.0.0";
