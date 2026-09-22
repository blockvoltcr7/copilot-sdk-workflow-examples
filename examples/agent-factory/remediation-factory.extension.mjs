import { defineFactory, joinSession } from "@github/copilot-sdk/extension";

const analyzeIssue = defineFactory({
    meta: {
        name: "analyze-issue",
        description:
            'Analyze one issue from independent implementation and testing perspectives. Args: { "issue": string }.',
        phases: [
            { title: "Analyze", detail: "Run independent issue analyses." },
            { title: "Synthesize", detail: "Combine the evidence." },
        ],
        argsSchema: {
            type: "object",
            required: ["issue"],
            properties: { issue: { type: "string" } },
        },
        limits: {
            maxTotalSubagents: 3,
            maxConcurrentSubagents: 2,
        },
    },
    run: async (ctx) => {
        const issue = ctx.args?.issue;
        if (typeof issue !== "string" || issue.trim().length === 0) {
            throw new Error('The factory requires a non-empty "issue" string.');
        }

        ctx.phase("Analyze");
        const [implementation, testing] = await ctx.parallel([
            () =>
                ctx.agent(`Analyze this issue from an implementation perspective:\n${issue}`, {
                    label: "implementation-analysis",
                }),
            () =>
                ctx.agent(`Analyze this issue from a testing and risk perspective:\n${issue}`, {
                    label: "testing-analysis",
                }),
        ]);

        ctx.phase("Synthesize");
        const synthesis = await ctx.agent(
            [
                "Synthesize these issue analyses into a concise implementation recommendation.",
                `Implementation: ${implementation ?? "No result"}`,
                `Testing: ${testing ?? "No result"}`,
            ].join("\n"),
            { label: "synthesis" },
        );

        return { implementation, testing, synthesis };
    },
});

await joinSession({ factories: [analyzeIssue] });
