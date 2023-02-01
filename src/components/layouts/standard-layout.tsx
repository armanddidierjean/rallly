import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import React from "react";

import { LoginLink, useLoginModal } from "@/components/auth/login-modal";
import Dropdown, { DropdownItem, DropdownProps } from "@/components/dropdown";
import Adjustments from "@/components/icons/adjustments.svg";
import Cash from "@/components/icons/cash.svg";
import Discord from "@/components/icons/discord.svg";
import DotsVertical from "@/components/icons/dots-vertical.svg";
import Github from "@/components/icons/github.svg";
import Login from "@/components/icons/login.svg";
import Logout from "@/components/icons/logout.svg";
import Menu from "@/components/icons/menu.svg";
import Pencil from "@/components/icons/pencil.svg";
import Question from "@/components/icons/question-mark-circle.svg";
import Spinner from "@/components/icons/spinner.svg";
import Support from "@/components/icons/support.svg";
import Twitter from "@/components/icons/twitter.svg";
import User from "@/components/icons/user.svg";
import UserCircle from "@/components/icons/user-circle.svg";
import ModalProvider, {
  useModalContext,
} from "@/components/modal/modal-provider";
import Popover from "@/components/popover";
import Preferences from "@/components/preferences";
import { useUser } from "@/components/user-provider";
import { DayjsProvider } from "@/utils/dayjs";
import Logo from "~/public/logo.svg";

const HomeLink = () => {
  return (
    <Link href="/">
      <Logo className="inline-block w-28 text-primary-500 transition-colors active:text-primary-600 lg:w-32" />
    </Link>
  );
};

const MobileNavigation: React.VoidFunctionComponent = () => {
  const { user, isUpdating } = useUser();
  const { t } = useTranslation(["common", "app"]);
  return (
    <div
      className="fixed top-0 z-40 flex h-12 w-full shrink-0 items-center justify-between border-b bg-gray-50
     px-4 lg:hidden"
    >
      <div>
        <HomeLink />
      </div>
      <div className="flex items-center">
        {user ? null : (
          <LoginLink className="flex w-full cursor-pointer items-center space-x-2 whitespace-nowrap rounded-md px-2 py-1 font-medium text-slate-600 transition-colors hover:bg-gray-200 hover:text-slate-600 hover:no-underline active:bg-gray-300">
            <Login className="h-5 opacity-75" />
            <span className="inline-block">{t("app:login")}</span>
          </LoginLink>
        )}
        <AnimatePresence initial={false}>
          {user ? (
            <UserDropdown
              placement="bottom-end"
              trigger={
                <motion.button
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{
                    y: -50,
                    opacity: 0,
                  }}
                  data-testid="user"
                  className="group inline-flex w-full items-center space-x-2 rounded-lg px-2 py-1 text-left transition-colors hover:bg-slate-500/10 active:bg-slate-500/20"
                >
                  <div className="relative shrink-0">
                    {isUpdating ? (
                      <Spinner className="h-5 animate-spin" />
                    ) : (
                      <UserCircle className="w-5 opacity-75 group-hover:text-primary-500 group-hover:opacity-100" />
                    )}
                  </div>
                  <div className="hidden max-w-[120px] truncate font-medium xs:block">
                    {user.shortName}
                  </div>
                </motion.button>
              }
            />
          ) : null}
        </AnimatePresence>
        <Popover
          placement="bottom-end"
          trigger={
            <button
              type="button"
              className="group flex items-center whitespace-nowrap rounded-md px-2 py-1 font-medium text-slate-600 transition-colors hover:bg-gray-200 hover:text-slate-600 hover:no-underline active:bg-gray-300"
            >
              <Adjustments className="h-5 opacity-75 group-hover:text-primary-500" />
              <span className="ml-2 hidden sm:block">
                {t("app:preferences")}
              </span>
            </button>
          }
        >
          <Preferences />
        </Popover>
        <Popover
          placement="bottom-end"
          trigger={
            <button
              type="button"
              className="group flex items-center rounded-md px-2 py-1 font-medium text-slate-600 transition-colors hover:bg-gray-200 hover:text-slate-600 hover:no-underline active:bg-gray-300"
            >
              <Menu className="w-5 group-hover:text-primary-500" />
              <span className="ml-2 hidden sm:block">{t("app:menu")}</span>
            </button>
          }
        >
          <AppMenu className="-m-2" />
        </Popover>
      </div>
    </div>
  );
};

const AppMenu: React.VoidFunctionComponent<{ className?: string }> = ({
  className,
}) => {
  const { t } = useTranslation(["common", "app"]);
  return (
    <div className={clsx("space-y-1", className)}>
      <Link
        href="/new"
        className="flex cursor-pointer items-center space-x-2 whitespace-nowrap rounded-md px-2 py-1 pr-4 font-medium text-slate-600 transition-colors hover:bg-gray-200 hover:text-slate-600 hover:no-underline active:bg-gray-300"
      >
        <Pencil className="h-5 opacity-75 " />
        <span className="inline-block">{t("app:newPoll")}</span>
      </Link>
      <a
        target="_blank"
        href="https://support.rallly.co"
        className="flex cursor-pointer items-center space-x-2 whitespace-nowrap rounded-md px-2 py-1 pr-4 font-medium text-slate-600 transition-colors hover:bg-gray-200 hover:text-slate-600 hover:no-underline active:bg-gray-300"
        rel="noreferrer"
      >
        <Support className="h-5 opacity-75" />
        <span className="inline-block">{t("common:support")}</span>
      </a>
    </div>
  );
};

const UserDropdown: React.VoidFunctionComponent<DropdownProps> = ({
  children,
  ...forwardProps
}) => {
  const { logout, user } = useUser();
  const { t } = useTranslation(["common", "app"]);
  const { openLoginModal } = useLoginModal();
  const modalContext = useModalContext();
  if (!user) {
    return null;
  }
  return (
    <Dropdown {...forwardProps}>
      {children}
      {user.isGuest ? (
        <DropdownItem
          icon={Question}
          label={t("app:whatsThis")}
          onClick={() => {
            modalContext.render({
              showClose: true,
              content: (
                <div className="w-96 max-w-full p-6 pt-28">
                  <div className="absolute left-0 -top-8 w-full text-center">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border-8 border-white bg-gradient-to-b from-purple-400 to-primary-500">
                      <User className="h-7 text-white" />
                    </div>
                    <div className="">
                      <div className="text-lg font-medium leading-snug">
                        Guest
                      </div>
                      <div className="text-sm text-slate-500">
                        {user.shortName}
                      </div>
                    </div>
                  </div>
                  <p>{t("app:guestSessionNotice")}</p>
                  <div>
                    <a
                      href="https://support.rallly.co/guest-sessions"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("app:guestSessionReadMore")}
                    </a>
                  </div>
                </div>
              ),
              overlayClosable: true,
              footer: null,
            });
          }}
        />
      ) : null}
      {!user.isGuest ? (
        <DropdownItem
          href="/profile"
          icon={User}
          label={t("app:yourProfile")}
        />
      ) : null}
      {user.isGuest ? (
        <DropdownItem
          icon={Login}
          label={t("app:login")}
          onClick={openLoginModal}
        />
      ) : null}
      <DropdownItem
        icon={Logout}
        label={user.isGuest ? t("app:forgetMe") : t("app:logout")}
        onClick={() => {
          if (user?.isGuest) {
            modalContext.render({
              title: t("app:areYouSure"),
              description: t("app:endingGuestSessionNotice"),

              onOk: logout,
              okButtonProps: {
                type: "danger",
              },
              okText: t("app:endSession"),
              cancelText: t("app:cancel"),
            });
          } else {
            logout();
          }
        }}
      />
    </Dropdown>
  );
};

const StandardLayout: React.VoidFunctionComponent<{
  children?: React.ReactNode;
}> = ({ children, ...rest }) => {
  const { user, isUpdating } = useUser();
  const { t } = useTranslation(["common", "app"]);

  return (
    <ModalProvider>
      <DayjsProvider>
        <div
          className="relative flex min-h-full flex-col bg-gray-50 lg:flex-row"
          {...rest}
        >
          <MobileNavigation />
          <div className="hidden grow px-4 pt-6 pb-5 lg:block">
            <div className="sticky top-6 float-right w-48 items-start">
              <div className="mb-8 px-3">
                <HomeLink />
              </div>
              <div className="mb-4">
                <Link
                  href="/new"
                  className="group mb-1 flex items-center space-x-3 whitespace-nowrap rounded-md px-3 py-1 font-medium text-slate-600 transition-colors hover:bg-slate-500/10 hover:text-slate-600 hover:no-underline active:bg-slate-500/20"
                >
                  <Pencil className="h-5 opacity-75 group-hover:text-primary-500 group-hover:opacity-100" />
                  <span className="grow text-left">{t("app:newPoll")}</span>
                </Link>
                <a
                  target="_blank"
                  href="https://support.rallly.co"
                  className="group mb-1 flex items-center space-x-3 whitespace-nowrap rounded-md px-3 py-1 font-medium text-slate-600 transition-colors hover:bg-slate-500/10 hover:text-slate-600 hover:no-underline active:bg-slate-500/20"
                  rel="noreferrer"
                >
                  <Support className="h-5 opacity-75 group-hover:text-primary-500 group-hover:opacity-100" />
                  <span className="grow text-left">{t("common:support")}</span>
                </a>
                <Popover
                  placement="right-start"
                  trigger={
                    <button className="group flex w-full items-center space-x-3 whitespace-nowrap rounded-md px-3 py-1 font-medium text-slate-600 transition-colors hover:bg-slate-500/10 hover:text-slate-600 hover:no-underline active:bg-slate-500/20">
                      <Adjustments className="h-5 opacity-75 group-hover:text-primary-500 group-hover:opacity-100" />
                      <span className="grow text-left">
                        {t("app:preferences")}
                      </span>
                      <DotsVertical className="h-4 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  }
                >
                  <Preferences />
                </Popover>
                {user ? null : (
                  <LoginLink className="group flex w-full items-center space-x-3 whitespace-nowrap rounded-md px-3 py-1 font-medium text-slate-600 transition-colors hover:bg-slate-500/10 hover:text-slate-600 hover:no-underline active:bg-slate-500/20">
                    <Login className="h-5 opacity-75 group-hover:text-primary-500 group-hover:opacity-100" />
                    <span className="grow text-left">{t("app:login")}</span>
                  </LoginLink>
                )}
              </div>
              <AnimatePresence initial={false}>
                {user ? (
                  <UserDropdown
                    className="mb-4 w-full"
                    placement="bottom-end"
                    trigger={
                      <motion.button
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{
                          x: -20,
                          opacity: 0,
                          transition: { duration: 0.2 },
                        }}
                        className="group w-full rounded-lg p-2 px-3 text-left text-inherit transition-colors hover:bg-slate-500/10 active:bg-slate-500/20"
                      >
                        <div className="flex w-full items-center space-x-3">
                          <div className="relative">
                            {isUpdating ? (
                              <Spinner className="h-5 animate-spin" />
                            ) : (
                              <UserCircle className="h-5 opacity-75 group-hover:text-primary-500 group-hover:opacity-100" />
                            )}
                          </div>
                          <div className="grow overflow-hidden">
                            <div className="truncate font-medium leading-snug text-slate-600">
                              {user.shortName}
                            </div>
                            <div className="truncate text-xs text-slate-500">
                              {user.isGuest ? t("app:guest") : t("app:user")}
                            </div>
                          </div>
                          <DotsVertical className="h-4 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                      </motion.button>
                    }
                  />
                ) : null}
              </AnimatePresence>
            </div>
          </div>
          <div className="min-w-0 grow">
            <div className="max-w-full pt-12 md:w-[1024px] lg:min-h-[calc(100vh-64px)] lg:pt-0">
              {children}
            </div>
            <div className="flex flex-col items-center space-y-4 px-6 pt-3 pb-6 text-slate-400 lg:h-16 lg:flex-row lg:space-y-0 lg:space-x-6 lg:py-0 lg:px-8 lg:pb-3">
              <div>
                <Link
                  href="https://rallly.co"
                  className="text-sm text-slate-400 transition-colors hover:text-primary-500 hover:no-underline"
                >
                  <Logo className="h-5" />
                </Link>
              </div>
              <div className="hidden text-slate-300 lg:block">&bull;</div>
              <div className="flex items-center justify-center space-x-6 md:justify-start">
                <a
                  target="_blank"
                  href="https://support.rallly.co"
                  className="text-sm text-slate-400 transition-colors hover:text-primary-500 hover:no-underline"
                  rel="noreferrer"
                >
                  {t("common:support")}
                </a>
                <Link
                  href="https://github.com/lukevella/rallly/discussions"
                  className="text-sm text-slate-400 transition-colors hover:text-primary-500 hover:no-underline"
                >
                  {t("common:discussions")}
                </Link>
                <Link
                  href="https://blog.rallly.co"
                  className="text-sm text-slate-400 transition-colors hover:text-primary-500 hover:no-underline"
                >
                  {t("common:blog")}
                </Link>
                <div className="hidden text-slate-300 lg:block">&bull;</div>
                <div className="flex items-center space-x-6">
                  <a
                    href="https://twitter.com/ralllyco"
                    className="text-sm text-slate-400 transition-colors hover:text-primary-500 hover:no-underline"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href="https://github.com/lukevella/rallly"
                    className="text-sm text-slate-400 transition-colors hover:text-primary-500 hover:no-underline"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href="https://discord.gg/uzg4ZcHbuM"
                    className="text-sm text-slate-400 transition-colors hover:text-primary-500 hover:no-underline"
                  >
                    <Discord className="h-5 w-5" />
                  </a>
                </div>
              </div>
              <div className="hidden text-slate-300 lg:block">&bull;</div>
              <a
                href="https://www.paypal.com/donate/?hosted_button_id=7QXP2CUBLY88E"
                className="inline-flex h-8 items-center rounded-full bg-slate-100 pl-2 pr-3 text-sm text-slate-400 transition-colors hover:bg-primary-500 hover:text-white hover:no-underline focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 active:bg-primary-600"
              >
                <Cash className="mr-1 inline-block w-5" />
                <span>{t("app:donate")}</span>
              </a>
            </div>
          </div>
        </div>
      </DayjsProvider>
    </ModalProvider>
  );
};

export default StandardLayout;