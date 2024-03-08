import { LogoutLink } from "@/pkg/hooks";
import logger from "@/pkg/logger";
import { ory } from "@/pkg/sdk";
import { ActionCard, MarginCard } from "@/pkg/styled";
import { Flow } from "@/pkg/ui/Flow";
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

function Login(): React.JSX.Element {
  const [flow, setFlow] = React.useState<LoginFlow>();

  const router = useRouter();

  const returnTo = String(router.query.return_to || "");
  const flowId = String(router.query.flow || "");

  // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
  // of a user.
  const refresh = Boolean(router.query.refresh);

  // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
  // to perform two-factor authentication/verification.
  const aal = String(router.query.aal || "");

  // This might be confusing, but we want to show the user an option
  // to sign out if they are performing two-factor authentication!
  const onLogout = LogoutLink([aal, refresh]);

  const handleError = React.useCallback(() => {}, []);

  const getFlow = React.useCallback(
    (id: string) =>
      // If ?flow=.. was in the URL, we fetch it
      ory
        .getLoginFlow({ id })
        .then(({ data }) => setFlow(data))
        .catch(handleError),
    [handleError]
  );

  const createFlow = React.useCallback(
    (refresh: boolean, aal: string, returnTo: string) =>
      ory
        .createBrowserLoginFlow({
          refresh: refresh,
          // Check for two-factor authentication
          aal: aal,
          returnTo: returnTo,
        })
        .then(({ data }) => {
          setFlow(data);
          // SetUriFlow(Router, data.id)
        })
        .catch(handleError),
    [handleError]
  );

  React.useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (flowId) {
      getFlow(flowId).catch(() => {
        createFlow(refresh, aal, returnTo);
      });
      return;
    }

    // Otherwise we initialize it
    createFlow(refresh, aal, returnTo);
  }, [aal, createFlow, flowId, getFlow, refresh, returnTo, router.isReady]);

  const onSubmit = async (values: UpdateLoginFlowBody) => {
    // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
    // his data when she/he reloads the page.
    router.push(`/login?flow=${flow?.id}`);

    ory
      .updateLoginFlow({ flow: String(flow?.id), updateLoginFlowBody: values })
      // We logged in successfully! Let's bring the user home.
      .then(() => {
        if (flow?.return_to) {
          window.location.href = flow?.return_to;
          return;
        }
        router.push("/");
      })
      .then(() => {})
      // .catch(handleFlowError(router, "login", setFlow))
      .catch((err: AxiosError) => {
        // If the previous handler did not catch the error it's most likely a form validation error
        if (err.response?.status === 400) {
          // Yup, it is!
          setFlow(err.response?.data as LoginFlow);
          return;
        }

        return Promise.reject(err);
      });
  };

  logger.info("login() - flow?:", flow);

  return (
    <React.Fragment>
      <MarginCard>
        <ActionCard>
          {(() => {
            if (flow?.refresh) {
              return "Confirm Action";
            } else if (flow?.requested_aal === "aal2") {
              return "Two-Factor Authentication";
            }
            return "Sign In";
          })()}
        </ActionCard>
        <Flow onSubmit={onSubmit} flow={flow} />
      </MarginCard>
      {aal || refresh ? (
        <ActionCard>
          <a data-testid="logout-link" onClick={onLogout}>
            Log out
          </a>
        </ActionCard>
      ) : (
        <React.Fragment>
          <ActionCard>
            <Link href="/registration" passHref legacyBehavior>
              <a>Create account</a>
            </Link>
          </ActionCard>
          <ActionCard>
            <Link href="/recovery" passHref legacyBehavior>
              <a>Recover your account</a>
            </Link>
          </ActionCard>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default function LoginPage(): React.JSX.Element {
  return <Login />;
}
