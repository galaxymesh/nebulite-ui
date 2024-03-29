import { handleFlowError } from "@/pkg/errors";
import { ory } from "@/pkg/sdk";
import { ActionCard, MarginCard } from "@/pkg/styled";
import { Flow } from "@/pkg/ui/Flow";
import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client";
import { AxiosError } from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function RecoveryPage() {
  const [flow, setFlow] = React.useState<RecoveryFlow>();

  // Get ?flow=... from the URL
  const router = useRouter();
  const { flow: flowId, return_to: returnTo } = router.query;

  React.useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getRecoveryFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data);
        })
        .catch(handleFlowError(router, "recovery", setFlow));
      return;
    }

    // Otherwise we initialize it
    ory
      .createBrowserRecoveryFlow({
        returnTo: String(returnTo || ""),
      })
      .then(({ data }) => {
        setFlow(data);
      })
      .catch(handleFlowError(router, "recovery", setFlow))
      .catch((err: AxiosError) => {
        // If the previous handler did not catch the error it's most likely a form validation error
        if (err.response?.status === 400) {
          // Yup, it is!
          setFlow(err.response?.data as RecoveryFlow);
          return;
        }

        return Promise.reject(err);
      });
  }, [flowId, router, router.isReady, returnTo, flow]);

  const onSubmit = (values: UpdateRecoveryFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/auth/recovery?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .updateRecoveryFlow({
            flow: String(flow?.id),
            updateRecoveryFlowBody: values,
          })
          .then(({ data }) => {
            // Form submission was successful, show the message to the user!
            setFlow(data);
          })
          .catch(handleFlowError(router, "recovery", setFlow))
          .catch((err: AxiosError) => {
            switch (err.response?.status) {
              case 400:
                // Status code 400 implies the form validation had an error
                setFlow(err.response?.data as RecoveryFlow);
                return;
            }

            throw err;
          })
      );

  return (
    <>
      <Head>
        <title>Recover your account - Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <MarginCard>
        <h1>Recover your account</h1>
        <Flow onSubmit={onSubmit} flow={flow} />
      </MarginCard>
      <ActionCard>
        <Link href="/" passHref legacyBehavior>
          <a>Go back</a>
        </Link>
      </ActionCard>
    </>
  );
}
