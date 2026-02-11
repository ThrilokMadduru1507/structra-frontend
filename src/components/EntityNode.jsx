import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function EntityNode({ data, selected }) {
  const { name, description, columns = [] } = data;

  return (
    <div className={`bg-white rounded-lg shadow-lg border-2 transition-all min-w-[280px] ${
      selected ? 'border-indigo-500 shadow-xl ring-2 ring-indigo-200' : 'border-gray-300'
    }`}>
      {/* Entity Header - Purple Gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-t-lg">
        <div className="flex items-center gap-2">
          {/* Database Icon */}
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
          </svg>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base truncate">{name || 'Untitled Entity'}</h3>
            {description && (
              <p className="text-xs text-purple-100 mt-0.5 truncate">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Columns List */}
      <div className="bg-white">
        {columns.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm px-4">
            No columns defined
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {columns.map((column, index) => (
              <ColumnRow key={index} column={column} />
            ))}
          </div>
        )}
      </div>

      {/* Connection Handles - Blue Dots */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
        style={{ left: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
        style={{ right: -6 }}
      />
    </div>
  );
}

function ColumnRow({ column }) {
  const { name, type, isPrimaryKey, isForeignKey, isNullable } = column;

  return (
    <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors">
      {/* Key Indicator */}
      <div className="flex-shrink-0 w-4">
        {isPrimaryKey && (
          <span className="text-base" title="Primary Key">🔑</span>
        )}
        {isForeignKey && !isPrimaryKey && (
          <span className="text-base" title="Foreign Key">🔗</span>
        )}
      </div>

      {/* Column Name */}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-gray-900 truncate block">
          {name}
        </span>
      </div>

      {/* Data Type - Right Aligned */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
          {type}
        </span>
        {/* NULL Indicator */}
        {isNullable && (
          <span className="text-xs text-gray-400 font-medium">
            NULL
          </span>
        )}
      </div>
    </div>
  );
}

export default memo(EntityNode);