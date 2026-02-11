import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import EntityNode from '../components/EntityNode';
import RelationshipEdge from '../components/RelationshipEdge';
import EntityEditor from '../components/EntityEditor';
import RelationshipEditor from '../components/RelationshipEditor';
import { useNavigation } from '../context/NavigationContext';
import { diagramAPI } from '../services/api';

const nodeTypes = {
  entity: EntityNode,
};

const edgeTypes = {
  relationship: RelationshipEdge,
};

function DiagramEditorScreen() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const { getCurrentFunction } = useNavigation();

  // Parse diagram ID from URL
  const getDiagramIdFromPath = () => {
    const match = location.pathname.match(/\/diagrams\/(\d+)/);
    return match ? match[1] : null;
  };

  const diagramId = params.diagramId || getDiagramIdFromPath();
  const func = getCurrentFunction();

  // Diagram state
  const [diagramData, setDiagramData] = useState(null);
  const [savingStatus, setSavingStatus] = useState('saved'); // 'saved', 'saving', 'error'
  const [isLoadingDiagram, setIsLoadingDiagram] = useState(true);

  // ReactFlow state
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedEdges, setSelectedEdges] = useState([]);

  // Editor state
  const [editingEntity, setEditingEntity] = useState(null);
  const [editingRelationship, setEditingRelationship] = useState(null);
  const [showEntityEditor, setShowEntityEditor] = useState(false);
  const [showRelationshipEditor, setShowRelationshipEditor] = useState(false);

  // Track if we're currently loading to prevent auto-save
  const isLoadingRef = useRef(false);

  // Load diagram data
  useEffect(() => {
    if (diagramId && diagramId !== 'new') {
      loadDiagram();
    } else {
      setIsLoadingDiagram(false);
    }
  }, [diagramId]);

  const loadDiagram = async () => {
    try {
      isLoadingRef.current = true;
      setIsLoadingDiagram(true);
      console.log('Loading diagram:', diagramId);
      const diagram = await diagramAPI.getById(diagramId);
      console.log('Diagram loaded:', diagram);
      setDiagramData(diagram);
      
      // Load nodes and edges from diagram content
      if (diagram.content) {
        if (diagram.content.nodes && diagram.content.nodes.length > 0) {
          setNodes(diagram.content.nodes);
          console.log('Loaded nodes:', diagram.content.nodes.length);
        }
        if (diagram.content.edges && diagram.content.edges.length > 0) {
          setEdges(diagram.content.edges);
          console.log('Loaded edges:', diagram.content.edges.length);
        }
      }
    } catch (error) {
      console.error('Error loading diagram:', error);
      alert('Failed to load diagram: ' + error.message);
    } finally {
      setIsLoadingDiagram(false);
      // Small delay to ensure state is settled
      setTimeout(() => {
        isLoadingRef.current = false;
      }, 500);
    }
  };

  // Auto-save function
  const saveDiagram = async () => {
    if (!diagramId || diagramId === 'new' || isLoadingRef.current) return;
    
    try {
      setSavingStatus('saving');
      console.log('Saving diagram:', diagramId, 'with', nodes.length, 'nodes and', edges.length, 'edges');
      await diagramAPI.saveContent(diagramId, nodes, edges);
      setSavingStatus('saved');
      console.log('✅ Diagram saved successfully');
    } catch (error) {
      console.error('Error saving diagram:', error);
      setSavingStatus('error');
    }
  };

  // Auto-save when nodes or edges change (debounced)
  useEffect(() => {
    if (diagramId && diagramId !== 'new' && !isLoadingDiagram && !isLoadingRef.current) {
      const timer = setTimeout(() => {
        saveDiagram();
      }, 2000); // Save 2 seconds after last change
      
      return () => clearTimeout(timer);
    }
  }, [nodes, edges, diagramId, isLoadingDiagram]);

  // Node change handlers
  const onNodesChange = useCallback(
    (changes) => {
      console.log('Nodes changing:', changes);
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes) => {
      console.log('Edges changing:', changes);
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );

  const onConnect = useCallback(
    (connection) => {
      console.log('Creating connection:', connection);
      const edge = {
        ...connection,
        type: 'relationship',
        data: {
          cardinality: '1:N',
          type: 'non-identifying',
          name: 'relates to'
        }
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    []
  );

  // Selection handlers
  const onSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges }) => {
    setSelectedNodes(selectedNodes);
    setSelectedEdges(selectedEdges);
  }, []);

  // Add new entity
  const handleAddEntity = () => {
    // Calculate grid position based on number of existing nodes
    const nodesPerRow = 3;
    const row = Math.floor(nodes.length / nodesPerRow);
    const col = nodes.length % nodesPerRow;
    
    const gridSpacingX = 350;
    const gridSpacingY = 250;
    const startX = 100;
    const startY = 100;
    
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'entity',
      position: { 
        x: startX + (col * gridSpacingX), 
        y: startY + (row * gridSpacingY) 
      },
      data: {
        name: `Entity_${nodes.length + 1}`,
        description: '',
        columns: [
          {
            name: 'id',
            type: 'INTEGER',
            isPrimaryKey: true,
            isNullable: false,
            isForeignKey: false,
          }
        ]
      }
    };
    
    console.log('Adding new entity:', newNode);
    setNodes((nds) => [...nds, newNode]);
    
    // Open editor for the new entity
    setEditingEntity(newNode);
    setShowEntityEditor(true);
  };

  // Edit entity
  const handleEditEntity = (node) => {
    console.log('Editing entity:', node);
    setEditingEntity(node);
    setShowEntityEditor(true);
  };

  // Delete selected nodes
  const handleDeleteSelected = () => {
    if (selectedNodes.length === 0 && selectedEdges.length === 0) return;
    
    if (!confirm(`Delete ${selectedNodes.length} entities and ${selectedEdges.length} relationships?`)) {
      return;
    }
    
    const nodeIds = selectedNodes.map(n => n.id);
    const edgeIds = selectedEdges.map(e => e.id);
    
    console.log('Deleting nodes:', nodeIds, 'and edges:', edgeIds);
    
    setNodes((nds) => nds.filter(n => !nodeIds.includes(n.id)));
    setEdges((eds) => {
      return eds.filter(e => 
        !edgeIds.includes(e.id) && 
        !nodeIds.includes(e.source) && 
        !nodeIds.includes(e.target)
      );
    });
    
    setSelectedNodes([]);
    setSelectedEdges([]);
  };

  // Save entity changes
  const handleSaveEntity = (updatedData) => {
    console.log('Saving entity with data:', updatedData);
    
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === editingEntity.id) {
          console.log('Updating node:', node.id, 'with new data');
          return { ...node, data: updatedData };
        }
        return node;
      })
    );
    
    setShowEntityEditor(false);
    setEditingEntity(null);
  };

  // Edit relationship
  const handleEditRelationship = (edge) => {
    console.log('Editing relationship:', edge);
    setEditingRelationship(edge);
    setShowRelationshipEditor(true);
  };

  // Save relationship changes
  const handleSaveRelationship = (updatedData) => {
    console.log('Saving relationship with data:', updatedData);
    
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === editingRelationship.id) {
          console.log('Updating edge:', edge.id, 'with new data');
          return { ...edge, data: updatedData };
        }
        return edge;
      })
    );
    
    setShowRelationshipEditor(false);
    setEditingRelationship(null);
  };

  // Export handlers
  const handleExportJSON = () => {
    const data = {
      diagram: {
        id: diagramId,
        name: diagramData?.name || 'Untitled Diagram',
        nodes,
        edges,
        exportedAt: new Date().toISOString()
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagram-${diagramId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          
          if (data.diagram && data.diagram.nodes && data.diagram.edges) {
            if (nodes.length > 0 || edges.length > 0) {
              if (!confirm('This will replace your current diagram. Continue?')) {
                return;
              }
            }
            
            setNodes(data.diagram.nodes);
            setEdges(data.diagram.edges);
            console.log('Imported diagram:', data.diagram.nodes.length, 'nodes,', data.diagram.edges.length, 'edges');
            alert('Diagram imported successfully!');
          } else {
            alert('Invalid diagram file format');
          }
        } catch (error) {
          console.error('Import error:', error);
          alert('Failed to import diagram: ' + error.message);
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  const handleExportDDL = () => {
    let ddl = `-- Database Schema DDL\n`;
    ddl += `-- Generated from Diagram: ${diagramData?.name || 'Untitled'}\n`;
    ddl += `-- Date: ${new Date().toISOString()}\n\n`;
    
    nodes.forEach(node => {
      const { name, columns } = node.data;
      ddl += `CREATE TABLE ${name} (\n`;
      
      const columnDefs = columns.map(col => {
        let def = `  ${col.name} ${col.type}`;
        if (col.isPrimaryKey) def += ' PRIMARY KEY';
        if (!col.isNullable) def += ' NOT NULL';
        return def;
      });
      
      ddl += columnDefs.join(',\n');
      ddl += '\n);\n\n';
    });

    // Add foreign key constraints
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        ddl += `-- Relationship: ${sourceNode.data.name} -> ${targetNode.data.name}\n`;
        ddl += `ALTER TABLE ${sourceNode.data.name} ADD CONSTRAINT fk_${sourceNode.data.name}_${targetNode.data.name}\n`;
        ddl += `  FOREIGN KEY (${targetNode.data.name}_id) REFERENCES ${targetNode.data.name}(id);\n\n`;
      }
    });

    const blob = new Blob([ddl], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schema-${diagramId}-${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Shared helper: compute tight bounding box across all nodes ──
  const getNodeBounds = () => {
    const PADDING = 60;
    const NODE_WIDTH = 300;
    const HEADER_H = 48;
    const ROW_H = 32;

    if (!nodes.length) return null;

    const nodeHeights = {};
    nodes.forEach(node => {
      const cols = node.data.columns?.length || 0;
      nodeHeights[node.id] = HEADER_H + Math.max(cols, 1) * ROW_H + 16;
    });

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(node => {
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + NODE_WIDTH);
      maxY = Math.max(maxY, node.position.y + nodeHeights[node.id]);
    });

    return {
      nodeHeights,
      minX, minY, maxX, maxY,
      width:  (maxX - minX) + PADDING * 2,
      height: (maxY - minY) + PADDING * 2,
      ox: -minX + PADDING,
      oy: -minY + PADDING,
      NODE_WIDTH,
      HEADER_H,
      ROW_H,
      PADDING,
    };
  };

  // ── SVG string builder (shared by SVG export and PNG/JPEG rasteriser) ──
  const buildSVGString = (b) => {
    const { nodeHeights, ox, oy, width, height, NODE_WIDTH, HEADER_H, ROW_H } = b;
    const FONT = 'system-ui,-apple-system,sans-serif';
    const escSvg = (s) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

    const parts = [];
    parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`);
    parts.push(`<defs>
  <filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#00000018"/></filter>
  <marker id="arr" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
    <polygon points="0 0,10 3.5,0 7" fill="#6366f1"/>
  </marker>
  ${nodes.map(n => `<linearGradient id="g${n.id}" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#7c3aed"/>
    <stop offset="100%" stop-color="#6366f1"/>
  </linearGradient>`).join('')}
</defs>`);

    // Background
    parts.push(`<rect width="${width}" height="${height}" fill="#f1f5f9"/>`);

    // Edges
    edges.forEach(edge => {
      const src = nodes.find(n => n.id === edge.source);
      const tgt = nodes.find(n => n.id === edge.target);
      if (!src || !tgt) return;

      const x1 = src.position.x + ox + NODE_WIDTH;
      const y1 = src.position.y + oy + nodeHeights[src.id] / 2;
      const x2 = tgt.position.x + ox;
      const y2 = tgt.position.y + oy + nodeHeights[tgt.id] / 2;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const card  = escSvg(edge.data?.cardinality || '1:N');
      const label = escSvg(edge.data?.name || '');

      parts.push(`<path d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}" fill="none" stroke="#6366f1" stroke-width="2" stroke-dasharray="6,3" marker-end="url(#arr)"/>`);

      const bw = 56, bh = label ? 30 : 22;
      parts.push(`<rect x="${mx - bw/2}" y="${my - bh/2}" width="${bw}" height="${bh}" rx="6" fill="white" stroke="#6366f1" stroke-width="1.5" filter="url(#sh)"/>`);
      parts.push(`<text x="${mx}" y="${my - (label ? 4 : -7)}" font-family="${FONT}" font-size="10" font-weight="700" fill="#4f46e5" text-anchor="middle">${card}</text>`);
      if (label) parts.push(`<text x="${mx}" y="${my + 10}" font-family="${FONT}" font-size="9" fill="#6b7280" text-anchor="middle">${label}</text>`);
    });

    // Nodes
    nodes.forEach(node => {
      const x  = node.position.x + ox;
      const y  = node.position.y + oy;
      const nh = nodeHeights[node.id];
      const cols = node.data.columns || [];

      // Card
      parts.push(`<rect x="${x}" y="${y}" width="${NODE_WIDTH}" height="${nh}" rx="10" fill="white" stroke="#e2e8f0" stroke-width="1.5" filter="url(#sh)"/>`);

      // Header
      parts.push(`<rect x="${x}" y="${y}" width="${NODE_WIDTH}" height="${HEADER_H}" rx="10" fill="url(#g${node.id})"/>`);
      parts.push(`<rect x="${x}" y="${y + HEADER_H - 10}" width="${NODE_WIDTH}" height="10" fill="url(#g${node.id})"/>`);

      // Entity name
      parts.push(`<text x="${x + 16}" y="${y + 31}" font-family="${FONT}" font-size="15" font-weight="700" fill="white">${escSvg(node.data.name)}</text>`);

      // Column rows
      cols.forEach((col, i) => {
        const ry = y + HEADER_H + i * ROW_H;
        if (i < cols.length - 1) {
          parts.push(`<line x1="${x+12}" y1="${ry + ROW_H}" x2="${x + NODE_WIDTH - 12}" y2="${ry + ROW_H}" stroke="#f1f5f9" stroke-width="1"/>`);
        }

        // Icon
        if (col.isPrimaryKey) {
          parts.push(`<text x="${x+12}" y="${ry+22}" font-size="13">🔑</text>`);
        } else if (col.isForeignKey) {
          parts.push(`<text x="${x+12}" y="${ry+22}" font-size="13">🔗</text>`);
        } else {
          parts.push(`<circle cx="${x+19}" cy="${ry+16}" r="3" fill="#d1d5db"/>`);
        }

        // Column name
        parts.push(`<text x="${x+34}" y="${ry+21}" font-family="${FONT}" font-size="12" fill="#1e293b">${escSvg(col.name)}</text>`);

        // Type badge
        const tw = Math.max(escSvg(col.type).length * 7 + 14, 64);
        const tx = x + NODE_WIDTH - tw - 8;
        parts.push(`<rect x="${tx}" y="${ry+6}" width="${tw}" height="20" rx="4" fill="#f1f5f9"/>`);
        parts.push(`<text x="${tx + tw/2}" y="${ry+20}" font-family="${FONT}" font-size="10" fill="#64748b" text-anchor="middle">${escSvg(col.type)}</text>`);

        // NULL badge
        if (col.isNullable && !col.isPrimaryKey) {
          parts.push(`<rect x="${tx-42}" y="${ry+6}" width="36" height="20" rx="4" fill="#fef3c7"/>`);
          parts.push(`<text x="${tx-24}" y="${ry+20}" font-family="${FONT}" font-size="10" fill="#92400e" text-anchor="middle">NULL</text>`);
        }
      });
    });

    parts.push(`</svg>`);
    return parts.join('\n');
  };

  // Rasterise the SVG to canvas, then download as PNG
  const rasteriseSVG = (mimeType) => {
    return new Promise((resolve, reject) => {
      const b = getNodeBounds();
      if (!b) { reject(new Error('No entities to export.')); return; }

      const svgStr = buildSVGString(b);
      const scale = 2; // retina
      const img = new Image();
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width  = b.width  * scale;
        canvas.height = b.height * scale;
        const ctx = canvas.getContext('2d');
        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, b.width, b.height);
        URL.revokeObjectURL(url);
        canvas.toBlob(resolve, mimeType, 0.95);
      };
      img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
      img.src = url;
    });
  };

  const handleExportPNG = async () => {
    try {
      const blob = await rasteriseSVG('image/png');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagram-${diagramId}-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PNG export error:', error);
      alert('PNG export failed: ' + error.message);
    }
  };



  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && (selectedNodes.length > 0 || selectedEdges.length > 0)) {
        e.preventDefault();
        handleDeleteSelected();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleAddEntity();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDiagram();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        setSelectedNodes(nodes);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodes, selectedEdges, nodes]);

  // Loading screen
  if (isLoadingDiagram) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading diagram...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {diagramData?.name || (diagramId === 'new' ? 'New Data Model Diagram' : `Diagram #${diagramId}`)}
            </h1>
            <p className="text-sm text-gray-600">
              {func ? `${func.name} - Visual ER Diagram` : 'Data Model Editor'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Save Status */}
            <div className="flex items-center gap-2 text-sm">
              {savingStatus === 'saving' && (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  <span className="text-gray-600">Saving...</span>
                </>
              )}
              {savingStatus === 'saved' && (
                <>
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-600">Saved</span>
                </>
              )}
              {savingStatus === 'error' && (
                <>
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-600">Error saving</span>
                </>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              {nodes.length} entities • {edges.length} relationships
              {selectedNodes.length > 0 && (
                <span className="ml-2 text-indigo-600 font-semibold">
                  • {selectedNodes.length} selected
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddEntity}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Entity
              <span className="text-xs opacity-75">(Ctrl+E)</span>
            </button>

            <button
              onClick={handleDeleteSelected}
              disabled={selectedNodes.length === 0 && selectedEdges.length === 0}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
              <span className="text-xs opacity-75">(Del)</span>
            </button>

            <button
              onClick={saveDiagram}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Now
              <span className="text-xs opacity-75">(Ctrl+S)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleImportJSON}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
            >
              Import JSON
            </button>
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
            >
              Export JSON
            </button>
            <button
              onClick={handleExportDDL}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
            >
              Export DDL
            </button>
            <button
              onClick={handleExportPNG}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
            >
              Export PNG
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-gray-100">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          onNodeDoubleClick={(event, node) => handleEditEntity(node)}
          onEdgeDoubleClick={(event, edge) => handleEditRelationship(edge)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          attributionPosition="bottom-left"
          defaultEdgeOptions={{
            type: 'relationship',
            animated: false,
          }}
        >
          <Background color="#94a3b8" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={() => '#6366f1'}
            className="bg-white border border-gray-200"
          />
        </ReactFlow>
      </div>

      {/* Entity Editor Modal */}
      {showEntityEditor && editingEntity && (
        <EntityEditor
          entity={editingEntity.data}
          onSave={handleSaveEntity}
          onClose={() => {
            setShowEntityEditor(false);
            setEditingEntity(null);
          }}
        />
      )}

      {/* Relationship Editor Modal */}
      {showRelationshipEditor && editingRelationship && (
        <RelationshipEditor
          relationship={editingRelationship.data}
          sourceNode={nodes.find(n => n.id === editingRelationship.source)}
          targetNode={nodes.find(n => n.id === editingRelationship.target)}
          onSave={handleSaveRelationship}
          onClose={() => {
            setShowRelationshipEditor(false);
            setEditingRelationship(null);
          }}
        />
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-lg p-3 text-xs shadow-lg">
        <div className="font-semibold text-gray-900 mb-2">⌨️ Keyboard Shortcuts</div>
        <div className="space-y-1 text-gray-600">
          <div><kbd className="px-1 py-0.5 bg-gray-100 rounded border border-gray-300">Ctrl+E</kbd> Add Entity</div>
          <div><kbd className="px-1 py-0.5 bg-gray-100 rounded border border-gray-300">Del</kbd> Delete Selected</div>
          <div><kbd className="px-1 py-0.5 bg-gray-100 rounded border border-gray-300">Ctrl+S</kbd> Save</div>
          <div><kbd className="px-1 py-0.5 bg-gray-100 rounded border border-gray-300">Ctrl+A</kbd> Select All</div>
          <div><kbd className="px-1 py-0.5 bg-gray-100 rounded border border-gray-300">Double Click</kbd> Edit</div>
        </div>
      </div>
    </div>
  );
}

export default DiagramEditorScreen;