# Screen Recording Guide

Instructions for creating a professional demo video of DevGraph.

## Quick Recording Setup

### Option 1: Using OBS Studio (Free, Professional)

**Download:** https://obsproject.com/

**Setup (5 minutes):**

1. **Install OBS** and launch it
2. **Create Scene:**
   - Click "+" under Scenes
   - Name it "DevGraph Demo"
3. **Add Display Source:**
   - Click "+" under Sources
   - Select "Display Capture" (or "Window Capture" for just browser)
   - Select your monitor/window
   - Click OK
4. **Configure Audio:**
   - Under Audio Mixer, select your microphone
   - Adjust levels (keep at -3dB to avoid clipping)
5. **Configure Output:**
   - Settings > Output
   - Video Bitrate: 5000 Kbps
   - Video Encoder: x264
   - Audio Bitrate: 128 Kbps
   - Recording Quality: Same as stream
   - Recording Path: Choose where to save

**Recording:**
```
Press Ctrl+R to start/stop recording
```

### Option 2: Using ScreenFlow (Mac Only)

**Download:** https://www.telestream.net/screenflow/

**Setup:**
1. Select entire screen or application window
2. Enable internal audio capture
3. Click "Record"

### Option 3: Using Gyroflow Toolbox (Mobile Friendly)

**Download:** https://gyroflow.xyz/

Works great for screen recording with built-in stabilization.

---

## Demo Script (3-5 minutes)

Follow this script to create a compelling demo. **Total time: 3-5 minutes**

### 1. Introduction (0:00-0:30)

```
"DevGraph is a developer knowledge and collaboration graph 
built with Next.js and Neo4j. Let me show you how it 
revolutionizes how we discover relationships in our 
developer community."
```

**Action:**
- Show home page in browser
- Narrate the 4 key statistics on dashboard
- Click through the main navigation

**Recording tip:** Slow down your mouse movements, speak clearly

### 2. Dashboard & Statistics (0:30-1:00)

```
"The dashboard shows real-time network statistics. 
We have 20 developers, 12 projects, and 20 technologies 
with over 127 relationships. These metrics are computed 
directly from our graph database using a single Cypher query."
```

**Action:**
- Hover over each stat card
- Show the numbers updating
- Explain what each metric means

**Demo data:**
- Developers: 20
- Projects: 12
- Technologies: 20
- Relationships: 127

### 3. Developer Search (1:00-1:45)

```
"Let's search for developers. I'll type 'alice' to find Alice Smith.
She's a Frontend Engineer from San Francisco with expertise 
in React, TypeScript, and modern web technologies."
```

**Action:**
1. Go to Developers page
2. Search for "Alice" (or any developer)
3. Show search results
4. Click on Alice's profile

**Show on profile:**
- Name, role, location, bio
- Avatar
- Technologies section (React, TypeScript, Next.js, etc.)
- Projects worked on (GraphDB Dashboard)
- Collaborators section (auto-computed from shared projects)

```
"Notice the 'Collaborators' section. This is computed 
dynamically using a graph database query that finds all 
developers who worked on the same projects as Alice."
```

### 4. Project Explorer (1:45-2:30)

```
"Next, let's explore projects. Here's the 'GraphDB Dashboard' project.
It shows the complete team and tech stack used."
```

**Action:**
1. Go to Projects page
2. Click on "GraphDB Dashboard" project
3. Show project details:
   - Team members: Alice Smith, Charlie Brown, Hannah Abbott
   - Technologies: TypeScript, Next.js, Neo4j, GraphQL, Tailwind CSS

```
"This view aggregates all developers and technologies 
associated with the project in a single, efficient query."
```

### 5. Technology Explorer (2:30-3:15)

```
"Let's look at the Technology Explorer. 
React is one of the most popular frontend frameworks here."
```

**Action:**
1. Go to Technologies page
2. Click on "React"
3. Show:
   - Who knows React (developers)
   - What projects use React
   - Related technologies (JavaScript, Next.js, TypeScript)

```
"The related technologies section shows a learning path. 
If you want to learn React, you might already know JavaScript 
and TypeScript, which are natural prerequisites."
```

### 6. Recommendation Engine (3:15-3:45)

```
"Here's where graph databases really shine: 
the recommendation engine. Let's say we want to suggest 
developers who should learn GraphQL. The system finds 
developers who know related technologies but haven't 
learned GraphQL yet."
```

**Action:**
1. Go to Technologies page
2. Click on "GraphQL" 
3. Look for "Recommended Learners" section (or show the concept)
4. Show suggested developers:
   - Their current technology stack
   - Why they're recommended (bridging technologies)

```
"This multi-hop graph query would be extremely complex in SQL, 
but in Neo4j it's a natural traversal: 
Developer -> KNOWS -> Technology -> RELATED_TO -> GraphQL"
```

### 7. Interactive Graph (3:45-4:30)

```
"Finally, let's explore the interactive graph visualization. 
This shows all developers, projects, and technologies as nodes, 
with their relationships as edges."
```

**Action:**
1. Go to Graph page
2. Let it load (show the force-directed graph)
3. Hover over nodes to show details
4. Drag nodes around to show interactivity
5. Point out node types:
   - Blue: Developers
   - Green: Projects
   - Purple: Technologies
6. Zoom in on interesting clusters
   - Frontend cluster (React, Vue.js, TypeScript)
   - Backend cluster (Python, Node.js, Django)

```
"The physics simulation creates natural clustering. 
Technologies that are often used together pull together, 
revealing the natural architecture of our tech ecosystem."
```

### 8. Closing (4:30-5:00)

```
"DevGraph demonstrates how graph databases excel at 
modeling complex relationships. The queries are intuitive, 
the performance is excellent, and the insights are immediate. 
This is the future of developer intelligence and 
knowledge management."
```

**Action:**
- Go back to dashboard
- Show project repository link
- Mention deployment URL
- Thank viewers

---

## Recording Technical Tips

### Audio Quality
- **Use a microphone headset** (much better than laptop mic)
- **Reduce background noise:**
  - Close windows and doors
  - Turn off notifications
  - Pause music streaming services
- **Speak clearly and slowly** (easier to understand, can add captions)
- **Test audio levels** before recording (aim for -6dB to -3dB peak)

### Video Quality
- **Screen resolution:** 1920x1080 (1080p) or 2560x1440 (1440p)
- **Browser zoom:** 100% (don't zoom in/out, reduces text clarity)
- **Dark mode:** Enable for easier on-the-eyes recording
- **Hide personal information:** Hide email, chat, etc.

### Pacing
- **Move slowly:** Humans can't follow fast mouse movements
- **Pause between actions:** Give viewers time to absorb (1-2 seconds)
- **Use keyboard shortcuts:** Copy/paste is smoother than typing
- **Take breaks:** Record in segments, edit them together

### Common Mistakes to Avoid
- ❌ Too fast narration (speak 20% slower than normal)
- ❌ Shaky mouse movements (use smooth transitions)
- ❌ Too much text on screen (keep it simple)
- ❌ Background clutter (close unnecessary windows/tabs)
- ❌ Abrupt transitions (use fade transitions when cutting)

---

## Post-Recording Editing

### Using iMovie (Mac) or Windows Photos (Windows)

**Basic Editing:**
1. Import recording
2. Trim beginning/end (remove dead time)
3. Add intro slide (title, date, version)
4. Add outro slide (thank you, links)
5. Adjust audio levels (normalize to -3dB)
6. Export as H.264 MP4

### Using CapCut (Free, All Platforms)

**CapCut is excellent for short demo videos:**
1. Import video
2. Trim unwanted sections
3. Add title slides
4. Add background music (royalty-free from CapCut library)
5. Add captions (auto-generated, can edit)
6. Export as 1080p MP4

### Using Premiere Pro (Professional)

For professional editing:
1. Create new project (1920x1080, 30fps)
2. Import recording
3. Create timeline
4. Add intro/outro graphics
5. Color correction (optional)
6. Audio normalization
7. Export as H.264 1080p

---

## Uploading & Sharing

### YouTube Upload

**For private team sharing:**
1. Go to youtube.com/upload
2. Select "Unlisted" (shareable but not searchable)
3. Upload MP4 file (max 256GB, typically < 500MB)
4. Add title: "DevGraph Demo - Developer Network Graph Database"
5. Add description with:
   - Live demo link
   - GitHub repository
   - Setup instructions
6. Add tags: "graph-database", "neo4j", "next.js", "demo"
7. Publish

**Share link:**
```
https://youtu.be/XXXXXXXXXXXX
or
https://www.youtube.com/embed/XXXXXXXXXXXX (for embedding)
```

### Loom (Quick & Easy)

**Best for quick shares:**
1. Go to loom.com
2. Record directly in browser
3. Share link immediately
4. Supports instant feedback/comments

**Share link:**
```
https://loom.com/share/XXXXXXXXXXXXX
```

### Vimeo (Professional Quality)

For higher production quality:
1. Go to vimeo.com
2. Upload MP4
3. Set privacy to "Unlisted"
4. Share link

---

## Key Points to Highlight in Video

✅ **Graph database advantages:**
- Natural relationship modeling
- Readable Cypher queries vs. complex SQL
- Fast multi-hop traversals
- Perfect for recommendation engines

✅ **Technical architecture:**
- Next.js for frontend/API
- Neo4j/CognoDB for database
- Server-side queries (secure)
- TypeScript for type safety

✅ **Use cases:**
- Developer directory
- Skill discovery
- Team collaboration mapping
- Technology adoption tracking
- Learning path recommendations

✅ **Interactive features:**
- Search and filter
- Profile aggregation
- Real-time graph visualization
- Intelligent recommendations

---

## Video Specs Checklist

- [ ] **Duration:** 3-5 minutes
- [ ] **Resolution:** 1920x1080 (minimum)
- [ ] **Format:** MP4 (H.264 codec)
- [ ] **Frame rate:** 30fps
- [ ] **Audio:** Clear narration, no background noise
- [ ] **Captions:** English subtitles (auto-generated OK)
- [ ] **Intro:** Title slide with project name
- [ ] **Outro:** Thank you slide with links
- [ ] **Quality:** Professional but not overly polished

---

## Recording Schedule Suggestion

1. **Plan (5 min):** Review this script
2. **Setup (10 min):** Configure OBS/recorder, test audio/video
3. **Record (15 min):** Do 2-3 takes, keep best one
4. **Review (5 min):** Watch full recording, identify edits needed
5. **Edit (20 min):** Trim, add transitions, normalize audio
6. **Upload (5 min):** Export and upload to YouTube/Loom

**Total time: ~60 minutes for professional demo**

---

## Example Narration Timing

```
0:00 - 0:30  → Introduction (dashboard view)
0:30 - 1:00  → Dashboard stats explanation
1:00 - 1:45  → Developer search & profile demo
1:45 - 2:30  → Project explorer walkthrough
2:30 - 3:15  → Technology explorer & adoption metrics
3:15 - 3:45  → Recommendation engine demo
3:45 - 4:30  → Interactive graph visualization
4:30 - 5:00  → Closing remarks & thank you
```

---

## Resources

- **OBS Studio:** https://obsproject.com/
- **CapCut:** https://www.capcut.com/
- **Loom:** https://loom.com/
- **Royalty-free music:** https://www.bensound.com/
- **Screen recording tips:** https://www.techsmith.com/
