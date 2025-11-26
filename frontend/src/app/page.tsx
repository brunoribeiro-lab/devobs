import LanguageSwitcher from '@/components/language/Switcher';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { Google, Facebook, LinkedIn, Github } from "@/components/ui/icons";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const translate = await getTranslations();
    const providers = {
        Google,
        Facebook,
        LinkedIn,
        Github,
    };

    return (
        <div className="login-background">
            <div className="min-h-screen border-gradient-1 flex items-center justify-center p-4">
                {/* Card de Login */}
                <div className="max-w-xl w-full card-login rounded-2xl shadow-lg overflow-hidden border-t-4 border-blue-500">
                    <div className="flex">
                        <div className="p-8 pt-4 flex-1">
                            <h4 className="text-2xl font-bold text-gray-400">{translate('login.getStarted')}</h4>
                            <p className="text-gray-300 mt-2">{translate('login.enterCredentials')}</p>
                        </div>
                        <div className="flex justify-end p-4">
                            <LanguageSwitcher />
                        </div>
                    </div>
                    <div className="p-8">
                        {/* Formulário */}
                        <form className="space-y-6">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                    {translate('login.email')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="jhon@example.com"
                                    className="w-full px-3 py-2 border text-gray-400 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Senha */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                    {translate('login.password')}
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Enter Password"
                                        className="w-full px-3 py-2 border text-gray-400 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        👁️
                                    </button>
                                </div>
                            </div>

                            {/* Lembrar senha e Esqueci senha */}
                            <div className="flex justify-between items-center">
                                <a href="#" className="text-sm text-blue-500 hover:text-blue-700">
                                    {translate('login.forgotPassword')}
                                </a>
                            </div>

                            {/* Botão de Login */}
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                            >
                                Login
                            </button>

                            {/* Cadastro */}
                            <div className="text-center">
                                <p className="text-gray-300 text-sm">
                                    {translate('login.dontHaveAccount')} {' '}
                                    <a href="#" className="text-blue-500 hover:text-blue-700 font-medium">
                                        {translate('login.signUpHere')}
                                    </a>
                                </p>
                            </div>
                        </form>

                        {/* Separador */}
                        <div className="my-6 flex items-center">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-4 text-gray-300 text-sm font-semibold">{translate('login.orSignInWith')}</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        {/* Login Social */}
                        <div className="flex justify-center space-x-4">
                            {Object.entries(providers).map(([name, IconCmp]) => (
                                <button
                                    key={name}
                                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center
                 hover:bg-gray-300 transition duration-200"
                                >
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
