// Mindmap editor using React Flow with custom layout
'use client';

import { FC, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Panel,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/Button';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import dagre from 'dagre';

interface MindmapEditorProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onChange?: (nodes: Node[], edges: Edge[]) => void;
  readOnly?: boolean;
}

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, ranksep: 150, nodesep: 100 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 172, height: 36 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - 86,
      y: nodeWithPosition.y - 18,
    };
  });

  return { nodes, edges };
};

export const MindmapEditor: FC<MindmapEditorProps> = ({
  initialNodes = [],
  initialEdges = [],
  onChange,
  readOnly = false,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (nodes.length === 0) {
      // Create initial root node
      const rootNode: Node = {
        id: 'root',
        type: 'default',
        position: { x: 0, y: 0 },
        data: { label: 'Central Idea' },
        style: {
          background: '#8b5cf6',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          border: '2px solid #7c3aed',
        },
      };
      setNodes([rootNode]);
    }
  }, [nodes.length, setNodes]);

  const addChildNode = useCallback(() => {
    const parentId = selectedNodeId || 'root';
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'default',
      position: { x: 0, y: 0 },
      data: { label: 'New Idea' },
      style: {
        background: '#3b82f6',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
    };

    const newEdge: Edge = {
      id: `edge-${Date.now()}`,
      source: parentId,
      target: newNode.id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#94a3b8', strokeWidth: 2 },
    };

    const newNodes = [...nodes, newNode];
    const newEdges = [...edges, newEdge];

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges,
      'LR'
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    onChange?.(layoutedNodes, layoutedEdges);
  }, [selectedNodeId, nodes, edges, onChange, setNodes, setEdges]);

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNodeId || selectedNodeId === 'root') return;

    // Get all descendant nodes
    const nodesToDelete = new Set([selectedNodeId]);
    const getDescendants = (nodeId: string) => {
      edges.forEach((edge) => {
        if (edge.source === nodeId && !nodesToDelete.has(edge.target)) {
          nodesToDelete.add(edge.target);
          getDescendants(edge.target);
        }
      });
    };
    getDescendants(selectedNodeId);

    const newNodes = nodes.filter((node) => !nodesToDelete.has(node.id));
    const newEdges = edges.filter(
      (edge) => !nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target)
    );

    setNodes(newNodes);
    setEdges(newEdges);
    onChange?.(newNodes, newEdges);
    setSelectedNodeId(null);
  }, [selectedNodeId, nodes, edges, onChange, setNodes, setEdges]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        nodesDraggable={!readOnly}
        elementsSelectable={!readOnly}
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />

        {!readOnly && (
          <Panel position="top-left" className="flex flex-col sm:flex-row gap-1 sm:gap-2">
            <Button onClick={addChildNode} size="sm" className="touch-manipulation text-xs sm:text-sm">
              <PlusIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              Add Branch
            </Button>
            {selectedNodeId && selectedNodeId !== 'root' && (
              <Button onClick={deleteSelectedNode} size="sm" variant="danger" className="touch-manipulation text-xs sm:text-sm">
                <TrashIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Delete
              </Button>
            )}
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

// Fix useState import
import { useState } from 'react';
