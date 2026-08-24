# Woolen Bluebird

## V1 Website Specification

**Tagline:**
*Connecting people through stories, making, and the healing power of creativity.*

---

# 1. Project Overview

Woolen Bluebird is a storytelling and community platform centered around making, creativity, connection, and the ways creative practice can help people move through difficult seasons of life.

The long-term vision is larger than the website itself. Woolen Bluebird may eventually include a robust maker directory, community gatherings, workshops, retreats, a festival, and a physical farm/community space.

The V1 website should establish the **foundation for that larger vision**.

The website should feel like an invitation into a community rather than a corporate organization website.

The central idea is:

> **Woolen Bluebird was my story.**
> ↓
> **Woolen Bluebird became a collection of stories.**
> ↓
> **Woolen Bluebird became a community.**

The website should begin that progression.

---

# 2. Mission

Woolen Bluebird exists to connect people through:

* stories
* making
* creativity
* craftsmanship
* learning
* community
* and the healing power of creative practice

The project is interested in all kinds of making, including but not limited to:

* knitting
* sewing
* fiber arts
* woodworking
* pottery
* gardening
* cooking
* repairing
* building
* painting
* weaving
* natural dyeing
* traditional crafts
* sustainable practices

The focus is not simply on the objects people make.

The focus is on **the human stories behind making**.

---

# 3. Core Question

The central question of Made Whole is:

> **What helped you keep singing?**

This question represents the larger philosophy of Woolen Bluebird.

Making does not have to be productive, profitable, impressive, or perfect to matter.

Creative practice can provide:

* meaning
* identity
* connection
* routine
* expression
* healing
* belonging
* purpose

Woolen Bluebird seeks to document those experiences.

---

# 4. V1 Goals

The first version of the website should:

1. Introduce visitors to the Woolen Bluebird mission.
2. Tell the origin story of Woolen Bluebird.
3. Provide a home for stories about makers and making.
4. Begin building a maker directory.
5. Give people a way to submit their own stories.
6. Give makers a way to submit themselves to the directory.
7. Provide a place for Arianne's personal writing and creative process.
8. Create a foundation for future community gatherings.
9. Establish a visual identity that can grow with the project.
10. Be technically structured so future features can be added without rebuilding the entire application.

---

# 5. V1 Audience

The primary audience includes people who:

* make things
* want to learn to make things
* have found meaning or healing through creativity
* are looking for creative communities
* want to find local makers or teachers
* value handmade and sustainable practices
* feel disconnected from modern life
* want to reconnect with slower, more intentional forms of making
* are curious about other people's creative journeys

A secondary audience includes:

* makers
* craft teachers
* community organizers
* workshop hosts
* local creative groups
* sustainable businesses
* people interested in traditional skills

---

# 6. Site Architecture

The V1 navigation should contain:

```text
Home
Made Whole
Maker Directory
Journal
Gather
About
```

Additional actions/features:

```text
Submit Your Story
Submit a Maker
```

These submission actions may appear as buttons or calls-to-action rather than primary navigation items.

---

# 7. Homepage

The homepage should introduce Woolen Bluebird emotionally before explaining it technically.

## Hero Section

Display:

**Woolen Bluebird**

*Connecting people through stories, making, and the healing power of creativity.*

Primary CTA:

**Explore the Stories**

Secondary CTA:

**Find Makers**

The hero should feel warm, handmade, personal, and inviting.

Avoid making the homepage look like a generic technology startup.

---

## Homepage Story / Mission Section

Introduce the idea that making can be about much more than the finished object.

Possible concept:

> We make things because we are human.
>
> We make to remember.
>
> We make to survive.
>
> We make to connect.
>
> We make because sometimes creating something with our hands helps us find our way back to ourselves.

This section should lead naturally into Made Whole.

CTA:

**Explore Made Whole**

---

## Featured Stories

Display a small selection of recent or featured stories.

Each story card should include:

* image
* title
* story type
* maker/person name
* short excerpt
* link to story

V1 can use a simple grid.

---

## Maker Directory Introduction

Introduce the directory with language such as:

> Find the people who make, teach, repair, grow, gather, and share.

CTA:

**Explore the Maker Directory**

---

## Community / Gather Section

Introduce the future community aspect of Woolen Bluebird.

Examples:

* knitting circles
* workshops
* mending nights
* storytelling evenings
* creative gatherings

V1 does not need a sophisticated event system.

The section can initially explain the vision and display upcoming gatherings if any exist.

---

## Submit Your Story CTA

A prominent section should invite visitors to contribute.

Possible message:

> Have you found healing, connection, or meaning through making?
>
> We want to hear your story.

CTA:

**Share Your Story**

---

## Closing Homepage Message

End the homepage with a short statement reinforcing the larger vision:

> One story becomes another.
>
> One maker introduces us to another.
>
> One gathering becomes a community.
>
> Thread by thread, we weave something together.

---

# 8. Made Whole

Made Whole is the central storytelling section of Woolen Bluebird.

## Purpose

Made Whole documents stories about people and their relationship with creativity and making.

The section can contain:

* interviews
* personal essays
* maker profiles
* podcast episodes
* eventually short-form video

---

## Made Whole Landing Page

Display:

**Made Whole**

*Stories of making, healing, and becoming whole.*

Include filtering or category navigation for:

* All Stories
* Interviews
* Essays
* Maker Profiles
* Podcast

V1 filtering can be implemented on the frontend or through API/database queries.

---

# 9. Story Detail Page

Each story should have a dedicated page.

A story should support:

* title
* subtitle or excerpt
* author
* featured image
* publication date
* story type
* body content
* maker/person information
* optional external links
* optional audio/video
* related stories

The layout should prioritize readability.

This should feel more like reading a thoughtful magazine or personal essay than browsing a commercial blog.

---

# 10. Submit Your Story

Visitors should be able to submit stories to Woolen Bluebird.

The submission form should initially collect:

* name
* email
* location
* title
* story
* relationship to making/creativity
* optional maker/craft category
* optional website
* optional social media
* optional photo upload
* permission to contact them about their submission
* permission regarding publication

The form should clearly explain that submitting a story does **not automatically guarantee publication**.

Submissions should be stored in the backend/database.

V1 does not need a public user account system.

Submissions should enter a review/pending state.

---

# 11. Maker Directory

The Maker Directory is the connection component of Woolen Bluebird.

Its purpose is to help visitors find people, organizations, classes, workshops, and creative communities.

V1 should begin with individual maker profiles.

---

## Maker Directory Landing Page

Display:

**The Maker Directory**

*Find the people who make, teach, gather, repair, grow, and share.*

Maker cards should include:

* name
* photograph
* location
* primary craft/category
* short description
* link to profile

---

## V1 Directory Categories

Potential categories include:

* Fiber Arts
* Woodworking
* Pottery & Ceramics
* Gardening
* Cooking & Food
* Sewing
* Weaving
* Painting & Drawing
* Leatherwork
* Metalwork
* Repair & Mending
* Traditional Skills
* Other

The categories should be stored in a way that allows additional categories later.

---

# 12. Maker Profile

Each maker should have a dedicated profile page.

Potential fields:

* name
* profile photo
* location
* bio
* craft/category
* website
* social links
* workshops/classes
* related stories
* contact information if appropriate
* sustainability/community information

V1 does not need direct messaging between users and makers.

---

# 13. Submit a Maker

Visitors should be able to nominate themselves or another maker.

The form should collect:

* maker name
* submitter name
* submitter email
* location
* craft/category
* maker description
* website
* social links
* optional photo
* optional workshop information
* reason for recommending the maker
* permission to contact
* confirmation that submitted information may be reviewed for inclusion

Submissions should enter a **pending review** state.

The maker should not automatically appear publicly until approved.

---

# 14. Journal

The Journal is Arianne's personal writing space.

Where Made Whole primarily tells **other people's stories**, the Journal provides space for Arianne's own voice.

Possible content:

* personal reflections
* essays
* behind-the-scenes writing
* creative process
* building Woolen Bluebird
* thoughts about making
* reflections on community
* farm/creative life
* project updates

The Journal should have a simple article structure similar to Made Whole.

---

# 15. Gather

Gather represents the community branch of Woolen Bluebird.

V1 should establish the concept without attempting to build a complicated event platform.

Possible content:

* upcoming gatherings
* knitting circles
* workshops
* mending nights
* storytelling evenings
* community events

If no events are currently available, the page should provide an inviting explanation of the future vision rather than displaying an empty technical page.

Possible message:

> We believe making is better together.
>
> Woolen Bluebird Gatherings are places to learn, create, share stories, and belong.

Future versions may include:

* event creation
* event registration
* recurring events
* host accounts
* location search
* calendars
* workshop registration

These are **not V1 requirements**.

---

# 16. About

The About page should tell the story of Woolen Bluebird.

It should explain:

* Arianne's connection to making
* how Woolen Bluebird began
* why the project exists
* the importance of creativity and community
* the larger vision

The About page should not read like a formal corporate "About Us" page.

It should feel personal and authentic.

The larger progression should be reflected:

> Woolen Bluebird was my story.
>
> Woolen Bluebird became a collection of stories.
>
> Woolen Bluebird became a community.

---

# 17. Content Model

The application should be designed around structured content rather than hard-coded pages.

At minimum, V1 should anticipate these entities:

```text
User/Admin
Story
Maker
StorySubmission
MakerSubmission
Category
Gathering
```

Not all of these need full functionality immediately.

---

## Story

Potential fields:

```text
id
title
slug
type
excerpt
content
featured_image
author
maker_id
category_id
status
published_at
created_at
updated_at
```

Possible story statuses:

```text
draft
pending
published
archived
```

---

## Maker

Potential fields:

```text
id
name
slug
bio
location
photo
category_id
website
social_links
status
created_at
updated_at
```

Possible statuses:

```text
pending
approved
featured
archived
```

---

## Story Submission

Potential fields:

```text
id
name
email
location
title
story
craft_category
website
social_links
photo
permission_to_contact
publication_permission
status
created_at
```

---

## Maker Submission

Potential fields:

```text
id
maker_name
submitter_name
submitter_email
location
category
description
website
social_links
photo
workshop_information
recommendation_reason
permission_to_contact
status
created_at
```

---

# 18. Admin / Content Management

V1 should include a basic administrative workflow if practical.

The primary requirement is that submitted stories and makers can be reviewed before appearing publicly.

At minimum, the backend should distinguish between:

```text
Pending
Approved/Published
Rejected
Archived
```

A full admin dashboard is desirable but should not block the initial public website if it significantly increases development scope.

If necessary, initial submissions can be reviewed directly through the database during early development.

---

# 19. Search and Filtering

V1 should keep search simple.

The Maker Directory should eventually support filtering by:

* category
* location

The Stories section should support filtering by:

* story type
* category

A full-text search engine is **not required for V1**.

---

# 20. Visual Direction

The visual identity should communicate:

**warmth + craftsmanship + nature + storytelling + quietness + connection**

The site should not look overly polished, corporate, sterile, or like a generic SaaS application.

Visual inspiration can come from:

* handmade books
* natural fibers
* vintage field journals
* botanical illustrations
* textile patterns
* handwritten notes
* old photographs
* natural landscapes
* imperfect handmade objects

The design should still be modern and accessible.

The goal is:

> **handmade feeling without looking amateur.**

---

# 21. Typography

Typography should create a contrast between:

**editorial/storytelling typography**

and

**clean functional interface typography.**

A serif display font could be used for major headings, paired with a highly readable sans-serif for navigation and body/interface elements.

Typography should prioritize accessibility and readability.

---

# 22. Color Direction

The palette should feel inspired by:

* natural wool
* cream
* warm white
* muted greens
* soft blues
* earth tones
* wood
* faded botanical colors

Avoid extremely saturated colors.

The bluebird should be an accent rather than overwhelming the entire design.

---

# 23. Imagery

Photography should feel:

* natural
* intimate
* documentary
* imperfect
* human

Avoid excessive stock photography.

Whenever possible, use photographs of real makers, real hands, real tools, real materials, and real places.

Images should support the stories rather than simply decorate the page.

---

# 24. Accessibility

Accessibility is a core requirement.

The application should include:

* semantic HTML
* keyboard navigation
* appropriate color contrast
* alt text for meaningful images
* visible focus states
* properly labeled forms
* accessible error messages
* responsive design
* logical heading structure

Forms should clearly communicate validation errors.

---

# 25. Responsive Design

The site must work well on:

* desktop
* tablet
* mobile

The mobile experience should not simply be a compressed desktop layout.

Navigation, story cards, forms, images, and typography should be intentionally designed for smaller screens.

---

# 26. Technical Direction

The application should be built as a full-stack web application.

Recommended V1 architecture:

### Frontend

* React
* Vite
* React Router
* CSS or a lightweight styling approach

### Backend

* Node.js
* Express

### Database

* PostgreSQL

### API

REST API connecting the React frontend to the Express backend.

### Deployment

Frontend and backend should be deployable independently.

Possible services can be selected during implementation based on simplicity and cost.

---

# 27. API Structure

The API should use clear REST-style routes.

Potential routes:

```text
GET    /api/stories
GET    /api/stories/:slug
POST   /api/story-submissions

GET    /api/makers
GET    /api/makers/:slug
POST   /api/maker-submissions

GET    /api/categories

GET    /api/gatherings
```

Admin routes can be added separately.

For example:

```text
GET    /api/admin/submissions
PATCH  /api/admin/story-submissions/:id
PATCH  /api/admin/maker-submissions/:id
```

Authentication should protect admin routes.

---

# 28. V1 Forms

The following forms are required:

### Story Submission

A visitor can submit a story.

### Maker Submission

A visitor can submit a maker.

Both forms must:

* validate required fields
* display useful validation errors
* show submission success
* handle server errors gracefully
* prevent accidental duplicate submissions where reasonably possible
* store submissions in the database

---

# 29. V1 Features

## Required

* [ ] Responsive homepage
* [ ] Navigation
* [ ] About page
* [ ] Made Whole landing page
* [ ] Story detail pages
* [ ] Story categories/types
* [ ] Maker Directory
* [ ] Maker profile pages
* [ ] Maker filtering
* [ ] Journal
* [ ] Gather page
* [ ] Story submission form
* [ ] Maker submission form
* [ ] Backend API
* [ ] PostgreSQL database
* [ ] Submission persistence
* [ ] Form validation
* [ ] Responsive/mobile design
* [ ] Basic accessibility
* [ ] Error and empty states

---

# 30. Explicitly Out of Scope for V1

Do not allow these features to unnecessarily expand the initial project:

* user accounts
* social networking
* direct messaging
* comments
* likes
* following
* complex recommendation algorithms
* payment processing
* marketplace
* shopping cart
* event ticketing
* complex event registration
* automated newsletters
* advanced search
* mobile app
* multi-language support
* AI recommendation systems
* complex analytics dashboards
* full community forum
* farm management
* festival management

These may become future features.

The goal of V1 is to establish the **storytelling and connection foundation**.

---

# 31. Future Vision

The architecture should leave room for future expansion.

Potential future features include:

### Community

* user accounts
* community profiles
* discussions
* comments
* following makers
* private groups

### Maker Directory

* advanced location search
* maps
* workshops
* classes
* reviews
* maker verification

### Gatherings

* event creation
* registration
* recurring events
* host profiles
* local gathering groups

### Made Whole

* podcast player
* video
* newsletters
* books
* multimedia stories

### Woolen Bluebird Festival

* vendor applications
* workshops
* schedules
* maps
* tickets
* volunteer registration

### Physical Woolen Bluebird

Eventually, the website may support a physical place where people can:

* grow food
* raise animals
* work with natural fibers
* dye wool
* mend clothing
* learn traditional skills
* create
* rest
* gather

The physical place represents the philosophy of Woolen Bluebird:

> **You do not have to be productive to matter.**
>
> **You are a creator.**
>
> **You belong here.**

---

# 32. Content Philosophy

The site should prioritize **people over products**.

Woolen Bluebird is not primarily a craft marketplace.

It is not about convincing people to buy handmade things.

It is about asking:

> Who are the people behind the making?

> What brought them here?

> What have they survived?

> What have they learned?

> What does making mean to them?

> Who taught them?

> What do they hope to pass on?

The object is often the doorway into the story.

The person is the story.

---

# 33. Initial Content Strategy

The first version does not need hundreds of stories.

A strong initial launch could contain:

* Arianne's origin story
* 3–5 maker interviews
* several Journal entries
* 5–10 maker directory entries
* one or two gatherings, if available

The site should look intentional and alive without pretending to be larger than it is.

Empty states should be written warmly rather than looking like technical errors.

---

# 34. First Story

The first story should establish why Woolen Bluebird exists.

The central idea:

> Making has been part of my healing journey, and I've started wondering how many other people have found healing through creating.

This story can introduce the larger project and invite others to contribute.

---

# 35. Launch Philosophy

The website does not need to be perfect before Woolen Bluebird begins.

The project should grow one thread at a time.

The basic cycle is:

```text
Interview one maker
        ↓
Record the conversation
        ↓
Create the story
        ↓
Publish it
        ↓
Share short-form content
        ↓
Add the maker to the directory
        ↓
Invite another maker
        ↓
Repeat
```

One story becomes another.

One maker introduces another.

One gathering becomes a community.

Over time, those individual threads become Woolen Bluebird.

---

# 36. Development Priority

Claude should build the project in stages rather than attempting the entire application simultaneously.

Recommended order:

### Phase 1 — Foundation

* project setup
* React/Vite frontend
* Express backend
* PostgreSQL connection
* environment variables
* basic routing
* global styling
* responsive layout

### Phase 2 — Public Content

* homepage
* About
* Made Whole
* Story detail pages
* Journal
* Maker Directory
* Maker profiles
* Gather

### Phase 3 — Submission System

* Story submission form
* Maker submission form
* backend validation
* database persistence
* success/error states

### Phase 4 — Directory & Content Features

* categories
* filtering
* related stories
* featured content
* improved empty states

### Phase 5 — Admin / Review

* protected admin routes
* review pending submissions
* approve/reject submissions
* publish approved content

### Phase 6 — Polish

* accessibility audit
* responsive testing
* loading states
* error handling
* visual refinement
* performance
* deployment

---

# 37. Definition of Done for V1

V1 is complete when a visitor can:

1. Understand what Woolen Bluebird is within a few seconds.
2. Read the origin story.
3. Browse stories.
4. Read an individual story.
5. Browse makers.
6. Filter makers.
7. View an individual maker.
8. Read Arianne's Journal.
9. Learn about future gatherings.
10. Submit a story.
11. Submit a maker.
12. Receive clear confirmation that their submission was received.
13. Use the website comfortably on a phone or desktop.
14. Navigate the site using a keyboard.
15. Encounter clear, human-friendly empty and error states.

And, critically, an administrator should be able to distinguish submitted content from approved public content.

---

# 38. Guiding Principle for Development

When deciding whether a feature belongs in V1, ask:

> **Does this help someone discover a story, find a maker, share their own story, or feel invited into the Woolen Bluebird community?**

If the answer is no, it probably belongs in a future version.

The website is the trail marker.

The stories are the invitation.

The directory is the map.

The gatherings are the hearth.

And the community is what we are ultimately trying to weave together.
