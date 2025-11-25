# Implementation Plan - Bind Theme Selector to Data

The goal is to bind the `ThemeSelector` component to `data/theme.json` so that selecting a color updates the global theme data in CloudCannon.

## Proposed Changes

### Layout
#### [MODIFY] [Layout.astro](file:///Users/jclaasen/Projects/cloudcannon_editor_test/src/layouts/Layout.astro)
- Import `theme` from `@data/theme.json`.
- Pass `theme.primary_color` to `<ThemeEditableWrapper>`.

### Components
#### [MODIFY] [ThemeEditableWrapper.tsx](file:///Users/jclaasen/Projects/cloudcannon_editor_test/src/components/shared/ThemeEditableWrapper.tsx)
- Accept `primaryColor` prop.
- Pass it to `<ThemeSelector>`.

#### [MODIFY] [ThemeSelector.tsx](file:///Users/jclaasen/Projects/cloudcannon_editor_test/src/components/shared/ThemeSelector.tsx)
- Accept `primaryColor` prop and use it as initial state.
- Change input type to `text` to support string binding.
- Add `data-prop="@data[theme].primary_color"` to the input.

## Verification Plan
### Automated Tests
- None (Visual editing feature).

### Manual Verification
- Verify the code compiles.
- Check that the `data-prop` attribute is present on the input in the output HTML (if rendered).
