# Agent instructions

Paperclip is required for every new task. Every developer and every coding agent must use it. No task starts outside Paperclip.

## Where work lives

- Server: `http://localhost:3100`
- Organization: **Test Organization**
- Project: **Test organization**
- Issue prefix: `TES`

Sign in and create the issue in that project before any other step.

## Required workflow

1. When a new task is requested, create a Paperclip issue in **Test Organization** → **Test organization** before writing code, opening a branch, or changing configuration.
2. Put the Paperclip identifier (`TES-…`) in the branch name, commit message, and pull request.
3. Keep status and notes on that issue. Move it to done only when the work is finished.
4. Do not track the same task in another system, and do not start from chat alone when no Paperclip issue exists.
5. A change with no Paperclip issue is not ready for review.

## Creating an issue

Use the Paperclip UI, or `POST /api/companies/b0b47240-95f7-4ace-b908-507254508593/issues` with a board API key:

```json
{
  "title": "Short task title",
  "description": "What is needed and how to tell it is done.",
  "status": "todo",
  "priority": "medium",
  "projectId": "feb5427d-1dfe-4368-8595-234272f11c16"
}
```

Set `status` to `in_progress` only when `assigneeUserId` is set. Paperclip rejects an in-progress issue with no assignee.
