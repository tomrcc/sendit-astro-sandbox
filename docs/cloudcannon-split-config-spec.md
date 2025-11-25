# CloudCannon Split Configuration Specification

**Version:** 1.0  
**Status:** Draft (Agent Integration)  
**Last Updated:** November 2025  
**Audience:** Agentic Code Editors, Automation Systems, CloudCannon Integrators  
**Prerequisite Spec:** `cloudcannon-astro-integration-spec.md`

---

## Quick Reference Card

### At a Glance

| What                     | How                          | Example                                             |
| ------------------------ | ---------------------------- | --------------------------------------------------- |
| **Enable splitting**     | Add `*_from_glob` key        | `_inputs_from_glob: ['/.cloudcannon/*.inputs.yml']` |
| **File naming**          | `.cloudcannon.{section}.yml` | `.cloudcannon.inputs.yml`                           |
| **Merge rule (objects)** | Later overwrites earlier     | Fragment2 clobbers Fragment1 for same key           |
| **Merge rule (arrays)**  | Append in order              | All items added sequentially                        |
| **Negative glob**        | Exclude with `!`             | `!/.cloudcannon/deprecated.*`                       |
| **Requirement**          | Unified config only          | Must have root `cloudcannon.config.yml`             |

### Supported Split Keys

```yaml
_inputs_from_glob                          # Input definitions
_structures_from_glob                      # Structure definitions
  values_from_glob                         # (nested) Structure values
_snippets_from_glob                        # Snippet definitions
_snippets_imports_from_glob                # Snippet imports
_snippets_templates_from_glob              # Snippet templates
_snippets_definitions_from_glob            # Snippet definitions
_editables_from_glob                       # Editable definitions
collections_config_from_glob               # Collection configs
  schemas_from_glob                        # (nested) Collection schemas
```

### Decision: Split or Inline?

```
Size > 150 lines?           → SPLIT
Multi-team/domain?          → SPLIT
Frequent independent edits? → SPLIT
Simple < 50 lines?          → INLINE
```

### Common Patterns

```yaml
# Basic split
_inputs_from_glob:
  - '/.cloudcannon/*.cloudcannon.inputs.yml'

# Nested split
_structures_from_glob:
  - '/.cloudcannon/*.structures.yml'
# In structure file:
values_from_glob:
  - '/.cloudcannon/components/*.structure-values.yml'

# With exclusions
_inputs_from_glob:
  - '/.cloudcannon/*.inputs.yml'
  - '!/.cloudcannon/deprecated.*.yml'
```

### Validation Checklist

- [ ] Using unified config (not legacy)
- [ ] Globs relative to repo root `/`
- [ ] Fragment files valid YAML/JSON
- [ ] No `..` path traversal
- [ ] Array fragments contain objects
- [ ] Aware of overwrite behavior

### Quick Troubleshooting

| Problem        | Fix                                             |
| -------------- | ----------------------------------------------- |
| Fields missing | Check glob pattern matches files                |
| Wrong value    | Later fragment overwrote—reorder or consolidate |
| Duplicates     | Arrays append—deduplicate manually              |
| Not working    | Verify unified config, check file paths         |

---

## 1a. Configuration Types & Schema Awareness

This spec assumes projects may optionally install `@cloudcannon/configuration-types` for type safety. When the package is installed, editors and agents can rely on its published JSON Schema and TypeScript definitions without needing to embed any `# yaml-language-server: $schema=...` directive lines in configuration files.

### Why Use the Package

| Capability         | Benefit to Agents                                       |
| ------------------ | ------------------------------------------------------- |
| Type definitions   | Programmatic introspection of valid keys & value shapes |
| Enum metadata      | Dynamic suggestion of allowed icons, input types, etc.  |
| Description fields | Enriched tooltips / inline help for generated edits     |
| Change tracking    | Detect deprecations across versions to guide migrations |

### Installation (Optional but Recommended)

```bash
npm install --save-dev @cloudcannon/configuration-types
```

### Editor Integration (No Directive Needed)

Most setups can rely on automatic schema association by mapping the schema file in VS Code settings if desired. This avoids per-file comments.

```jsonc
// .vscode/settings.json (optional)
{
  "yaml.schemas": {
    "./node_modules/@cloudcannon/configuration-types/cloudcannon-config.json": [
      "cloudcannon.config.yml",
      "/.cloudcannon/*.yml",
    ],
  },
}
```

### Agent Validation Flow (Lightweight)

1. Load/parse unified `cloudcannon.config.yml`.
2. (If installed) Load types/schema from the package path.
3. Validate planned changes (unknown keys, wrong value types, invalid enums).
4. Offer corrections before writing files.
5. Apply patch; optionally revalidate merged view for split sections.

### Schema-Free Operation

If the package is not installed, agents still follow merge and split rules in this spec; type-backed validation simply becomes advisory rather than enforced.

---

## 1. Purpose

This specification defines how agentic systems ("agents") should discover, generate, modify, validate, and merge **split CloudCannon configuration** files introduced via the `_from_glob` family of keys. It provides:

- A deterministic merge algorithm
- File naming conventions and heuristics
- Decision trees for when to split vs inline
- Validation criteria and troubleshooting flows
- Safety guidelines for automated refactors

Agents must treat split config as a structured overlay system where each glob-sourced file incrementally extends or overrides unified configuration.

---

## 2. Core Concepts

| Concept               | Description                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------- | ---- | --------------------------------------- |
| Unified Configuration | Single modern `cloudcannon.config.{yml                                                                    | yaml | json}` root; required for split config. |
| Split Config          | Distributing logical sections into separate files referenced by glob keys.                                |
| Glob Key              | A root or nested key ending in `_from_glob` that lists glob patterns to import external config fragments. |
| Fragment File         | A config file whose contents are merged into the parent scope that referenced it.                         |
| Negative Glob         | Pattern starting with `!` excluding previously matched paths from the active set.                         |
| Clobber               | Overwrite of an object key by later-imported fragments.                                                   |
| Append                | Non-keyed array entries added in order of resolution.                                                     |

---

## 3. Supported Split Keys

Top-level / nested keys that may use splitting:

- `_structures_from_glob`
- `values_from_glob` (nested inside a structure definition)
- `_snippets_from_glob`
- `_snippets_imports_from_glob`
- `_snippets_templates_from_glob`
- `_snippets_definitions_from_glob`
- `_inputs_from_glob`
- `_editables_from_glob`
- `collections_config_from_glob`
- `collections_config.*.schemas_from_glob`

Not Supported (intentional): `_select_data_from_glob` (use `data_config`).

---

## 4. File Naming Conventions (Recommended)

Agents should prefer predictable patterns for better editor/IDE tooling and schema assistance.

### Preferred Patterns

```
/.cloudcannon/*.cloudcannon.inputs.yml
/.cloudcannon/*.cloudcannon.structures.yml
/.cloudcannon/*.cloudcannon.structure-values.yml
/.cloudcannon/*.cloudcannon.collections.yml
/.cloudcannon/*.cloudcannon.schemas.yml
/.cloudcannon/*.cloudcannon.snippets.yml
```

### Alternative Component-Adjacent Pattern

Place fragment next to component:

```
src/components/hero/.cloudcannon.inputs.yml
src/components/pricing/.cloudcannon.structures.yml
```

Use only if organization requires locality (e.g., large multi-team repos). Still referenced by a glob from the root config.

### Heuristic for Agents

- If modifying a single component’s inputs: create or update `.cloudcannon.inputs.yml` adjacent to component OR centralize under `/.cloudcannon/` if already used.
- If defining values for a structure list: choose `.cloudcannon.structure-values.yml` (plural) when using an **array**; `.structure-value.yml` (singular) acceptable when containing exactly one object.

---

## 5. Glob Resolution Semantics

1. Evaluate patterns in listed order.
2. For each positive pattern: collect matching files (relative to repo root `/`).
3. For each negative pattern (starting with `!`): remove matches from current set.
4. Ensure deterministic ordering by **lexicographic sort** of file paths after resolution within each pattern before merge.
5. Merge fragments sequentially; later files can clobber earlier object keys.

### Safety Rules for Agents

- Reject patterns containing `..` path traversal when auto-generating.
- Validate that each glob resolves to at least one file or warn (but do not fail generation). Provide placeholder file suggestion.

---

## 6. Merge Algorithm

### Scope

Merge occurs at the exact object (or array) that declares the `_from_glob` key.

### Object Merge (Clobber / Extend)

- For each fragment file F:
  - For each top-level key `k` in F:
    - If `k` not present in accumulator → add.
    - If `k` present → overwrite (clobber) with `F[k]`.

### Array Merge (Append)

- If the accumulator target is an array (e.g., `values`), then each fragment providing:
  - Single object → push as one item.
  - Array of objects → push all items in order.
  - Non-object primitives are invalid → agent should flag.

### Pseudocode

```ts
function mergeFragments(base, fragmentFiles, isArray) {
  const result = clone(base);
  if (isArray) {
    for (const file of fragmentFiles) {
      const data = parse(file);
      if (Array.isArray(data)) result.push(...data);
      else if (isObject(data)) result.push(data);
      else warn(file, "Invalid array fragment");
    }
    return result;
  } else {
    for (const file of fragmentFiles) {
      const data = parse(file);
      if (!isObject(data)) {
        warn(file, "Invalid object fragment");
        continue;
      }
      for (const [k, v] of Object.entries(data)) {
        result[k] = v; // clobber
      }
    }
    return result;
  }
}
```

---

## 7. Agent Decision Tree

```
START
│
├─ Is project using unified config? (cloudcannon.config.yml root)
│    ├─ NO → Do not apply split config. Suggest migration.
│    └─ YES
│
├─ Is target section large (> ~150 lines) OR multi-domain (e.g., blog + marketing)?
│    ├─ YES → Propose split.
│    └─ NO → Keep inline (avoid fragmentation overhead).
│
├─ Section type?
│    ├─ Inputs → Use _inputs_from_glob with .cloudcannon.inputs.yml files.
│    ├─ Structures → Use _structures_from_glob; optionally nested values_from_glob.
│    ├─ Collections → Use collections_config_from_glob; for schemas use schemas_from_glob.
│    ├─ Snippets → Choose from appropriate _snippets_*_from_glob.
│    └─ Editables → Use _editables_from_glob.
│
├─ Need per-component locality? (component-specific configs)
│    ├─ YES → Place fragment beside component, adjust glob.
│    └─ NO → Use central /.cloudcannon directory.
│
└─ Generate / Update globs → Validate & apply merge algorithm.
```

---

## 8. Authoring Guidelines

| Scenario                             | Recommended Action                                                                 |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| Adding new input field to large set  | Create / update a dedicated inputs fragment file.                                  |
| Reorganizing structures values       | Convert inline `values` to `values_from_glob` with plural file capturing arrays.   |
| Removing deprecated fields           | Delete key in base or fragment; ensure no duplicate definitions linger.            |
| Excluding unused values              | Add negative pattern in `values_from_glob` list (e.g., `!/.cloudcannon/unused.*`). |
| Migrating existing monolithic config | Iteratively peel off sections (start with `_inputs`, `_structures`).               |

### Minimal Split Example

```yaml
# cloudcannon.config.yml
_inputs_from_glob:
  - "/.cloudcannon/*.cloudcannon.inputs.yml"
_inputs: {}
```

### Nested Split Example (Structures → Values)

```yaml
_structures_from_glob:
  - "/.cloudcannon/*.cloudcannon.structures.yml"
```

```yaml
# /.cloudcannon/components.cloudcannon.structures.yml
components:
  id_key: _type
  values_from_glob:
    - "/.cloudcannon/components/*.cloudcannon.structure-values.yml"
    - "!/.cloudcannon/components/deprecated.*.yml"
```

---

## 9. Advanced Patterns

### Mixed Inline + Glob

You may keep critical or default items inline while appending feature-specific items via glob.

```yaml
_structures:
  banners:
    id_key: _type
    values:
      - label: Default Hero
        value: { title, image }
    values_from_glob:
      - "/.cloudcannon/banners/*.cloudcannon.structure-values.yml"
```

### Multiple Globs with Overwrite

If two globbed object fragments define the same key:

- Second fragment in list overwrites the first.
- Agents should surface a warning summarizing overwritten keys.

### Hybrid Collections & Schemas

```yaml
collections_config_from_glob:
  - "/.cloudcannon/*.cloudcannon.collections.yml"
```

Each collection file can itself contain `schemas_from_glob` for layered schema growth.

---

## 10. Validation Rules (Agent Checklist)

| Rule                     | Check                        | Action on Fail                  |
| ------------------------ | ---------------------------- | ------------------------------- |
| Unified config present   | Root file exists             | Suggest migration script.       |
| Glob patterns resolvable | `globby()` result length > 0 | Warn; create placeholder file.  |
| No traversal             | Pattern lacks `..`           | Reject modification / sanitize. |
| Fragment syntax valid    | YAML/JSON parse success      | Flag file; skip merge.          |
| Array fragments shape    | Items are objects            | Warn and skip invalid entries.  |
| Object fragment type     | Top-level is object          | Warn & skip.                    |
| Duplicate key overwrite  | Track overwritten keys       | Provide summary to user.        |

---

## 11. Agent Operations

### Adding a New Input Field via Split

1. Locate existing `_inputs_from_glob` or create if absent.
2. Choose target fragment file (create if missing): `/.cloudcannon/my-feature.cloudcannon.inputs.yml`.
3. Append new key:

```yaml
title:
  type: text
  options:
    max_length: 120
```

4. Re-run merge simulation; confirm no clobber conflicts.

### Converting Inline to Split (Refactor)

| Step | Action                                                             |
| ---- | ------------------------------------------------------------------ |
| 1    | Extract inline block to new fragment file.                         |
| 2    | Replace inline block with empty object or minimal stub.            |
| 3    | Insert corresponding `_from_glob` key with pattern.                |
| 4    | Validate resolution & merge parity (diff old vs simulated merged). |

### Diff Strategy

Agents should produce a synthesized merged view when refactoring, comparing pre/post states to ensure semantic equivalence (except intended changes). Provide warnings for lost keys.

---

## 12. Troubleshooting Matrix

| Symptom                  | Likely Cause                            | Resolution                                                     |
| ------------------------ | --------------------------------------- | -------------------------------------------------------------- |
| Fields missing in editor | Glob pattern mismatch                   | Verify path, remove negative exclusions, ensure root-relative. |
| Unexpected field value   | Overwrite via later fragment            | Reorder glob list or consolidate key into single fragment.     |
| Array items duplicated   | Same item defined in multiple fragments | Deduplicate manually; arrays do not clobber.                   |
| Build/tooling errors     | Invalid YAML/JSON                       | Fix syntax; run parser validation.                             |
| Glob ignored             | Not unified config                      | Migrate to unified first.                                      |

---

## 13. Migration Guide (Monolith → Split)

1. **Inventory:** Classify sections by complexity (e.g., `_inputs` > 80 lines).
2. **Prioritize:** Split largest + most frequently edited first.
3. **Create Directory:** Add `/.cloudcannon/` if absent.
4. **Extract:** Move logical groups (e.g., SEO inputs) into dedicated fragment file.
5. **Insert Glob Key:** Add `_inputs_from_glob` referencing new file pattern.
6. **Validate Merge:** Generate merged representation; compare with original.
7. **Iterate:** Repeat for `_structures`, `collections_config`, `snippets`.

---

## 14. Safety & Security

| Concern              | Mitigation                                                            |
| -------------------- | --------------------------------------------------------------------- |
| Path Traversal       | Reject patterns containing `..`.                                      |
| Overwrite Ambiguity  | Provide explicit overwritten key report.                              |
| Excess Fragmentation | Warn if > 25 fragment files for a single section.                     |
| Performance          | Encourage grouping related entries instead of many single-item files. |

Agents must not auto-delete fragments; deprecation should be explicit.

---

## 15. Testing Strategy

| Test               | Description                                                        |
| ------------------ | ------------------------------------------------------------------ |
| Merge Parity       | Reconstruct flattened config then compare hashed JSON vs expected. |
| Negative Pattern   | Ensure excluded file does not appear in merged set.                |
| Overwrite Report   | Create conflicting keys; verify latest wins & log.                 |
| Array Append Order | Confirm array item order matches lexicographic file ordering.      |
| Schema Nest        | Nested `schemas_from_glob` expansion validated.                    |

### Quick Local Script (Pseudo):

```bash
node scripts/verify-cloudcannon-merge.mjs
```

Where script loads base + fragments and prints summary.

---

## 16. Reference Examples

### Single Value Structure (File as Object)

```yaml
# hero.cloudcannon.structure-value.yml
label: Hero
value:
  title:
  image:
```

### Multiple Values (File as Array)

```yaml
# marketing.cloudcannon.structure-values.yml
- label: CTA
  value: { text, url }
- label: Feature Grid
  value: { heading, items }
```

### Collections Split with Schemas

```yaml
# posts.cloudcannon.collections.yml
posts:
  path: content/posts
  icon: event
  schemas_from_glob:
    - "/.cloudcannon/posts.*.cloudcannon.schemas.yml"
```

---

## 17. Agent Output Conventions

When proposing changes:

- Summarize: "Add `_inputs_from_glob` and create 2 fragment files (seo, hero)."
- Provide diff-only or patch operations.
- Never inline entire merged config unless user requests.
- Flag potential overwrites before applying.

---

## 18. Frequently Asked Questions

| Question                                                 | Answer                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------- |
| Can front matter reference `_from_glob`?                 | No. Only root & globbed fragments.                                  |
| Can files themselves chain multiple `_from_glob` levels? | Yes (nested: e.g., structures → values_from_glob).                  |
| How do I remove a fragment?                              | Delete file and remove/adjust glob pattern; regenerate merged view. |
| Are JSON fragments supported?                            | Yes, same semantics as YAML.                                        |
| Can I mix YAML and JSON?                                 | Yes; parsing normalizes to JS objects prior to merge.               |

---

## 19. Lint Recommendations

Agents may optionally produce a lint report:

- Warn on unused fragment files not matched by any glob.
- Warn if a glob matches 0 files.
- Suggest consolidation if average fragment size < 2 keys.

---

## 20. Completion Criteria for Split Refactor

| Criterion                                                  | Met? |
| ---------------------------------------------------------- | ---- |
| Unified config unchanged except added glob keys            | ✔   |
| All previous keys preserved (unless intentionally removed) | ✔   |
| Fragment files valid parse                                 | ✔   |
| Overwrites acknowledged                                    | ✔   |
| Documentation / comments added if complex                  | ✔   |

---

## 21. Suggested Repository Structure

```
/.cloudcannon/
  seo.cloudcannon.inputs.yml
  hero.cloudcannon.inputs.yml
  components.cloudcannon.structures.yml
  components-marketing.cloudcannon.structure-values.yml
  posts.cloudcannon.collections.yml
  posts.cloudcannon.schemas.yml
cloudcannon.config.yml
```

---

## 22. Example: Full Minimal Split Config

```yaml
# cloudcannon.config.yml
_inputs_from_glob:
  - "/.cloudcannon/*.cloudcannon.inputs.yml"
_structures_from_glob:
  - "/.cloudcannon/*.cloudcannon.structures.yml"
collections_config_from_glob:
  - "/.cloudcannon/*.cloudcannon.collections.yml"
```

---

## 23. Future Considerations (Non-Speculative Use)

- Potential keyed-array overwrite semantics (not implemented) → Agents must not assume.
- Bulk schema generation strategies (outside current spec).

---

## 24. Implementation Checklist (For Agents)

- [ ] Detect unified config
- [ ] Parse base config
- [ ] Discover `_from_glob` keys
- [ ] Resolve globs (apply negatives)
- [ ] Classify fragments (object/array)
- [ ] Simulate merge & produce overwrite report
- [ ] Apply patches or create new fragment files
- [ ] Re-validate merged view
- [ ] Output concise summary

---

## 25. Conclusion

Split configuration enables scalable, maintainable CloudCannon setups. Agents following this spec can safely refactor, extend, and audit configuration while providing transparent user feedback on merge impacts.

---

**End of Specification**
