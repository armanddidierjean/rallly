import { trpc } from "@rallly/backend";
import { withSessionSsr } from "@rallly/backend/next";
import { CheckCircleIcon } from "@rallly/icons";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Trans, useTranslation } from "next-i18next";
import { useMount } from "react-use";

import { AuthLayout } from "@/components/layouts/auth-layout";
import { Spinner } from "@/components/spinner";
import { withSession } from "@/components/user-provider";
import { withPageTranslations } from "@/utils/with-page-translations";

const defaultRedirectPath = "/profile";

/*
After doing the authorization process on the oidc serveur, the user is redirected to this page.
It will ask the server to finish the authentification.
*/

export const Page = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const current_url = router.asPath;
  const callback = trpc.sso.callback.useMutation();

  useMount(() => {
    callback.mutate(
      { path: current_url },
      {
        onSuccess: () => {
          setTimeout(() => {
            router.replace(defaultRedirectPath);
          }, 1000);
        },
      },
    );
  });

  return (
    <AuthLayout title={t("login")}>
      {callback.isLoading ? (
        <div className="flex items-center gap-4">
          <Spinner />
          <Trans i18nKey="loading" />
        </div>
      ) : callback.isSuccess ? (
        <div className="space-y-2">
          <div className="flex h-10 items-center justify-center gap-4">
            <CheckCircleIcon className={clsx("h-8 text-green-500")} />
          </div>
          <div className="text-slate-800">{t("loginSuccessful")}</div>
          <div className="text-sm text-slate-500">
            <Trans
              t={t}
              i18nKey="redirect"
              components={{
                a: <Link className="underline" href={defaultRedirectPath} />,
              }}
            />
          </div>
        </div>
      ) : (
        <div>
          <Trans i18nKey="expiredOrInvalidLink" />
        </div>
      )}
    </AuthLayout>
  );
};

export default withSession(Page);

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  withPageTranslations(),
);
