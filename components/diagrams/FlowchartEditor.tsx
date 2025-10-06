// Flowchart editor using React Flow
'use client';

import { FC, useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  useNodesState,
  useEdgesState,
  Panel,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/Button';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface FlowchartEditorProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onChange?: (nodes: Node[], edges: Edge[]) => void;
  readOnly?: boolean;
}

export const FlowchartEditor: FC<FlowchartEditorProps> = ({
  initialNodes = [],
  initialEdges = [],
  onChange,
  readOnly = false,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      onChange?.(nodes, newEdges);
    },
    [edges, nodes, onChange, setEdges]
  );

  const addNode = useCallback(
    (type: 'default' | 'input' | 'output') => {
      const newNode: Node = {
        id: `node-${Date.now()}`,
        type,
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { label: `New ${type} node` },
        style: {
          background: type === 'input' ? '#10b981' : type === 'output' ? '#ef4444' : '#3b82f6',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
        },
      };

      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      onChange?.(newNodes, edges);
    },
    [nodes, edges, onChange, setNodes]
  );

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNodeId) return;

    const newNodes = nodes.filter((node) => node.id !== selectedNodeId);
    const newEdges = edges.filter(
      (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId
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
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
        <MiniMap />
        
        {!readOnly && (
          <Panel position="top-left" className="flex flex-col sm:flex-row gap-1 sm:gap-2">
            <Button
              onClick={() => addNode('input')}
              size="sm"
              className="bg-green-600 hover:bg-green-700 touch-manipulation text-xs sm:text-sm"
            >
              <PlusIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              Start
            </Button>
            <Button
              onClick={() => addNode('default')}
              size="sm"
              className="touch-manipulation text-xs sm:text-sm"
            >
              <PlusIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              Process
            </Button>
            <Button
              onClick={() => addNode('output')}
              size="sm"
              className="bg-red-600 hover:bg-red-700 touch-manipulation text-xs sm:text-sm"
            >
              <PlusIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              End
            </Button>
            {selectedNodeId && (
              <Button
                onClick={deleteSelectedNode}
                size="sm"
                variant="danger"
                className="touch-manipulation text-xs sm:text-sm"
              >
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
