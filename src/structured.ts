import type { AssistantMessageEvent } from "@github/copilot-sdk";
import type { ZodType } from "zod";

function stripMarkdownFence(content: string): string {
    const trimmed = content.trim();
    const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    return fenced?.[1] ?? trimmed;
}

export function parseAssistantJson<T>(
    response: AssistantMessageEvent | undefined,
    schema: ZodType<T>,
): T {
    if (!response) {
        throw new Error("Copilot completed without an assistant message.");
    }

    const json = JSON.parse(stripMarkdownFence(response.data.content)) as unknown;
    return schema.parse(json);
}
