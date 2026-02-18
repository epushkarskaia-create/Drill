# Project Instruction

## 1. Objective

Build a production-ready POC web app that delivers a “wow” interactive 3D drilling rig demo for remote sales and a second guided “how to start” training tour. The POC must reduce friction between sales, decision-makers, and customer engineers by combining:

- A performant 3D rig viewer with clickable POIs (points of interest)
- Detachable / swappable 3D components to demonstrate customization (chassis, drilling unit, cabin variants)
- A technical knowledge base (uploaded docs as mock sources) accessible through an AI assistant UI
- Two guided tours:
  1) Value & advantages tour (3–5 minutes)
  2) “How to start / pre-start checks” training tour (step-by-step)

The output must preserve the core interaction patterns from the reference UI (immersive viewer + right-side info/assistant panel + POIs + menu overlay), but improve clarity, hierarchy, and presenter-friendly controls for the new B2B context.

## 2. Context

The POC is intended for:
- Remote sales meetings on laptop/tablet and for website embedding (iframe)
- Exhibition stands (touch screens, large screens)
- Customer engineers: quick answers to basic engineering questions
- Early training/onboarding: how to prepare the rig for operation (not full maintenance teardown)

Key principles:
- Wow effect over breadth: fewer features that feel premium beats many weak features.
- Fast delivery: design & build should be feasible within ~2 weeks for a POC.
- Performance: smooth interaction on typical laptops; mobile support is “nice-to-have” unless it threatens schedule.

## 3. Scope

### In scope

- Web app (desktop-first) with responsive layout to tablet; mobile as best-effort.
- 3D viewer shell with:
  - Orbit/zoom controls
  - POI markers on the rig
  - Environment switcher (Desert / Arctic)
  - Scene mode switcher (Exterior / Interior) using separate mock scenes
  - Component customization mode (swap variants for 3 modules)
- Right-side panel with:
  - Object details card for POIs (specs, images, doc links)
  - AI assistant chat UI (server-side “fake streaming” text)
  - Suggested question chips
- Guided tours:
  - Tour runner that steps through POIs with next/prev controls, progress, and auto camera focus (mock)
  - Two tour definitions (Value Tour, Start-up Tour)
- Menu overlay (like reference) with:
  - Overview, Technical Specs, Customization, Interior, How to start, Site, Contact
  - Audio controls (sound/music/voice) as UI toggles
- Embed mode:
  - Parameter `?embed=1` hides top chrome, uses tighter padding, disables “Home” nav

### Out of scope

- Real AI/LLM integration, real document parsing/RAG (use mocks).
- Real 3D engine pipeline, VR headset support (only leave extension hooks).
- Full operator training with part-by-part repair steps.
- Authentication, multi-tenant admin, content CMS.

## 4. User Roles & Permissions

1. Sales Presenter
- Can run Value Tour, jump between POIs, open specs, share link.
- Needs clear “presenter controls” (next/prev POI, reset view, fullscreen).

2. Customer Engineer
- Can explore POIs, open detailed specs, ask precise questions in assistant.
- Needs quick access to data, units, and doc references.

3. Operator Trainee
- Uses “How to start” tour.
- Needs step-by-step sequence, safety notes, clear “Do / Don’t”.

4. Content Editor (internal, optional for POC)
- Not a real UI role in POC; represent as a dev-only JSON config for POIs/tours/specs.

## 5. User Flows

### Flow A: Remote sales (v1.0)
1. Open link (web / tablet).
2. See rig in environment + “Start quick tour” CTA.
3. Presenter clicks “Start Value Tour”.
4. Tour auto-focuses POIs; presenter can:
   - Next/Prev
   - Pause/resume
   - Open details card
   - Switch environment
5. Decision-makers ask questions → assistant answers (mock) and may “jump” to a POI if matched.
6. Presenter opens Technical Specs panel and downloads PDF link (mock).

### Flow B: Self-service embed
1. User opens website embed.
2. Basic controls visible + “Explore POIs” guidance.
3. User clicks POI → details panel opens.
4. User asks assistant → response shown + suggested chips.

### Flow C: Training / virtual support (v1.1)
1. User opens “How to start use”.
2. Start-up tour begins:
   - Step list with progress
   - Each step highlights a component / interior POI
3. Safety notes are shown in relevant steps.
4. Finish screen provides quick checklist recap and doc link.

### Flow D: Customization demo
1. User selects “Customization”.
2. Viewer enters customization mode:
   - UI shows 3 module chips (Chassis, Drilling Unit, Cabin)
   - Selecting a module reveals variants carousel (2–3 variants)
3. Swapping a variant updates:
   - Viewer (mock swap)
   - Specs panel highlights what changed
4. Exit customization returns to normal exploration.

## 6. Information Architecture

### Pages / Routes

- `/` Home / Viewer (default)
- `/embed` Viewer in embed mode (or use `/?embed=1`)
- `/contact` Contact (simple page)
- `/legal` Basic legal/disclaimer (POC)

### Navigation model

- Primary experience is single-page viewer with overlays:
  - Top-left: Home
  - Top-right: Menu button
  - Right panel: Details / Assistant / Tours
  - Bottom bar: Ask input + mic button (UI only)
- Menu overlay provides jumps to modes and external links.

## 7. UI Specification (shadcn)

### Layout / Grid

Desktop (>= 1024px):
- Full-bleed 3D canvas on the left (approx 70%)
- Right panel (approx 30%) docked, resizable (optional, POC: fixed width 420–480px)
- Top bar: minimal (home + scene title + environment selector + fullscreen)
- Bottom bar: assistant input anchored, spans both areas but visually attached to right panel

Tablet (768–1023px):
- 3D canvas full width
- Right panel becomes bottom sheet (snap points: 25% / 50% / 85%)

Mobile (<768px):
- 3D canvas full width
- Right panel only as bottom sheet
- POI labels hidden by default; show on tap

### Components list (with purpose)

Use shadcn/ui components:
- `Button` (primary/secondary/ghost)
- `Card` (POI details, tour step, assistant message)
- `Sheet` (Menu overlay, mobile bottom sheet)
- `Tabs` (Right panel tabs: Details / Assistant / Tours)
- `ScrollArea` (long content inside panel)
- `Badge` (tags like “Safety”, “Spec”, “Variant”)
- `Separator` (panel sections)
- `Toggle` / `Switch` (sound/music/voice)
- `Progress` (tour progress)
- `Tooltip` (icon buttons)
- `Command` (optional quick jump to POI/search)
- `Dialog` (download docs confirm, reset view confirm)

Custom components:
- `RigViewer` (3D canvas shell; POIs rendering; camera focus mock)
- `PoiMarker` (3D overlay marker)
- `RightPanel` (tabs + content orchestration)
- `PoiDetailsCard`
- `AssistantChat`
- `TourRunner`
- `CustomizationPanel`
- `EnvironmentSwitcher`
- `SceneModeToggle` (Exterior/Interior)
- `PresenterControls` (next/prev, reset, pause)
- `EmbedBanner` (small “Open full experience” link, only in embed)

### States

Global:
- Loading: show skeleton in panel + subtle loader over viewer until mock assets “loaded”
- Error: viewer fallback with retry; panel shows error card
- Empty:
  - No POI selected → show “Select a hotspot” guidance + quick chips
  - No chat yet → show suggested questions and “Try asking …”

POI marker:
- Default, hover, active, disabled
- Active marker has stronger outline and label

Right panel:
- Collapsed (desktop optional): icon-only rail + expand button
- Expanded: normal
- Tab states: active underline + aria attributes

Tours:
- Not started, running, paused, completed
- Step states: upcoming, current, done
- Validation: cannot “Next” past last step; show completion card

Customization:
- Mode off/on
- Variant apply loading (250–500ms simulated)
- Variant diff highlight in specs

Assistant:
- Idle, generating, error
- “Generating” shows streaming dots + disables send button
- Suggested chips update based on selected POI/tour step

### Responsive rules (mobile/desktop)

- Desktop: panel docked right, viewer left.
- Tablet/mobile: panel as bottom sheet; viewer is full background.
- Keep minimum tap target 44px.
- Ensure focus ring visible on all interactive elements.

### Visual improvements over reference

- Stronger type hierarchy:
  - Scene title + rig name at top
  - POI title as H3 in details
  - Specs grouped in 2-column grid inside card
- Reduce “heavy gray” in right panel:
  - Use layered cards and more whitespace
- Clear “mode” indicator:
  - Pill showing: Explore / Tour: Value / Tour: Start-up / Customization
- Presenter-friendly:
  - Always-visible next/prev controls during tours
  - “Reset view” and “Copy link” actions in top bar overflow

## 8. Functional Requirements

### 8.1 Viewer & POIs
- The viewer must render a mock rig scene (placeholder image/canvas if 3D not implemented yet) with POI markers placed by config.
- Clicking a POI:
  - Sets it as active
  - Opens Right Panel → Details tab
  - Scrolls details to top
  - Triggers `focusCamera(poiId)` (mock)
- Next/Prev POI controls:
  - Navigate within the current set (all POIs or tour POIs depending on context)
- Environment switch (Desert/Arctic):
  - Changes background/environment label and resets camera softly
- Scene mode (Exterior/Interior):
  - Switches scene dataset and POI set
  - Preserves last-selected tab

### 8.2 Details panel
- Display:
  - Title, short description, key specs table (label/value/unit)
  - Media gallery (images list)
  - Doc links list (PDF/URL)
- “Download spec” button:
  - Opens dialog and triggers mock download (client-side file link)

### 8.3 Assistant UI (mock)
- Input supports:
  - Text send
  - Voice button toggles “listening” UI only
- On send:
  - Add user message
  - Simulate server-side response with streaming effect
  - Generate 3–5 suggested chips relevant to context
- POI deep link:
  - If message contains a POI keyword, show “Jump to component” chip; clicking selects POI.

### 8.4 Tours
- Two tours defined in config:
  - `valueTour`
  - `startupTour`
- Starting a tour:
  - Sets mode state
  - Selects first step POI and focuses camera
  - Shows progress and step list
- Controls:
  - Next/Prev step
  - Pause/Resume
  - Exit tour (confirm)
- Completion:
  - Show summary card + “Restart” + “Explore freely”

### 8.5 Customization
- Entering customization:
  - Shows module chips and variant carousel
  - Locks tour controls off (if tour running, require exit)
- Selecting module:
  - Shows variants list with images/spec diffs (mock)
- Applying variant:
  - Updates “active variant” state
  - Updates specs highlight list
  - Calls `applyVariant(moduleId, variantId)` (mock, but wired)

### 8.6 Menu overlay
- Menu includes actions:
  - Overview (select overview POI)
  - Technical specifications (select engine POI + open specs section)
  - How to start use (start startup tour)
  - Customization (enter customization mode)
  - Interior (switch to interior scene and select cabin POI)
  - Site (open external link in new tab)
  - Contact (route to /contact)
- Settings toggles:
  - Sound, Music, Voice (persist in localStorage)
- All items must have working onClick behavior.

### 8.7 Embed mode
- When `embed=1`:
  - Hide menu items: Contact, Settings (optional)
  - Reduce padding, hide “Home” button
  - Show small “Open full experience” link

## 9. Data & Mocking Plan

### Mock entities

- `Rig`
  - id, name, description
  - environments: Desert/Arctic
  - scenes: Exterior/Interior
  - modules: chassis, drillingUnit, cabin
- `POI`
  - id, scene, title, description
  - position (x,y,z) or screen anchor (mock)
  - specs: [{key,label,value,unit}]
  - media: [{type,imageUrl}]
  - docs: [{title,url}]
  - keywords: ["engine","torque","fuel"]
- `Tour`
  - id, title, durationEstimate
  - steps: [{poiId, narration, safetyTag?, checklistItems[]}]
- `Variant`
  - id, moduleId, title, summary
  - diffSpecs: [{key, from, to, unit}]
  - previewImageUrl

### Mock API / fixtures

- `/src/data/rig.ts` exports full config (rig, scenes, pois, tours, variants)
- `/src/app/api/chat/route.ts` returns mock assistant response:
  - Input: {message, context:{activePoiId, mode, language}}
  - Output: {textStreamChunks[], suggestedChips[], jumpPoiId?}
- `/src/app/api/download/route.ts` returns a mock file or redirects to public pdf

## 10. Technical Constraints

### Stack confirmation
- Next.js (App Router)
- TailwindCSS
- shadcn/ui
- Icons: @phosphor-icons/react
- State: Zustand
- Forms: React Hook Form + Zod (contact form)
- Animation: Framer Motion (panel transitions, tour step transitions)

### 3D rendering constraint (POC-friendly)
- Implement viewer as:
  - Phase 1: image-based “rig scene” with positioned POI overlays (fast, safe)
  - Phase 2: optional react-three-fiber integration (guarded behind feature flag)
- Must keep interactions responsive; avoid blocking main thread.
- Use dynamic import for heavy viewer code.

### Accessibility basics
- Keyboard navigation for menu, tabs, and buttons.
- Visible focus styles.
- ARIA labels for icon buttons and POI markers.
- Respect reduced motion preference for animations.

### Performance
- Avoid large textures; use optimized images in `/public`.
- Use `next/image` for panel media.
- Do not exceed ~2–3MB initial JS bundle target for POC; lazy load viewer extras.

## 11. Folder Structure

```
src/
  app/
    api/
      chat/route.ts
      download/route.ts
    contact/page.tsx
    legal/page.tsx
    page.tsx
    layout.tsx
  components/
    viewer/
      RigViewer.tsx
      PoiMarker.tsx
      PresenterControls.tsx
      EnvironmentSwitcher.tsx
      SceneModeToggle.tsx
      CustomizationPanel.tsx
    panel/
      RightPanel.tsx
      PoiDetailsCard.tsx
      AssistantChat.tsx
      TourRunner.tsx
      SuggestedChips.tsx
    chrome/
      TopBar.tsx
      MenuSheet.tsx
      BottomAskBar.tsx
      EmbedBanner.tsx
  data/
    rig.ts
  lib/
    utils.ts
    store/
      useAppStore.ts
  styles/
    globals.css
public/
  rigs/
    dr20/
      exterior-desert.jpg
      exterior-arctic.jpg
      interior.jpg
  docs/
    sample-spec.pdf
```

## 12. Runbook

### Install
- `pnpm i`

### Run
- `pnpm dev`

### Build
- `pnpm build`
- `pnpm start`

### Environment variables
- None required for POC.

## 13. Quality Criteria (Acceptance)

The POC is accepted if:

1. The viewer page loads with a rig scene, POI markers visible, and no dead UI.
2. Clicking any POI opens a details card with specs/media/docs and highlights the POI.
3. Menu items all work and navigate or trigger correct modes.
4. Value Tour runs end-to-end with next/prev, progress, and completion screen.
5. Start-up Tour runs end-to-end with step checklist and safety tags.
6. Customization mode allows swapping at least 3 modules with visible UI feedback.
7. Assistant chat can answer (mock) and updates suggested chips; can “jump” to a POI.
8. Embed mode works via query param and reduces chrome.
9. Desktop and tablet layouts are usable; no overflow traps; keyboard focus visible.

## 14. Edge Cases & Risks

- Heavy 3D assets may break performance; keep Phase 1 image-based viewer as fallback.
- Interior scene may be missing or low quality; ensure UI supports “Interior unavailable” gracefully.
- Technical data accuracy is mocked; avoid claiming real values unless sourced.
- Sales vs training scope creep: keep training to start-up checks only.
- Offline exhibition requirement is mentioned; POC should be deployable as static + local assets, but full offline runtime is a future extension.

## 15. Open Questions

1. Which exact drill rig model (name/version) is the primary marketing target for the POC?
2. Which specs are “must-have” for decision-makers vs engineers (top 15)?
3. Which 3 customization modules are confirmed for v1.0 (chassis/drilling unit/cabin are assumed)?
4. Required languages: English default + Russian confirmed; do we need runtime switch UI?
5. Offline mode: do we need an explicit “offline package” build for the exhibition stand?

## 16. Future Improvements

- Real RAG over PDFs (chunking + citations + doc link anchors).
- True 3D mesh viewer with component splitting and LOD.
- VR mode (WebXR) for “Rig 2.0”.
- Presenter “script” mode (auto narration, timed transitions).
- Analytics: POI clicks, tour completion, common questions.

---

# Cursor Prompt (copy-paste)

Build a Next.js (App Router) web app using shadcn/ui + Tailwind + Zustand that implements the drilling rig POC described below. Do not leave dead buttons or TODOs. Use mocked data and mocked APIs but wire all UI interactions end-to-end.

Requirements:
- Single-page immersive viewer with POI markers over a rig scene (use images as the scene background for Phase 1).
- Right-side panel with Tabs: Details / Assistant / Tours.
- Menu overlay (Sheet) with actions: Overview, Technical specifications, How to start use, Customization, Interior, Site, Contact + Settings toggles (Sound/Music/Voice).
- Two tours (Value Tour and Start-up Tour) with step-by-step runner, progress, next/prev, pause/resume, exit confirm, completion summary.
- Customization mode with module chips (Chassis, Drilling Unit, Cabin) and variant carousel; applying a variant updates state and highlights spec diffs.
- Assistant chat UI with mock streaming response from /api/chat; suggested chips; “Jump to POI” chip when relevant.
- Scene controls: Environment switcher (Desert/Arctic) and Scene mode (Exterior/Interior).
- Embed mode via query param embed=1 that hides some chrome and shows “Open full experience”.

Implementation details:
- Use folder structure exactly as in the spec (components/viewer, components/panel, components/chrome, data/rig.ts, lib/store/useAppStore.ts).
- Use Zustand store for global state: activePoiId, mode (explore/valueTour/startupTour/customize), environment, sceneMode, audio toggles, chat history, active tour step, selected variants.
- Use mock datasets in src/data/rig.ts and ensure at least 7 POIs across exterior/interior.
- Make the RigViewer render a background image based on environment+sceneMode and overlay POI markers positioned by config (use absolute positioning with percentage anchors for POC).
- All menu actions must call real handlers that update store and UI.
- Contact page must have a working form built with React Hook Form + Zod validation.

Deliverables:
- Working UI in dev mode with realistic interactions and transitions (Framer Motion).
- No broken navigation, no empty states without guidance text, no non-functional controls.
