"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/language/Switcher';
import { Google, Facebook, LinkedIn, Github } from "@/components/ui/icons";
import Input from '@/components/ui/Input';
import handleLoginSubmit from '@/services/auth/login';
import { loginSchema } from '@/validation/login';
import { LoginFieldErrors } from '@/types/http/login';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Dialog from '@/components/ui/Dialog';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

type FormFields = 'login' | 'password';

export default function Home() {
  const isAuthenticated = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const t = useTranslations();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [errors, setErrors] = useState<LoginFieldErrors>({ login: [], password: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, id, value } = e.currentTarget;
    const key = (name || id) as FormFields;
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]?.length) setErrors((prev) => ({ ...prev, [key]: [] }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const flattened = z.flattenError(result.error);
      const f = flattened.fieldErrors;

      setErrors({
        login: f.login ?? [],
        password: f.password ?? [],
      });

      setIsLoading(false);
      return;
    }

    const parsed = result.data;
    const msg = await handleLoginSubmit(e, parsed, setErrors, t);
    if (msg) {
      setDialogMessage(msg);
      setDialogOpen(true);
    }
    setIsLoading(false);
  };

  const providers = { Google, Facebook, LinkedIn, Github };

  return (
    <div className="login-background">
      <div className="min-h-screen border-gradient-1 flex items-center justify-center p-4">
        <div className="max-w-xl w-full card-login rounded-2xl shadow-lg overflow-visible border-t-4 border-blue-500 relative">
          <div className="flex justify-between items-start p-4 pb-0">
            <div className="p-4 pt-2 flex-1">
              <h4 className="text-2xl font-bold text-gray-400">{t("login.getStarted")}</h4>
              <p className="text-gray-300 mt-2">{t("login.enterCredentials")}</p>
            </div>
            <div className="p-4 pt-2">
              <LanguageSwitcher />
            </div>
          </div>

          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            title={t("errors.invalidCredentialsTitle")}
            message={dialogMessage}
            actions={[{ label: 'OK', role: 'cancel' }]}
          />

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={t("login.email")}
                type="login"
                id="login"
                name="login"
                placeholder={t("login.emailPlaceholder")}
                leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                value={formData.login}
                onChange={handleChange}
                errorMessages={errors.login}
                className="text-white border-gray-700"
                labelClassName="text-white"
              />

              <Input
                label={t("login.password")}
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder={t("login.passwordPlaceholder")}
                value={formData.password}
                onChange={handleChange}
                leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                rightElement={
                  <button
                    type="button"
                    className="flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                }
                errorMessages={errors.password}
                className="text-white border-gray-700"
                labelClassName="text-white"
              />

              <div className="flex justify-between items-center">
                <a href="#" className="text-sm text-blue-500 hover:text-blue-700 transition duration-200">
                  {t("login.forgotPassword")}
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t("login.signingIn") : t("login.loginButton")}
              </button>

              <div className="text-center">
                <p className="text-gray-300 text-sm">
                  {t("login.dontHaveAccount")} <a href="#" className="text-blue-500 hover:text-blue-700 font-medium">{t("login.signUpHere")}</a>
                </p>
              </div>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-300 text-sm font-semibold">{t("login.orSignInWith")}</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex justify-center space-x-4">
              {Object.entries(providers).map(([name, IconCmp]) => (
                <button key={name} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                  <IconCmp size={32} className="text-gray-700" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
