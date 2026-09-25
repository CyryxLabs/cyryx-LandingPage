import { describe, expect, test } from "bun:test";
import { toBriefDraft } from "../src/lib/brief-assist-draft";

describe("toBriefDraft", () => {
  test("coerces list-shaped text fields a model may return", () => {
    const { draft, dropped } = toBriefDraft({
      projectName: "Shift planner",
      users: [
        {
          name: "Clinic manager",
          description: "Runs a clinic",
          needs: ["Publish shifts", "See gaps"],
        },
      ],
      goals: "Cut scheduling time\n- Fewer gaps",
      features: [
        { title: "Publish shifts", description: "Managers publish the week", priority: "must" },
      ],
      integrations: [{ system: "Payroll", purpose: "Export hours", direction: "WRITE" }],
      openQuestions: ["Which payroll system?", "How many staff?"],
    });
    expect(dropped).toEqual([]);
    expect(draft.users).toEqual([
      { name: "Clinic manager", description: "Runs a clinic", needs: "Publish shifts\nSee gaps" },
    ]);
    expect(draft.goals).toEqual(["Cut scheduling time", "Fewer gaps"]);
    expect((draft.features as { priority: string }[])[0]!.priority).toBe("Must");
    expect((draft.integrations as { direction: string }[])[0]!.direction).toBe("write");
    expect(draft.openQuestions).toBe("Which payroll system?\nHow many staff?");
  });

  test("keeps the valid keys when one key cannot be repaired", () => {
    const { draft, dropped } = toBriefDraft({
      summary: "A scheduling app",
      users: "not a list",
      unknownKey: 1,
    });
    expect(draft).toEqual({ summary: "A scheduling app" });
    expect(dropped).toEqual(["users"]);
  });

  test("rejects a non-object answer", () => {
    expect(toBriefDraft(["x"]).draft).toEqual({});
    expect(toBriefDraft(null).dropped).toEqual(["(root)"]);
  });
});
