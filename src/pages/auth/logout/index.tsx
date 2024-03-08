import { LogoutLink } from "@/pkg/hooks";
import React from "react";

function Logout(): React.JSX.Element {
  const onLogout = LogoutLink();

  React.useEffect(() => {
    onLogout();
  }, [onLogout]);

  return <div>Loading...</div>;
}

export default Logout;
