import { AxiosError } from "axios";
import { NextRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";

interface ErrorResponse {
  error?: {
    id?: string;
  };
  redirect_browser_to?: string;
}

// A small function to help us deal with errors coming from fetching a flow.
export function handleGetFlowError<S>(
  router: NextRouter,
  flowType: "login" | "registration" | "settings" | "recovery" | "verification",
  resetFlow: React.Dispatch<React.SetStateAction<S | undefined>>
) {
  return async (err: AxiosError<ErrorResponse>) => {
    switch (err.response?.data?.error?.id) {
      case "session_inactive":
        router.push("/login?return_to=" + window.location.href);
        return;
      case "session_aal2_required":
        if (err.response?.data?.redirect_browser_to) {
          const redirectTo = new URL(err.response?.data.redirect_browser_to);
          if (flowType === "settings") {
            redirectTo.searchParams.set("return_to", window.location.href);
          }
          // 2FA is enabled and enforced, but user did not perform 2fa yet!
          window.location.href = redirectTo.toString();
          return;
        }
        router.push("/login?aal=aal2&return_to=" + window.location.href);
        return;
      case "session_already_available":
        // User is already signed in, let's redirect them home!
        router.push("/");
        return;
      case "session_refresh_required":
        // We need to re-authenticate to perform this action
        if (
          typeof window !== "undefined" &&
          typeof window.location !== "undefined" &&
          typeof window.location.href === "string"
        ) {
          window.location.href = err.response?.data?.redirect_browser_to!;
        }
        return;
      case "self_service_flow_return_to_forbidden":
        // The flow expired, let's request a new one.
        toast.error("The return_to address is not allowed.");
        resetFlow(undefined);
        router.push("/" + flowType);
        return;
      case "self_service_flow_expired":
        // The flow expired, let's request a new one.
        toast.error(
          "Your interaction expired, please fill out the form again."
        );
        resetFlow(undefined);
        router.push("/" + flowType);
        return;
      case "security_csrf_violation":
        // A CSRF violation occurred. Best to just refresh the flow!
        toast.error(
          "A security violation was detected, please fill out the form again."
        );
        resetFlow(undefined);
        router.push("/" + flowType);
        return;
      case "security_identity_mismatch":
        // The requested item was intended for someone else. Let's request a new flow...
        resetFlow(undefined);
        router.push("/" + flowType);
        return;
      case "browser_location_change_required":
        // Ory Kratos asked us to point the user to this URL.
        if (
          typeof window !== "undefined" &&
          typeof window.location !== "undefined" &&
          typeof window.location.href === "string"
        ) {
          window.location.href = err.response?.data?.redirect_browser_to!;
        }
        return;
    }

    switch (err.response?.status) {
      case 410:
        // The flow expired, let's request a new one.
        resetFlow(undefined);
        router.push("/" + flowType);
        return;
    }

    // We are not able to handle the error? Return it.
    return Promise.reject(err);
  };
}

// A small function to help us deal with errors coming from initializing a flow.
export const handleFlowError = handleGetFlowError;
