// Three runs of Promptify's own workflow (AIPromptify.optimizePrompt in the project's backend), recorded on 2026-11-16
// with GPT-4o Mini as the target model. Every value is what the backend returned; nothing is edited.
// has: which of Task, Objective, Output, Nuance the analysis found in the original prompt.
// Costs are the backend's estimate in US dollars for one prompt on the target model, before and after the rewrite.

export const TARGET_MODEL = "GPT-4o Mini";

export const runs = [
  {
    title: "Git question",
    prompt: "look if I have some spelling error \"coversation.txt\" and i kept \"conversation.txt\" in gitignore and got pushed to git hub, I changed the file name locally ( hence ignored now). What command of git should I give to delete it without using git add . as it adds new files which I dont want",
    seconds: 6.8,
    taskType: "technical",
    complexity: "medium",
    tokens: 97,
    toonReadiness: 70,
    has: [true, true, false, true],
    optimized: "What Git command should I use to delete the file 'coversation.txt' from my repository on GitHub, considering it was pushed despite being in .gitignore, and I want to avoid using 'git add .' to prevent adding new files?",
    costBefore: 0.00001455,
    costAfter: 0.000008174999999999999,
    saved: 44
  },
  {
    title: "Blog post",
    prompt: "write a blog post about why small shops should use ai cameras for billing, make it good and not too long",
    seconds: 6.8,
    taskType: "creative",
    complexity: "medium",
    tokens: 30,
    toonReadiness: 70,
    has: [true, true, true, false],
    optimized: "Write a concise and engaging blog post explaining the benefits of AI cameras for billing in small shops, keeping it under 500 words and maintaining an informative yet approachable tone.",
    costBefore: 0.000004499999999999999,
    costAfter: 0.000006937499999999999,
    saved: 0
  },
  {
    title: "Sales data",
    prompt: "i have a csv of last year's sales with date, product, quantity and price columns, can you tell me which products are doing badly and what i should do about it",
    seconds: 5.7,
    taskType: "analytical",
    complexity: "medium",
    tokens: 36,
    toonReadiness: 70,
    has: [true, true, true, false],
    optimized: "Analyze the provided CSV file of last year's sales data to identify underperforming products. Determine which products have low sales performance and suggest actionable strategies for improvement. Provide a summary report listing the poorly performing products along with recommended actions to boost their sales, using a clear and professional tone.",
    costBefore: 0.000005399999999999999,
    costAfter: 0.000013124999999999999,
    saved: 0
  }
];
