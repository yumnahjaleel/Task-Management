import { parse, addDays, format, isValid } from "date-fns";

export interface ParsedTask {
  title: string;
  dueDate: string | null;
}

/**
 * A simple NLP parser for task inputs.
 * Example: "Finish DBMS notes tomorrow 5pm"
 * Detects: "tomorrow", "today", "in X days"
 */
export const taskParser = {
  parse: (input: string): ParsedTask => {
    let title = input;
    let dueDate: Date | null = null;
    const now = new Date();

    // Match "tomorrow"
    if (input.toLowerCase().includes("tomorrow")) {
      dueDate = addDays(now, 1);
      title = title.replace(/tomorrow/i, "").trim();
    }
    // Match "today"
    else if (input.toLowerCase().includes("today")) {
      dueDate = now;
      title = title.replace(/today/i, "").trim();
    }
    // Match specific day patterns could be added here
    
    // Clean up title (remove double spaces)
    title = title.replace(/\s+/g, " ");

    return {
      title,
      dueDate: dueDate ? dueDate.toISOString() : null,
    };
  },
};
