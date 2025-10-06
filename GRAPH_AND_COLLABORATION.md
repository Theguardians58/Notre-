# 🔗 Graph View & Real-time Collaboration

**Added**: October 2025  
**Version**: v2.2.0

---

## 🎯 New Features

### 1. Graph View - Visualize Note Connections
Interactive visualization of how your notes are connected through bi-directional links and hierarchies.

### 2. Real-time Collaboration
Multiple users can view and edit the same note simultaneously with live presence indicators and conflict resolution.

---

## 📊 Graph View

### What is it?
Graph View is an interactive, visual representation of your notes and how they're connected. See your knowledge base as a network of interconnected ideas.

### Features

✅ **Interactive Visualization**
- Nodes represent notes
- Edges (lines) represent connections
- Color-coded by note type
- Size based on content and connections

✅ **Exploration Tools**
- Zoom and pan
- Click nodes to navigate
- Search to filter
- Focus mode (show only nearby notes)

✅ **Statistics**
- Total notes and connections
- Average links per note
- Number of clusters
- Most connected notes
- Isolated notes (no connections)

✅ **Visual Features**
- Force-directed layout (nodes repel/attract)
- Real-time graph updates
- Smooth animations
- Dark mode support
- Responsive design

### How to Use

**Access Graph View:**
```
Sidebar → Graph View
or
Navigate to /graph
```

**Controls:**
- **Search**: Filter notes by title
- **Focus Mode**: Show only notes connected to current note
- **Fit to Screen**: Auto-zoom to see all notes
- **Click Node**: Navigate to that note
- **Hover Node**: See note details
- **Drag**: Pan around the graph
- **Scroll**: Zoom in/out

**Node Colors:**
- 🔵 Blue: Document
- 🟣 Purple: Meeting Notes
- 🟢 Green: Project Plan
- 🟠 Amber: Diagrams
- ⚫ Gray: Other

**Edge Types:**
- Regular line: Bi-directional link ([[link]])
- Green line: Parent-child relationship

### Graph Statistics

The stats panel shows:
- **Total Notes**: All notes in graph
- **Connections**: Total links
- **Avg. Links**: Average links per note
- **Clusters**: Separate groups of connected notes
- **Most Connected**: Note with most links

### Use Cases

✅ **Good For:**
- Understanding note relationships
- Finding knowledge gaps
- Discovering connections
- Visualizing project structure
- Identifying orphaned notes
- Exploring your knowledge base

---

## 👥 Real-time Collaboration

### What is it?
Multiple users can work on the same note simultaneously. See who's viewing or editing, with live updates and conflict resolution.

### Features

✅ **User Presence**
- See who's currently viewing the note
- Identify who's actively editing
- User avatars with colored indicators
- Real-time presence updates

✅ **Live Editing**
- Changes sync automatically
- Debounced updates (every 1 second)
- Conflict-free merging
- Version tracking

✅ **Visual Indicators**
- Active user avatars in header
- Editing indicator (dot on avatar)
- User colors for identification
- Presence timeout (30 seconds)

✅ **Collaboration Features**
- Automatic save
- Real-time sync
- No manual refresh needed
- Works with encryption (coming soon)

### How to Use

**Start Collaborating:**
1. Open any note
2. Share the note URL with others
3. Multiple users open the same note
4. See their avatars in the header
5. Edit simultaneously!

**User Indicators:**
- **Avatar**: User is viewing
- **Avatar with dot**: User is editing
- **Avatar color**: Matches user's assigned color
- **+N**: More than 5 users viewing

**Best Practices:**
- Communicate via chat/call when editing together
- Use comments for async feedback (coming soon)
- Wait a moment before editing if someone else is editing
- Save frequently (auto-save every 1 second)

### Technical Details

**Presence System:**
- Firestore real-time listeners
- Heartbeat every 10 seconds
- 30-second timeout for inactive users
- Automatic cleanup on tab close

**Content Sync:**
- Debounced sync (1 second delay)
- Version numbering
- Last-write-wins strategy
- Remote update detection

**Performance:**
- Optimized Firestore queries
- Minimal bandwidth usage
- Efficient update batching
- No polling (uses Firestore listeners)

---

## 🔧 Implementation Details

### Graph View Architecture

**Libraries Used:**
- `react-force-graph-2d`: Interactive force-directed graph
- Custom graph builder
- D3-based layout algorithm

**Data Structure:**
```typescript
interface GraphNode {
  id: string;
  label: string;
  type: 'document' | 'meeting_notes' | ...;
  size: number; // Based on connections
  connections: number;
  color: string;
  emoji?: string;
}

interface GraphEdge {
  id: string;
  source: string; // Note ID
  target: string; // Note ID
  type: 'link' | 'parent-child' | 'backlink';
  weight: number;
}
```

**Graph Building:**
```typescript
import { buildGraphFromNotes } from '@/lib/graph/graph-builder';

const graph = buildGraphFromNotes(notes);
// Returns: { nodes: GraphNode[], edges: GraphEdge[] }
```

**Filtering:**
```typescript
import { filterGraph, getSubgraph } from '@/lib/graph/graph-builder';

// Search filter
const filtered = filterGraph(graph, 'project');

// Focus on specific note
const subgraph = getSubgraph(graph, noteId, depth);
```

### Collaboration Architecture

**Presence Tracking:**
```typescript
import { PresenceManager } from '@/lib/collaboration/presence';

const presence = new PresenceManager(
  noteId,
  userId,
  userName,
  userEmail,
  photoURL
);

presence.start(isEditing);
// Updates every 10 seconds
presence.stop();
// Removes presence
```

**Real-time Sync:**
```typescript
import { CollaborativeEditor } from '@/lib/collaboration/realtime-sync';

const collab = new CollaborativeEditor(noteId, userId, userName);
collab.setEditor(tiptapEditor);
collab.startCollaboration();
// Syncs changes and listens for updates
collab.stopCollaboration();
// Saves final changes
```

**Components:**
- `ActiveUsers`: Shows avatars of viewing users
- `CollaborativeCursors`: Shows other users' cursors (placeholder)

---

## 📱 Usage Examples

### Graph View

**Basic Usage:**
```tsx
import GraphView from '@/components/graph/GraphView';

<GraphView 
  notes={notes} 
  currentNoteId={currentNoteId} 
/>
```

**With Search:**
1. Open Graph View
2. Type in search box
3. Graph filters to matching notes
4. Click node to navigate

**Focus Mode:**
1. Open a note
2. Navigate to Graph View
3. Click "Focus Mode"
4. See only connected notes (2 degrees of separation)

### Collaboration

**Enable on Note:**
```tsx
import ActiveUsers from '@/components/collaboration/ActiveUsers';
import { PresenceManager } from '@/lib/collaboration/presence';

// In note component
const presence = new PresenceManager(noteId, ...);
presence.start(true); // true = editing

<ActiveUsers noteId={noteId} />
```

**Share Link:**
```
https://your-app.com/note/NOTE_ID
```

Send this link to collaborators and they'll see live updates!

---

## 🎨 Customization

### Graph Appearance

**Node Colors:**
Edit in `lib/graph/graph-builder.ts`:
```typescript
function getNodeColor(type: string): string {
  const colors = {
    document: '#3b82f6',      // blue
    meeting_notes: '#8b5cf6', // purple
    // Add your colors here
  };
  return colors[type] || '#6b7280';
}
```

**Node Size:**
```typescript
function calculateNodeSize(note: Note, connections: number): number {
  const baseSize = 10;
  const connectionBonus = connections * 2;
  return Math.min(baseSize + connectionBonus, 50);
}
```

### User Colors

Edit in `lib/collaboration/presence.ts`:
```typescript
export function getUserColor(userId: string): string {
  const colors = [
    '#ef4444', // red
    '#f59e0b', // amber
    // Add more colors
  ];
  // Returns consistent color per user
}
```

---

## 🚀 Advanced Features

### Graph Algorithms

**Find Clusters:**
```typescript
import { getClusters } from '@/lib/graph/graph-builder';

const clusters = getClusters(graph);
// Returns: GraphNode[][] (groups of connected notes)
```

**Find Isolated Notes:**
```typescript
import { getIsolatedNodes } from '@/lib/graph/graph-builder';

const isolated = getIsolatedNodes(graph);
// Returns: GraphNode[] (notes with no connections)
```

**Graph Statistics:**
```typescript
import { calculateGraphStats } from '@/lib/graph/graph-builder';

const stats = calculateGraphStats(graph);
// Returns: { totalNodes, totalEdges, averageConnections, ... }
```

### Real-time Events

**Listen to Presence:**
```typescript
import { subscribeToPresence } from '@/lib/collaboration/presence';

const unsubscribe = subscribeToPresence(noteId, currentUserId, (users) => {
  console.log('Active users:', users);
});

// Clean up
unsubscribe();
```

**Listen to Content Updates:**
```typescript
import { subscribeToNoteUpdates } from '@/lib/collaboration/realtime-sync';

const unsubscribe = subscribeToNoteUpdates(noteId, userId, (snapshot) => {
  console.log('Content updated by:', snapshot.lastModifiedBy);
  // Update editor
});
```

---

## 🔒 Security & Privacy

### Graph View

✅ **Private by Default**
- Only shows your notes
- No public graph exposure
- Requires authentication

✅ **Encrypted Notes**
- Graph works with encrypted notes
- Node titles may be encrypted (future)
- Connections still visible in graph

### Collaboration

✅ **Secure Presence**
- Presence data stored in Firestore
- User authentication required
- Automatic cleanup

✅ **Data Protection**
- Changes tracked with user ID
- Version control
- Audit trail

⚠️ **Current Limitations**:
- Collaboration not yet compatible with E2E encryption
- All collaborators see plaintext content
- Coming soon: Encrypted collaboration

---

## 📊 Performance

### Graph View

**Optimization:**
- Virtualized rendering for large graphs
- Lazy loading of node details
- Debounced search filtering
- Efficient force simulation

**Limits:**
- Tested with 1,000+ notes
- Smooth up to 10,000 connections
- Auto-zoom for large graphs

### Collaboration

**Bandwidth:**
- Presence: ~1 KB every 10 seconds per user
- Content sync: Only changed content
- Firestore listeners: Minimal overhead

**Limits:**
- Recommended: < 10 concurrent editors per note
- Presence timeout: 30 seconds
- Sync debounce: 1 second

---

## ❓ FAQs

### Graph View

**Q: Can I see connections across all my notes?**
A: Yes! Graph View shows all notes and their connections.

**Q: What does node size mean?**
A: Larger nodes have more content or more connections.

**Q: Can I export the graph?**
A: Not yet, but this is planned for a future update.

**Q: Does the graph update in real-time?**
A: Yes, when you add links or create notes, the graph updates automatically.

### Collaboration

**Q: How many people can edit at once?**
A: Technically unlimited, but we recommend < 10 for best performance.

**Q: What happens if we edit the same text?**
A: Last write wins. The most recent save overwrites previous changes.

**Q: Can I see other users' cursors?**
A: This is a placeholder feature - full cursor sync coming soon!

**Q: Does it work offline?**
A: Presence requires connection. Offline edits sync when you reconnect.

**Q: Can I disable collaboration?**
A: It's always on, but only users with access to the note can see presence.

---

## 🐛 Troubleshooting

### Graph View Issues

**Problem**: Graph doesn't load
- **Solution**: Refresh page, check browser console for errors

**Problem**: Nodes overlap too much
- **Solution**: Click "Fit to Screen", zoom out, or use Focus Mode

**Problem**: Can't find a note in graph
- **Solution**: Use search box to filter graph

### Collaboration Issues

**Problem**: Don't see other users
- **Solution**: Ensure they have the note open, check internet connection

**Problem**: Changes not syncing
- **Solution**: Check internet, wait 1-2 seconds for auto-save

**Problem**: Presence shows wrong status
- **Solution**: Refresh page, presence updates every 10 seconds

---

## 🔮 Future Enhancements

### Graph View (Planned)

- [ ] 3D graph view
- [ ] Graph export (PNG, SVG, JSON)
- [ ] Custom graph layouts
- [ ] Tag-based filtering
- [ ] Time-travel (graph over time)
- [ ] Graph analytics dashboard

### Collaboration (Planned)

- [ ] Live cursor positions
- [ ] User selections highlighting
- [ ] Collaborative comments
- [ ] Conflict resolution UI
- [ ] Encrypted collaboration
- [ ] Presence in graph view
- [ ] Audio/video calls
- [ ] Real-time chat

---

## 📞 Support

Issues or questions:
- GitHub: https://github.com/Theguardians58/Notre-/issues
- Docs: See README.md and other guides
- Roadmap: See ROADMAP.md for planned features

---

**Ready to visualize your knowledge and collaborate in real-time!** 🚀

**Version**: v2.2.0  
**Last Updated**: October 2025  
**Repository**: https://github.com/Theguardians58/Notre-
