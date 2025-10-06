/**
 * Graph Builder for Note Relationships
 * Builds graph data structure from notes and their links
 */

import { Note } from '@/lib/types';

export interface GraphNode {
  id: string;
  label: string;
  title: string;
  type: 'document' | 'meeting_notes' | 'project_plan' | 'diagram' | 'other';
  size: number; // Based on content length or connections
  connections: number; // Number of links
  color: string;
  emoji?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'link' | 'parent-child' | 'backlink';
  weight: number; // Strength of connection
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Build graph data from notes
 */
export function buildGraphFromNotes(notes: Note[]): GraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeMap = new Map<string, GraphNode>();

  // Create nodes
  notes.forEach(note => {
    const connections = (note.linkedNotes?.length || 0) + (note.backlinks?.length || 0);
    
    const node: GraphNode = {
      id: note.id,
      label: note.title || 'Untitled',
      title: note.title || 'Untitled',
      type: getNodeType(note.type),
      size: calculateNodeSize(note, connections),
      connections,
      color: getNodeColor(note.type),
      emoji: note.emoji,
    };

    nodes.push(node);
    nodeMap.set(note.id, node);
  });

  // Create edges for linked notes
  notes.forEach(note => {
    // Bi-directional links
    note.linkedNotes?.forEach(linkedId => {
      if (nodeMap.has(linkedId)) {
        edges.push({
          id: `${note.id}-${linkedId}`,
          source: note.id,
          target: linkedId,
          type: 'link',
          weight: 1,
        });
      }
    });

    // Parent-child relationships
    if (note.parentNoteId && nodeMap.has(note.parentNoteId)) {
      edges.push({
        id: `${note.parentNoteId}-${note.id}-parent`,
        source: note.parentNoteId,
        target: note.id,
        type: 'parent-child',
        weight: 2,
      });
    }
  });

  return { nodes, edges };
}

/**
 * Get node type category
 */
function getNodeType(type: string): GraphNode['type'] {
  if (type === 'document') return 'document';
  if (type === 'meeting_notes') return 'meeting_notes';
  if (type === 'project_plan') return 'project_plan';
  if (['flowchart', 'mindmap', 'whiteboard', 'mermaid_diagram'].includes(type)) {
    return 'diagram';
  }
  return 'other';
}

/**
 * Calculate node size based on content and connections
 */
function calculateNodeSize(note: Note, connections: number): number {
  const baseSize = 10;
  const contentSize = JSON.stringify(note.content).length / 1000; // Rough content size
  const connectionBonus = connections * 2;
  
  return Math.min(baseSize + contentSize + connectionBonus, 50);
}

/**
 * Get node color based on type
 */
function getNodeColor(type: string): string {
  const colors: Record<string, string> = {
    document: '#3b82f6',      // blue
    meeting_notes: '#8b5cf6', // purple
    project_plan: '#10b981',  // green
    flowchart: '#f59e0b',     // amber
    mindmap: '#ec4899',       // pink
    whiteboard: '#6366f1',    // indigo
    mermaid_diagram: '#14b8a6', // teal
  };

  return colors[type] || '#6b7280'; // gray default
}

/**
 * Filter graph by search query
 */
export function filterGraph(graph: GraphData, query: string): GraphData {
  if (!query) return graph;

  const lowerQuery = query.toLowerCase();
  const matchingNodes = graph.nodes.filter(node =>
    node.title.toLowerCase().includes(lowerQuery)
  );

  const matchingNodeIds = new Set(matchingNodes.map(n => n.id));

  // Include edges that connect matching nodes
  const matchingEdges = graph.edges.filter(
    edge => matchingNodeIds.has(edge.source) && matchingNodeIds.has(edge.target)
  );

  return {
    nodes: matchingNodes,
    edges: matchingEdges,
  };
}

/**
 * Get subgraph around a specific note
 */
export function getSubgraph(graph: GraphData, noteId: string, depth: number = 2): GraphData {
  const visitedNodes = new Set<string>();
  const includedEdges = new Set<string>();

  function traverse(currentId: string, currentDepth: number) {
    if (currentDepth > depth || visitedNodes.has(currentId)) return;
    
    visitedNodes.add(currentId);

    // Find connected nodes
    graph.edges.forEach(edge => {
      if (edge.source === currentId) {
        includedEdges.add(edge.id);
        traverse(edge.target, currentDepth + 1);
      } else if (edge.target === currentId) {
        includedEdges.add(edge.id);
        traverse(edge.source, currentDepth + 1);
      }
    });
  }

  traverse(noteId, 0);

  return {
    nodes: graph.nodes.filter(n => visitedNodes.has(n.id)),
    edges: graph.edges.filter(e => includedEdges.has(e.id)),
  };
}

/**
 * Get isolated nodes (no connections)
 */
export function getIsolatedNodes(graph: GraphData): GraphNode[] {
  const connectedNodes = new Set<string>();
  
  graph.edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  return graph.nodes.filter(node => !connectedNodes.has(node.id));
}

/**
 * Get clusters/groups of connected notes
 */
export function getClusters(graph: GraphData): GraphNode[][] {
  const visited = new Set<string>();
  const clusters: GraphNode[][] = [];

  function dfs(nodeId: string, cluster: GraphNode[]) {
    if (visited.has(nodeId)) return;
    
    visited.add(nodeId);
    const node = graph.nodes.find(n => n.id === nodeId);
    if (node) cluster.push(node);

    graph.edges.forEach(edge => {
      if (edge.source === nodeId) {
        dfs(edge.target, cluster);
      } else if (edge.target === nodeId) {
        dfs(edge.source, cluster);
      }
    });
  }

  graph.nodes.forEach(node => {
    if (!visited.has(node.id)) {
      const cluster: GraphNode[] = [];
      dfs(node.id, cluster);
      if (cluster.length > 0) {
        clusters.push(cluster);
      }
    }
  });

  return clusters.sort((a, b) => b.length - a.length);
}

/**
 * Calculate graph statistics
 */
export function calculateGraphStats(graph: GraphData) {
  const totalNodes = graph.nodes.length;
  const totalEdges = graph.edges.length;
  const isolatedNodes = getIsolatedNodes(graph).length;
  const clusters = getClusters(graph);
  
  const averageConnections = totalNodes > 0
    ? graph.nodes.reduce((sum, n) => sum + n.connections, 0) / totalNodes
    : 0;

  const mostConnected = [...graph.nodes].sort((a, b) => b.connections - a.connections)[0];

  return {
    totalNodes,
    totalEdges,
    isolatedNodes,
    clusterCount: clusters.length,
    averageConnections: Math.round(averageConnections * 10) / 10,
    mostConnectedNote: mostConnected,
  };
}
