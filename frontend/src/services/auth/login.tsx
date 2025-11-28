import { useTranslations } from "next-intl";
import { extractUserInfo, setAuthCookies } from "@/services/auth/session";
import handleLogin from "@/services/http/login";
import { APIErrorDetails, HandleLoginResponse, LaravelErrorResponse, LoginFieldErrors } from "@/types/http/login";

function isLaravelResponse(v: unknown): v is LaravelErrorResponse {
    return typeof v === "object" && v !== null &&
        (("message" in (v as object)) || ("errors" in (v as object)) || ("error" in (v as object)));
}

export default async function handleLoginSubmit(
    e: React.FormEvent<HTMLFormElement>,
    formData: { login: string; password: string },
    setErrors: React.Dispatch<React.SetStateAction<{ login: string[]; password: string[] }>>,
    t: ReturnType<typeof useTranslations>
): Promise<string | null> {
    e.preventDefault();
    const { code, response } = await handleLogin(e, formData, t) as HandleLoginResponse;

    if (code >= 200 && code < 300) {
        try {
            const data = (typeof response === "object" && response !== null)
                ? (response as Record<string, unknown>)
                : {};

            const token = typeof data.access_token === "string" ? data.access_token : undefined;
            const refreshToken = typeof data.refresh_token === "string" ? data.refresh_token : undefined;
            const expiresInSeconds =
                typeof data.expires_in === "number" ? data.expires_in :
                    typeof data.expires_in === "string" ? Number(data.expires_in) :
                        60 * 60 * 24 * 30;

            if (token) {
                const user = extractUserInfo(data);
                await setAuthCookies({ token, refreshToken, expiresInSeconds, user });
                window.location.reload();
            }
        } catch {
            return t('error.connectionError');
        }

        return null;
    }

    const errorDetails: APIErrorDetails = isLaravelResponse(response)
        ? (response.errors ?? response.error?.details ?? {})
        : {};

    const message: string | undefined = isLaravelResponse(response)
        ? (response.message ?? response.error?.message)
        : undefined;

    if (!message?.length && code !== 422)
        return String((isLaravelResponse(response) && response.message) ?? t('error.connectionError'));

    const toArr = (v: unknown): string[] =>
        Array.isArray(v) ? (v as string[]) : v ? [String(v)] : [];

    const next: LoginFieldErrors = {
        login: toArr(errorDetails.login ?? errorDetails.email),
        password: toArr(errorDetails.password),
    };

    const hasDetails = next.login.length > 0 || next.password.length > 0;

    if (!hasDetails && message)
        return String(message);

    setErrors(next);
    return null;
}
