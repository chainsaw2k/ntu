import type { IncomingWebhook } from "@slack/webhook";
import type { LatencyTestResult } from "../tests/latency";

export const reportLatencyTestResult = async (
  result: LatencyTestResult,
  testTarget: string,
  reportTargets: { slack?: IncomingWebhook }
) => {
  // Log the median so that I can generate metrics from the logs in Grafana Cloud
  console.log(result.median);

  await reportTargets.slack?.send({
    blocks: [
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `🎯 *Target:* ${testTarget}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*ntu – latency – result*`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `*Total Requests:* ${result.requests}`,
          },
          {
            type: "mrkdwn",
            text: `*Median:* ${result.median}`,
          },
          {
            type: "mrkdwn",
            text: `*P90:* ${result.p90}`,
          },
          {
            type: "mrkdwn",
            text: `*P95:* ${result.p95}`,
          },
          {
            type: "mrkdwn",
            text: `*P99:* ${result.p99}`,
          },
        ],
      },
    ],
  });
};
