'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Note } from '@/lib/types';
import { 
  buildGraphFromNotes, 
  filterGraph, 
  getSubgraph, 
  calculateGraphStats,
  GraphData,
  GraphNode 
} from '@/lib/graph/graph-builder';
import ForceGraph2D from 'react-force-graph-2d';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  ArrowsPointingOutIcon,
  FunnelIcon 
} from '@heroicons/react/24/outline';

interface GraphViewProps {
  notes: Note[];
  currentNoteId?: string;
}

export default function GraphView({ notes, currentNoteId }: GraphViewProps) {
  const router = useRouter();
  const graphRef = useRef<any>();
  const [fullGraph, setFullGraph] = useState<GraphData>({ nodes: [], edges: [] });
  const [displayGraph, setDisplayGraph] = useState<GraphData>({ nodes: [], edges: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [showIsolated, setShowIsolated] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const graph = buildGraphFromNotes(notes);
    setFullGraph(graph);
    setDisplayGraph(graph);
    setStats(calculateGraphStats(graph));
  }, [notes]);

  useEffect(() => {
    if (focusMode && currentNoteId) {
      const subgraph = getSubgraph(fullGraph, currentNoteId, 2);
      setDisplayGraph(subgraph);
    } else if (searchQuery) {
      const filtered = filterGraph(fullGraph, searchQuery);
      setDisplayGraph(filtered);
    } else {
      setDisplayGraph(fullGraph);
    }
  }, [focusMode, currentNoteId, searchQuery, fullGraph]);

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    router.push(`/note/${node.id}`);
  };

  const handleNodeHover = (node: any) => {
    if (graphRef.current) {
      graphRef.current.centerAt(node?.x, node?.y, 1000);
    }
  };

  const handleZoomToFit = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
  };

  return (
    <div className="h-full w-full relative bg-gray-50 dark:bg-gray-900">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 space-y-3">
        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 w-80">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-80">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Graph Statistics
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Notes:</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.totalNodes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Connections:</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.totalEdges}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg. Links:</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.averageConnections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Clusters:</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.clusterCount}</span>
              </div>
              {stats.mostConnectedNote && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 text-xs">Most Connected:</span>
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {stats.mostConnectedNote.title}
                  </p>
                  <span className="text-xs text-gray-500">
                    {stats.mostConnectedNote.connections} links
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <Button
          onClick={handleZoomToFit}
          variant="secondary"
          size="sm"
          className="shadow-lg"
        >
          <ArrowsPointingOutIcon className="h-4 w-4 mr-2" />
          Fit to Screen
        </Button>
        
        {currentNoteId && (
          <Button
            onClick={() => setFocusMode(!focusMode)}
            variant={focusMode ? 'primary' : 'secondary'}
            size="sm"
            className="shadow-lg w-full"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            {focusMode ? 'Show All' : 'Focus Mode'}
          </Button>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
          Note Types
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">Document</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-gray-600 dark:text-gray-400">Meeting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-600 dark:text-gray-400">Project</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-gray-600 dark:text-gray-400">Diagram</span>
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="w-full h-full">
        <ForceGraph2D
          ref={graphRef}
          graphData={{
            nodes: displayGraph.nodes,
            links: displayGraph.edges.map(e => ({
              source: e.source,
              target: e.target,
              color: e.type === 'parent-child' ? '#10b981' : '#94a3b8',
            })),
          }}
          nodeId="id"
          nodeLabel={(node: any) => `
            <div style="background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${node.emoji || '📄'} ${node.title}</div>
              <div style="color: #94a3b8;">${node.connections} connection${node.connections !== 1 ? 's' : ''}</div>
            </div>
          `}
          nodeVal={(node: any) => node.size}
          nodeColor={(node: any) => node.id === currentNoteId ? '#ef4444' : node.color}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.label;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            
            // Draw node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size / 2, 0, 2 * Math.PI);
            ctx.fillStyle = node.id === currentNoteId ? '#ef4444' : node.color;
            ctx.fill();
            
            // Draw border for current note
            if (node.id === currentNoteId) {
              ctx.strokeStyle = '#fff';
              ctx.lineWidth = 2 / globalScale;
              ctx.stroke();
            }

            // Draw label if zoomed in enough
            if (globalScale > 1.5) {
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#fff';
              ctx.fillText(node.emoji || '📄', node.x, node.y);
            }

            // Draw title if zoomed in more
            if (globalScale > 3) {
              ctx.fillStyle = '#1f2937';
              ctx.fillText(label, node.x, node.y + node.size / 2 + 5 / globalScale);
            }
          }}
          linkWidth={2}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          cooldownTicks={100}
          onEngineStop={() => {
            if (graphRef.current) {
              graphRef.current.zoomToFit(400, 50);
            }
          }}
        />
      </div>

      {/* Empty State */}
      {displayGraph.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No notes match your search' : 'No notes to display'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
