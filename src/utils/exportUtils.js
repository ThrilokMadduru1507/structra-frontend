import { toPng, toSvg } from 'html-to-image';

// Export diagram as PNG
export async function exportToPNG(reactFlowInstance, fileName, includeBackground = true) {
  try {
    const viewport = document.querySelector('.react-flow__viewport');
    if (!viewport) {
      throw new Error('Could not find diagram viewport');
    }

    const dataUrl = await toPng(viewport, {
      backgroundColor: includeBackground ? '#f9fafb' : 'transparent',
      quality: 1.0,
      pixelRatio: 2,
    });

    // Download
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();

    return { success: true };
  } catch (error) {
    console.error('Error exporting PNG:', error);
    return { success: false, error: error.message };
  }
}

// Export diagram as SVG
export async function exportToSVG(reactFlowInstance, fileName, includeBackground = true) {
  try {
    const viewport = document.querySelector('.react-flow__viewport');
    if (!viewport) {
      throw new Error('Could not find diagram viewport');
    }

    const dataUrl = await toSvg(viewport, {
      backgroundColor: includeBackground ? '#f9fafb' : 'transparent',
    });

    // Download
    const link = document.createElement('a');
    link.download = `${fileName}.svg`;
    link.href = dataUrl;
    link.click();

    return { success: true };
  } catch (error) {
    console.error('Error exporting SVG:', error);
    return { success: false, error: error.message };
  }
}

// Export diagram as JSON
export function exportToJSON(nodes, edges, fileName) {
  try {
    const diagramData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        label: edge.label,
        style: edge.style
      }))
    };

    const json = JSON.stringify(diagramData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = `${fileName}.json`;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Error exporting JSON:', error);
    return { success: false, error: error.message };
  }
}

// Generate SQL DDL from diagram
export function exportToDDL(nodes, edges, fileName) {
  try {
    let ddl = `-- SQL DDL Generated from Structra Studio\n`;
    ddl += `-- Generated at: ${new Date().toISOString()}\n`;
    ddl += `-- Total Entities: ${nodes.length}\n\n`;

    // Generate CREATE TABLE statements
    nodes.forEach(node => {
      const entity = node.data;
      ddl += `-- Table: ${entity.name}\n`;
      if (entity.description) {
        ddl += `-- Description: ${entity.description}\n`;
      }
      ddl += `CREATE TABLE ${entity.name} (\n`;

      // Columns
      const columns = entity.columns || [];
      const columnDefs = columns.map((col, index) => {
        let def = `    ${col.name} ${col.type}`;
        
        // Add constraints
        if (col.isPrimaryKey) {
          def += ' PRIMARY KEY';
        }
        if (!col.isNullable && !col.isPrimaryKey) {
          def += ' NOT NULL';
        }

        // Add comma except for last column
        if (index < columns.length - 1) {
          def += ',';
        }

        return def;
      });

      ddl += columnDefs.join('\n');
      ddl += '\n);\n\n';
    });

    // Add foreign key constraints based on edges
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        // Find FK column in target
        const fkColumn = targetNode.data.columns?.find(col => col.isForeignKey);
        const pkColumn = sourceNode.data.columns?.find(col => col.isPrimaryKey);
        
        if (fkColumn && pkColumn) {
          ddl += `-- Relationship: ${sourceNode.data.name} -> ${targetNode.data.name}\n`;
          ddl += `ALTER TABLE ${targetNode.data.name}\n`;
          ddl += `    ADD CONSTRAINT fk_${targetNode.data.name}_${sourceNode.data.name}\n`;
          ddl += `    FOREIGN KEY (${fkColumn.name})\n`;
          ddl += `    REFERENCES ${sourceNode.data.name}(${pkColumn.name});\n\n`;
        }
      }
    });

    // Download
    const blob = new Blob([ddl], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = `${fileName}.sql`;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Error generating DDL:', error);
    return { success: false, error: error.message };
  }
}

// Load diagram from JSON
export function loadFromJSON(jsonFile, onLoad) {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      
      if (!data.nodes || !data.edges) {
        throw new Error('Invalid diagram file format');
      }

      onLoad(data.nodes, data.edges);
    } catch (error) {
      console.error('Error loading JSON:', error);
      alert('Error loading diagram file: ' + error.message);
    }
  };

  reader.readAsText(jsonFile);
}