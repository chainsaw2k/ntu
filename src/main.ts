import { exit, setUncaughtExceptionCaptureCallback } from "node:process";
import env from "./lib/env";
import { createUrl, getProtocol, parseUrl } from "./lib/url";
import { reportTestResult } from "./reporting/main";
import { runTest } from "./tests/main";

setUncaughtExceptionCaptureCallback((error) => {
  console.error(error);
  exit(1);
});

const getUrlParts = () => {
  const {
    URL,
    PROTOCOL,
    USERNAME,
    PASSWORD,
    HOSTNAME,
    PORT,
    PATHNAME,
    SEARCH,
  } = env;

  if (URL) {
    return parseUrl(URL);
  }

  return {
    protocol: PROTOCOL ?? undefined,
    username: USERNAME ?? undefined,
    password: PASSWORD ?? undefined,
    hostname: HOSTNAME ?? undefined,
    port: PORT ? Number.parseInt(PORT, 10) : undefined,
    pathname: PATHNAME,
    search: SEARCH ?? "",
  };
};

const main = async () => {
  const { TEST } = env;
  const urlParts = getUrlParts();

  if (!urlParts.protocol) {
    throw new Error("Missing protocol.");
  }

  // Infinite loop so that this runs better as a Section deployment
  do {
    // eslint-disable-next-line no-await-in-loop
    const result = await runTest(TEST, {
      protocol: getProtocol(urlParts),
      target: urlParts,
      query: env.QUERY,
    });

    // eslint-disable-next-line no-await-in-loop
    await reportTestResult(result, {
      target: createUrl(urlParts),
      slackWebhook: env.SLACK_WEBHOOK,
    });
    // eslint-disable-next-line no-constant-condition
  } while (1);
};

void main();
