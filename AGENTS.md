# Agent Instructions

## Visual Editing Specification
When working on Astro components or content, YOU MUST FOLLOW the CloudCannon integration specification.

### Reference
- Spec file: `docs/cloudcannon-astro-integration-spec.md`

### Key Rules
1. **Always check the spec** before creating editable regions.
2. **Use the Decision Matrix** in the spec to choose between `text`, `image`, `source`, or `array`.
3. **Data Files**: Use `@data[key].prop` syntax.
4. **Content Files**:
    - General: `data-prop="key"`
    - Images: `data-prop-src="key"`
    - Body: `data-prop="@content"`
