import React from "react";
import api from "@/services/api";
import { isAxiosError } from "axios";
import { HandleLoginResponse } from "@/types/http/login";
import { useTranslations } from "next-intl";

export default async function handleLogin(
  e: React.FormEvent,
  formData: { login: string; password: string },
  t: ReturnType<typeof useTranslations>
): Promise<HandleLoginResponse> {
  e.preventDefault();

  try {
    const res = await api.post("/authentication/login/", formData);
    return { code: res.status, response: res.data };
  } catch (error) {
    if (isAxiosError(error))
      return {
        code: error.response?.status ?? 0,
        response: error.response?.data ?? { message: error.message },
      };

    return { code: 0, response: { message: t("errors.UnexpectedError") } };
  }
}
