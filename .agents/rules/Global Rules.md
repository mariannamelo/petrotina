---
trigger: always_on
---

# Agent execution rules for PetRotina

## Operating mode
You must operate in restricted executor mode.

## Mandatory behavior
- Always present a short and objective plan before implementing.
- Never implement before showing the plan.
- Never generate walkthroughs.
- Never generate videos.
- Never narrate tests.
- Never spend tokens on visual demonstrations, QA theater, or navigation storytelling.
- Manual navigation testing will be done by the user.
- Your responsibility is to:
  - plan
  - implement
  - validate the code technically
  - review code health before finishing

## Scope control
- Do not invent extra scope.
- Do not refactor outside the requested scope unless there is a real technical need.
- Do not add polish, visual refinement, or extra features unless explicitly requested.
- Do not create alternative “more complete” solutions without being asked.
- Resolve only the requested problem.
- Do not use a small task as an excuse to improve unrelated areas.

## UI and component rules
- The official UI base is shadcn.
- Do not use AEVO-DS under any circumstance.
- Do not use imports, aliases, tokens, patterns, or components inherited from AEVO-DS.
- Always reuse existing project components before creating anything new.
- Do not implement UI components manually if there is an equivalent in shadcn.
- If a required component is missing, install or add it from the configured shadcn library.
- Exception: manual implementation is allowed for the time-picker, because there is no native shadcn component for it.
- If the current time-picker contains AEVO inheritance, clean it and align it with the shadcn-based project structure.

## Project context rules
- This project is PetRotina.
- Current focus is structure, UX, and minimum functional UI.
- Do not spend effort on visual refinement right now.
- There is no backend at this stage.
- Do not implement month view unless explicitly requested.
- Do not add drag and drop unless explicitly requested.
- Do not add resize interactions unless explicitly requested.

## Agenda rules
- Petshop agenda and creche/hotelzinho agenda do not follow the same logic.
- Petshop agenda is time-based.
- Creche/hotelzinho operation is presence- and capacity-based.
- Do not unify those two agenda models as if they were the same.

## Conflict rules for petshop agenda
- Block if the same pet has overlapping time on the same day.
- Block if the same responsible person has overlapping time on the same day.
- Allow same time for different pets with different responsible people.
- Validate conflicts by time interval overlap, not just by identical start time.
- When editing an existing item, do not compare the item against itself.

## Creche and hotelzinho rules
- Do not apply the same time-overlap blocking logic used in petshop.
- Future logic must be based on operational capacity.
- Examples of future rules:
  - daily animal limit
  - animal limit per group
  - animal limit per group plus responsible person
- These rules belong to operational settings, not to the petshop calendar logic.

## Planning rules
- Every task must begin with a short and objective plan.
- The plan must be strictly limited to the current request.
- The plan must describe only what is necessary to execute safely.
- If the user asks for a plan review first, do not implement anything before that review.
- If a returned plan is broad, risky, or goes beyond scope, reduce it before execution.

## Validation rules
- Before finishing, always:
  1. validate the changed code
  2. check for obvious issues in imports, state, rendering, flow, typing, and component usage
  3. refine the implementation to keep the code healthy and consistent
  4. avoid unnecessary duplication
- Do not create visual QA artifacts.
- Do not create narrated validation outputs.
- Do not generate videos or walkthroughs as proof of work.
- The user will test navigation manually.

## Final response format
Your final response must contain only these 4 sections:
1. Changes made
2. Files changed
3. How to validate manually
4. Technical refinements

## Forbidden output
- walkthroughs
- videos
- navigation narratives
- extra suggestions not requested
- demonstrations
- long visual testing reports
- “bonus” improvements outside scope

## AEVO cleanup rule
- When auditing or cleaning the platform, do not replace everything at once.
- First audit and classify findings into:
  - confirmed AEVO dependency
  - probable local customization
  - needs validation before removal
- Do not reset global CSS broadly without confirming what is truly AEVO inheritance.
- Do not replace all UI components in one single pass.
- Prefer incremental cleanup in small groups.
- Base replacement must always move toward shadcn.