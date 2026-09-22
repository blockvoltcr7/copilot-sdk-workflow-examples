import { CopilotClient } from "@github/copilot-sdk";
import {
    codeChangeResultSchema,
    validationPlanSchema,
} from "../src/contracts.js";
import { parseAssistantJson } from "../src/structured.js";

const client = new CopilotClient();

try {
    const codingSession = await client.createSession({ model: "auto" });

    const codeResponse = await codingSession.sendAndWait({
        prompt: [
            "Produce a hypothetical code-change handoff for issue 42 in owner/example.",
            "Do not modify files; this example demonstrates a structured session boundary.",
            "Return only one JSON object matching the code-change.v1 contract described in src/contracts.ts.",
        ].join("\n"),
    });

    const codeResult = parseAssistantJson(codeResponse, codeChangeResultSchema);

    await codingSession.disconnect();

    const validationSession = await client.createSession({
        model: "auto",
        enableConfigDiscovery: true,
        enableSkills: true,
    });

    try {
        const validationResponse = await validationSession.sendAndWait({
            prompt: [
                "Create a Jenkins validation plan from this validated code-change handoff.",
                "Do not start a real build in this demonstration.",
                "Return only one JSON object matching the validation-plan.v1 contract described in src/contracts.ts.",
                JSON.stringify(codeResult),
            ].join("\n"),
        });

        const validationPlan = parseAssistantJson(
            validationResponse,
            validationPlanSchema,
        );

        console.log(
            JSON.stringify(
                {
                    codeResult,
                    validationPlan,
                },
                null,
                2,
            ),
        );
    } finally {
        await validationSession.disconnect();
    }
} finally {
    await client.stop();
}
