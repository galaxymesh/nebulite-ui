import logger from "@/pkg/logger";
import { ory } from "@/pkg/sdk";
import { ActionCard, MarginCard } from "@/pkg/styled";
import { Flow } from "@/pkg/ui/Flow";
import { UpdateVerificationFlowBody, VerificationFlow } from "@ory/client";
import { AxiosError, AxiosResponse } from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

function Verification(): React.JSX.Element {
  const [flow, setFlow] = React.useState<VerificationFlow>();

  const router = useRouter();

  const flowId = String(router.query.flow || "");
  const returnTo = String(router.query.return_to || "");

  const handleError = React.useCallback(() => {}, []);

  const getFlow = React.useCallback(
    (id: string) =>
      ory
        .getVerificationFlow({ id })
        .then(({ data }) => setFlow(data))
        .catch(handleError),
    [handleError]
  );

  const createFlow = React.useCallback(
    (returnTo: string) =>
      ory
        .createBrowserVerificationFlow({
          returnTo,
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

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      getFlow(flowId).catch(() => createFlow(returnTo)); // the flow might be expired, so we create a new one
      return;
    }

    // Otherwise we initialize it
    createFlow(returnTo);
  }, [createFlow, flowId, getFlow, returnTo, router.isReady]);

  const onSubmit = async (values: UpdateVerificationFlowBody) => {
    await router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // their data when they reload the page.
      .push(`/auth/verification?flow=${flow?.id}`, undefined, { shallow: true });

    ory
      .updateVerificationFlow({
        flow: String(flow?.id),
        updateVerificationFlowBody: values,
      })
      .then((response: AxiosResponse<VerificationFlow>) => {
        // Form submission was successful, show the message to the user!
        setFlow(response.data);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 400:
            // Status code 400 implies the form validation had an error
            setFlow(err.response?.data as VerificationFlow);
            return;
          case 410:
            const newFlowID = (err.response?.data as { use_flow_id: string })
              .use_flow_id;
            router
              // On submission, add the flow ID to the URL but do not navigate. This prevents the user losing
              // their data when they reload the page.
              .push(`/auth/verification?flow=${newFlowID}`, undefined, {
                shallow: true,
              });

            ory
              .getVerificationFlow({ id: newFlowID })
              .then(({ data }) => setFlow(data));
            return;
        }

        throw err;
      });
  };

  logger.info("verification() - flow?:", flow);

  return (
    <React.Fragment>
      <Head>
        <title>Verify your account - Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <MarginCard>
        <h1>Verify your account</h1>
        <Flow onSubmit={onSubmit} flow={flow} />
      </MarginCard>
      <ActionCard>
        <Link href="/" passHref legacyBehavior>
          <a>Go back</a>
        </Link>
      </ActionCard>
    </React.Fragment>
  );
}

export default function VerificationPage(): React.JSX.Element {
  return <Verification />;
}
