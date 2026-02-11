function ProjectCard({ project, onClick }) {
  // Color variants for project cards
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    green: 'bg-green-100 text-green-800',
    orange: 'bg-orange-100 text-orange-800'
  };

  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Draft: 'bg-yellow-100 text-yellow-800',
    Archived: 'bg-gray-100 text-gray-800'
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        {/* Project Icon */}
        <div className={`w-10 h-10 rounded-lg ${colorClasses[project.color]} flex items-center justify-center text-lg font-bold`}>
          {project.name.charAt(0)}
        </div>

        {/* Status Badge */}
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 mb-2 text-lg">
        {project.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <span>📋</span>
          <span>{project.schemasCount} schemas</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🔗</span>
          <span>{project.mappingsCount} mappings</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {project.owner.charAt(0)}
          </div>
          <span className="text-xs text-gray-600">{project.owner}</span>
        </div>

        <span className="text-xs text-gray-400">
          {formatDate(project.lastModified)}
        </span>
      </div>
    </div>
  );
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString();
}

export default ProjectCard;