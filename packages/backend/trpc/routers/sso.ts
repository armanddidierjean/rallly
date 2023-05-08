import { prisma } from "@rallly/database";
import { TRPCError } from "@trpc/server";
import { Issuer } from "openid-client";
import z from "zod";

import { publicProcedure, router } from "../trpc";

function getRedirectUri() {
  return new URL(
    "auth/sso_callback",
    process.env.NEXT_PUBLIC_BASE_URL,
  ).toString();
}

async function getClient() {
  if (
    !process.env.OIDC_DISCOVERY_URL ||
    !process.env.OIDC_CLIENT_ID ||
    !process.env.OIDC_CLIENT_SECRET
  ) {
    // Configuration is incomplet
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An oidc environnement variable is missing.",
    });
  }
  const issuer = await Issuer.discover(process.env.OIDC_DISCOVERY_URL);

  const client = new issuer.Client({
    client_id: process.env.OIDC_CLIENT_ID,
    client_secret: process.env.OIDC_CLIENT_SECRET,
    response_types: ["code"],
  });

  return client;
}

export const sso = router({
  startAuthorization: publicProcedure
    .input(z.object({}))
    .mutation(async () => {
      const client = await getClient();

	  // TODO: generate a random nonce and state
      // const nonce = generators.nonce();
      // state
      return client.authorizationUrl({
        redirect_uri: getRedirectUri(),
        state: "",
		nonce: "",
      });
    }),
  callback: publicProcedure
    .input(z.object({ path: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const client = await getClient();

      const params = client.callbackParams(input.path);

      const tokenSet = await client.callback(getRedirectUri(), params, {
        state: "",
        nonce: "",
      });

      if (!tokenSet.access_token) {
        // Configuration is uncomplet
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Did not any access token from the oidc provider.",
        });
      }

      const data = await client.userinfo(tokenSet.access_token);

	  // Currently we require the userinfo endpoint to return an email and a name attributes
      if (!data.email || !data.name) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Did not get a name and an email from the oidc provider",
        });
      }

      let user = await prisma.user.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
        },
        where: {
          email: data.email,
        },
      });

	  // If the user does not exist, we create it
      if (!user) {
        user = await prisma.user.create({
          select: { id: true, name: true, email: true },
          data: {
            name: data.name,
            email: data.email,
          },
        });
      }

      /*
	  if (ctx.session.user?.isGuest) {
		await mergeGuestsIntoUser(user.id, [ctx.session.user.id]);
	  }
	  */

      ctx.session.user = {
        isGuest: false,
        id: user.id,
      };

      await ctx.session.save();

      return { ok: true, user };
    }),
});
