import { trpc } from "@rallly/backend";
import { withSessionSsr } from "@rallly/backend/next";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Trans, useTranslation } from "next-i18next";
import { useMount } from "react-use";

import { AuthLayout } from "@/components/layouts/auth-layout";
import { Spinner } from "@/components/spinner";
import { withSession } from "@/components/user-provider";
import { withPageTranslations } from "@/utils/with-page-translations";

/*
SSO Login Page will ask the server to start the openid connect Authorization code flow. 
It will get the oidc provider authorization url and redirect the user to it.
*/

export const Page = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const startAuthorization = trpc.sso.startAuthorization.useMutation();

  useMount(() => {
    startAuthorization.mutate(
      {},
      {
        onSuccess: (url) => {
          setTimeout(() => {
            router.replace(url);
          }, 1000);
        },
      },
    );
  });

  return (
    <AuthLayout title={t("login")}>
      {startAuthorization.isLoading || startAuthorization.isSuccess ? (
        <div className="flex items-center gap-4">
          <Spinner />
          <Trans i18nKey="loading" />
        </div>
      ) : (
        <div>
          Failed to redirect to authorization page.
        </div>
      )}
    </AuthLayout>
  );
};

export default withSession(Page);

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  withPageTranslations(),
);
