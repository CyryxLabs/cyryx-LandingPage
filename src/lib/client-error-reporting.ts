type ClientErrorOptions = {
  mechanism?: "react_error_boundary" | "manual";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type ClientErrorReporter = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: ClientErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __cyryxErrorReporter?: ClientErrorReporter;
  }
}

export function reportClientError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const reportContext = {
    source: "react_error_boundary",
    route: window.location.pathname,
    ...context,
  };
  const reporter = window.__cyryxErrorReporter?.captureException;

  if (reporter) {
    reporter(error, reportContext, {
      mechanism: "react_error_boundary",
      handled: true,
      severity: "error",
    });
    return;
  }

  console.error("[cyryx:error]", reportContext, error);
}
