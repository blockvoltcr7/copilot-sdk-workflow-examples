import { CopilotClient } from "@github/copilot-sdk";

const client = new CopilotClient();

try {
    await client.start();
    const models = await client.listModels();

    console.table(
        models.map((model) => ({
            id: model.id,
            name: model.name,
            policy: model.policy?.state ?? "unknown",
            multiplier: model.billing?.multiplier ?? "n/a",
            maxContext: model.capabilities.limits.max_context_window_tokens,
        })),
    );
} finally {
    await client.stop();
}
