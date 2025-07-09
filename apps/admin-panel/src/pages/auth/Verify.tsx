import Loader from "@/components/shared/loader";
import { useOAuthSignin } from "./api";
import { useEffect } from "react";

const Verify = () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const { isLoading, isError, data } = useOAuthSignin(code || "");

  useEffect(() => {
    if (data) {
      window.opener.postMessage({
        type: "oauth-success",
        data: data,
      });
      window.close();
    }
    if (!isLoading && isError) {
      window.opener.postMessage({
        type: "oauth-error",
        data: data,
      });
      window.close();
    }
  }, [isLoading, isError, data]);

  return <Loader size="md" variant="fullscreen" />;
};

export default Verify;
