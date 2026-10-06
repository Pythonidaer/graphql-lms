# GraphQL

Course URL: https://pythonidaer.github.io/graphql-lms/

A self-paced static LMS based on the official GraphQL documentation. Includes 35 complete documentation chapters (29 Learn pages and six FAQ categories), orientation, a capstone, and a specification navigation lesson: **38 lesson decks, 442 slides, six module quizzes, and a 31-question final assessment**. The final consolidates the 31 questions from the module checks; it is a review assessment, not an independent exam.

## Curriculum

1. Orientation and learning strategy
2. Schema and operations: introduction, types, queries, mutations, subscriptions
3. Validation and execution: validation, resolvers, responses, introspection
4. API design: graph modeling, schema design, naming, errors, robust clients
5. Transport and access: HTTP, debugging, uploads, authorization, pagination, object identity
6. Operations: caching, performance, security, federation
7. Governance: ownership, tooling, review, change management
8. FAQ: getting started, general, best practices, specification, frontend, foundation
9. Capstone: design an enrollment API, then navigate the language specification

Every Learn chapter has an objective, its official source sections and code examples, an authored practice exercise, and a worked self-check. Exercises require a local implementation or written design and are self-assessed. This website does not run GraphQL operations. Examples from different documentation chapters may use different schemas.

## Scope and sources

Documentation snapshot retrieved 2026-10-06 from the official graphql/graphql.github.io repository. `source-manifest.json` maps all 35 chapters to their source URLs and lesson IDs; `THIRD_PARTY_NOTICES.md` preserves the upstream MIT license and exact source commit. Website components are removed and documentation is divided at headings. Sources remain linked in each chapter. One upstream diagram requires connectivity. Links open in a new tab.

The September 2025 specification is linked for normative reference, not reproduced in full. Current GraphQL.js tutorials are linked for implementation. Blogs, events, vendor guides and every third-party GraphQL library are outside this course.

## Run and maintain

Run `python3 -m http.server 8000` in this folder, then open http://localhost:8000. No install/build step is required. Text, examples, quizzes and Markdown rendering are packaged locally and work without a data API. Hosted access initially requires connectivity; external sources and the upstream diagram require connectivity.

Edit `course.json`, then update the JSON inside `index.html`'s `lms-course-data` script. Keep IDs stable; changed lesson content resets that lesson's saved progress. A distinct GraphQL course ID isolates it from the old Design foundations sample.

All lessons are available for reference by default. Turn off **Unlock all lessons and quizzes** in learner settings to require lesson completion before the final assessment. Passing is 80%, with retakes enabled. Reports group quiz results by skill and support CSV export. The outline collapses on every device, and the main content scrolls separately.

## Validation

Run `node tests/course.test.cjs` for schema/readiness validation, source coverage, embedded parity, fence integrity and quiz answer checks.

For DOM integration checks, install `jsdom` in your development environment and run `node tests/dom.test.cjs`. These verify all 442 slides, Markdown safety, completion, quiz grading, reports, final gating and persistence without a layout engine.

For browser checks, install Playwright and its Chromium browser in your development environment, start the server, and run `node tests/browser.test.cjs`. Set `LMS_TEST_URL` to test another URL. It covers 390/768/1440px layouts, outline toggling, source rendering, safe Markdown, completion, saved progress, quiz grading, reports and final gating.

## Copy the course

Use **Copy entire course** beneath the final assessment in the outline to copy a single plain-text article. It includes every section, lesson, slide, code example, source link, quiz choice, correct answer and explanation, followed by the final assessment. Collapsed sections and locked assessments are included. Browser progress and personal notes are excluded. If clipboard permission is blocked, a selected text field is provided for manual copying.

## Reporting limits

Learner settings, completion and quiz attempts are browser-local. Clearing browser data clears progress. There is no authentication, shared backend, instructor dashboard, exam-secure grading, verified certificate or SCORM/xAPI integration. Correct answers are shipped in the client. Add an authenticated API and server-side grading for multi-user production use.
