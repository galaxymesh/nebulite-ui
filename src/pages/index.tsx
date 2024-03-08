import Head from "next/head";
import { Inter } from "next/font/google";
import React from "react";
import { useRouter } from "next/router";
import { ory } from "@/pkg/sdk";
import { AxiosError } from "axios";
import logger from "@/pkg/logger";
import { MarginCard } from "@/pkg/styled";
import { styled } from "@mui/material/styles";
import cn from "classnames";
import { LogoutLink } from "@/pkg/hooks";
import Card from "@/pkg/styled/components/Card";
import { Container } from "@mui/material";

export interface LinkButtonStyles {
  big?: boolean;
  disabled?: boolean;
}

export interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    LinkButtonStyles {
  helper?: React.ReactNode;
  children: string;
}

const LinkButton = ({ helper, className, ...props }: LinkButtonProps) => (
  <div className={className}>
    <a
      onClick={(e) => {
        if (props.disabled) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
      aria-disabled={props.disabled}
      className={cn("linkButton", { disabled: props.disabled })}
      {...props}
    />
    {helper && <span className="linkButton-helper">{helper}</span>}
  </div>
);

export const TextLeftButton = styled(LinkButton)`
  box-sizing: border-box;

  & .linkButton {
    box-sizing: border-box;
  }

  & a {
    &:hover,
    &,
    &:active,
    &:focus,
    &:visited {
      text-align: left;
    }
  }
`;

export interface DocsButtonProps {
  title: string;
  href?: string;
  onClick?: () => void;
  testid: string;
  disabled?: boolean;
  unresponsive?: boolean;
}

export const DocsButton = ({
  title,
  href,
  onClick,
  testid,
  disabled,
  unresponsive,
}: DocsButtonProps) => (
  <div className={cn("col-xs-4", { "col-md-12": !unresponsive })}>
    <div className="box">
      <TextLeftButton
        onClick={onClick}
        disabled={disabled}
        data-testid={testid}
        href={href}
      >
        {title}
      </TextLeftButton>
    </div>
  </div>
);

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [session, setSession] = React.useState<string>(
    "No valid Ory Session was found.\nPlease sign in to receive one."
  );
  const [hasSession, setHasSession] = React.useState<boolean>(false);
  const onLogout = LogoutLink();

  const router = useRouter();

  React.useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        setSession(JSON.stringify(data, null, 2));
        setHasSession(true);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 403:
          // This is a legacy error code thrown. See code 422 for
          // more details.
          case 422:
            // This status code is returned when we are trying to
            // validate a session which has not yet completed
            // its second factor
            return router.push("/auth/login?aal=aal2");
          case 401:
            // do nothing, the user is not logged in
            return;
        }

        // Something else happened!
        return Promise.reject(err);
      });
  }, [router]);

  logger.info("session?:", session);

  return (
    <Container>
      <Head>
        <title>Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>

      <MarginCard wide>
        <h1>Welcome to Ory!</h1>
        <p>
          Welcome to the Ory Managed UI. This UI implements a run-of-the-mill
          user interface for all self-service flows (login, registration,
          recovery, verification, settings). The purpose of this UI is to help
          you get started quickly. In the long run, you probably want to
          implement your own custom user interface.
        </p>
        <div className="row">
          <div className="col-md-4 col-xs-12">
            <div className="box">
              <h3>Documentation</h3>
              <p>
                Here are some useful documentation pieces that help you get
                started.
              </p>
              <div className="row">
                <DocsButton
                  title="Get Started"
                  href="https://www.ory.sh/docs/get-started"
                  testid="get-started"
                />
                <DocsButton
                  title="User Flows"
                  href="https://www.ory.sh/docs/concepts/self-service"
                  testid="user-flows"
                />
                <DocsButton
                  title="Identities"
                  href="https://www.ory.sh/docs/concepts/identity"
                  testid="identities"
                />
                <DocsButton
                  title="Sessions"
                  href="https://www.ory.sh/docs/concepts/session"
                  testid="sessions"
                />
                <DocsButton
                  title="Bring Your Own UI"
                  href="https://www.ory.sh/docs/guides/bring-your-user-interface"
                  testid="customize-ui"
                />
              </div>
            </div>
          </div>
          <div className="col-md-8 col-xs-12">
            <div className="box">
              <h3>Session Information</h3>
              <p>
                Below you will find the decoded Ory Session if you are logged
                in.
              </p>
              <code data-testid="session-content">{session}</code>
            </div>
          </div>
        </div>
      </MarginCard>

      <Card wide>
        <h2>Other User Interface Screens</h2>
        <div className={"row"}>
          <DocsButton
            unresponsive
            testid="login"
            href="/auth/login"
            disabled={hasSession}
            title={"Login"}
          />
          <DocsButton
            unresponsive
            testid="sign-up"
            href="/auth/registration"
            disabled={hasSession}
            title={"Sign Up"}
          />
          <DocsButton
            unresponsive
            testid="recover-account"
            href="/auth/recovery"
            disabled={hasSession}
            title="Recover Account"
          />
          <DocsButton
            unresponsive
            testid="verify-account"
            href="/auth/verification"
            title="Verify Account"
          />
          <DocsButton
            unresponsive
            testid="account-settings"
            href="/settings"
            disabled={!hasSession}
            title={"Account Settings"}
          />
          <DocsButton
            unresponsive
            testid="logout"
            onClick={onLogout}
            disabled={!hasSession}
            title={"Logout"}
          />
        </div>
      </Card>
    </Container>
  );
}
