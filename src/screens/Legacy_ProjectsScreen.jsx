import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import mockProjects from '../data/mockProjects';

function ProjectsScreen() {
  // State
  const [projects, setProjects] = useState(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Create project form state
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });

  // Filter projects based on search
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle project click
  const handleProjectClick = (project) => {
    alert(`Opening project: ${project.name}\n(Full project view coming in Phase 3!)`);
  };

  // Handle create project
  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      alert('Please enter a project name');
      return;
    }

    const project = {
      id: projects.length + 1,
      name: newProject.name,
      description: newProject.description,
      status: 'Draft',
      created: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      owner: 'Admin User',
      schemasCount: 0,
      mappingsCount: 0,
      color: ['indigo', 'blue', 'purple', 'green', 'orange'][Math.floor(Math.random() * 5)]
    };

    setProjects([...projects, project]);
    setIsCreateModalOpen(false);
    setNewProject({ name: '', description: '' });
    alert(`Project "${project.name}" created successfully!`);
  };

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Projects"
        description="Manage your data transformation projects. Create new projects or import existing ones."
        icon="📁"
        actions={[
          {
            label: 'Import',
            icon: '📥',
            onClick: () => alert('Import functionality coming soon!'),
            primary: false
          },
          {
            label: 'New Project',
            icon: '➕',
            onClick: () => setIsCreateModalOpen(true),
            primary: true
          }
        ]}
      />

      {/* Toolbar */}
      <div className="mb-6 flex items-center gap-4">
        {/* Search */}
        <div className="flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        // Empty State
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {searchQuery ? 'No projects found' : 'No Projects Yet'}
          </h2>
          <p className="text-gray-600 mb-6">
            {searchQuery 
              ? `No projects match "${searchQuery}"`
              : 'Create your first project to get started with data transformation design.'
            }
          </p>
          {!searchQuery && (
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Your First Project
            </Button>
          )}
        </div>
      ) : (
        // Projects Display
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-3'
        }>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredProjects.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewProject({ name: '', description: '' });
        }}
        title="Create New Project"
      >
        <div className="space-y-4">
          <Input
            label="Project Name"
            type="text"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            placeholder="e.g., Customer Data Migration"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Brief description of the project..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setIsCreateModalOpen(false);
                setNewProject({ name: '', description: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleCreateProject}
            >
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProjectsScreen;