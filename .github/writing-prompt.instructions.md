# Guidelines for Writing Prompts

- **Clear objective**: Start by defining the prompt's objective concisely.
- **Specific requirements**: List the specific requirements you want Copilot to implement. Use \* or numbers for each requirement.
- **Concise and self-contained**: Each instruction should be a simple sentence containing complete information.
- **Multiple instructions when needed**: Use multiple instructions if you need to provide different types of information.
- **Avoid external references**: Do not refer to external resources such as specific coding standards.
- **Notes (optional)**: Add notes to provide additional information if needed.
- **Reusability**: Design prompts that can be reused for similar tasks.
- **Refinement when needed**: You can add additional instructions to refine a reusable prompt for a specific situation.
- **Attach context (optional)**: Use Markdown links to attach contextual files such as API specs or documentation.

# Sample Prompt

## Objective

Brief description of the prompt's objective, for example: Create a new React form component.

## Requirements

- Use `react-hook-form` to manage form state.
- Always define TypeScript types for form data.
- Prefer uncontrolled components with `register`.
- Use `defaultValues` to prevent unnecessary re-renders.

## Notes (optional)

- Additional notes or instructions.
