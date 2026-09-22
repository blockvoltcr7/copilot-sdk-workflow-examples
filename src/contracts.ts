import { z } from "zod";

export const issueCandidateSchema = z.object({
    number: z.number().int().positive(),
    title: z.string(),
    body: z.string(),
    url: z.string().url(),
    author: z.string(),
    labels: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type IssueCandidate = z.infer<typeof issueCandidateSchema>;

export const issueTriageResultSchema = z.object({
    schemaVersion: z.literal("issue-triage.v1"),
    repository: z.string(),
    generatedAt: z.string(),
    prioritizedIssues: z.array(
        z.object({
            rank: z.number().int().positive(),
            score: z.number().min(0).max(100),
            issueNumber: z.number().int().positive(),
            title: z.string(),
            url: z.string().url(),
            updatedAt: z.string(),
            severity: z.enum(["critical", "high", "medium", "low", "unknown"]),
            readiness: z.enum(["ready", "needs-clarification", "blocked"]),
            rationale: z.array(z.string()),
            acceptanceCriteria: z.array(z.string()),
            missingInformation: z.array(z.string()),
            risks: z.array(z.string()),
        }),
    ),
    recommendedIssueNumber: z.number().int().positive().nullable(),
    recommendationReason: z.string(),
});

export type IssueTriageResult = z.infer<typeof issueTriageResultSchema>;

export const codeChangeResultSchema = z.object({
    schemaVersion: z.literal("code-change.v1"),
    outcome: z.enum(["completed", "blocked", "failed"]),
    repository: z.string(),
    issueNumber: z.number().int().positive(),
    summary: z.string(),
    filesChanged: z.array(
        z.object({
            path: z.string(),
            purpose: z.string(),
        }),
    ),
    validation: z.array(
        z.object({
            command: z.string(),
            result: z.enum(["passed", "failed", "not-run"]),
            details: z.string(),
        }),
    ),
    risks: z.array(z.string()),
});

export type CodeChangeResult = z.infer<typeof codeChangeResultSchema>;

export const validationPlanSchema = z.object({
    schemaVersion: z.literal("validation-plan.v1"),
    issueNumber: z.number().int().positive(),
    shouldStartBuild: z.boolean(),
    jobName: z.string(),
    parameters: z.record(z.string(), z.string()),
    preflightChecks: z.array(z.string()),
    explanation: z.string(),
});

export type ValidationPlan = z.infer<typeof validationPlanSchema>;
