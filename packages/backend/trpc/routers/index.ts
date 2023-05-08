import { mergeRouters, router } from "../trpc";
import { auth } from "./auth";
import { feedback } from "./feedback";
import { polls } from "./polls";
import { sso } from "./sso";
import { user } from "./user";
import { whoami } from "./whoami";

export const appRouter = mergeRouters(
  router({
    whoami,
    auth,
    polls,
    user,
    feedback,
    sso,
  }),
);

export type AppRouter = typeof appRouter;
