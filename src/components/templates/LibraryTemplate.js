// src/components/templates/LibraryTemplate.js
import React from 'react';
import SectionHeader from '../organisms/SectionHeader';
import LibraryTable from '../organisms/LibraryTable';
import Pagination from '../organisms/Pagination';
import ModalConfirmation from '../molecules/ModalConfirmation';

const LibraryTemplate = ({
  projects,
  currentPage,
  projectsPerPage,
  totalProjects,
  searchTerm,
  deleteModalOpen,
  projectToDelete,
  handlePreviewClick,
  handleDeleteClick,
  handleSearchChange,
  handlePageChange,
  handleDeleteConfirm,
  handleDeleteCancel,
  isLoading, // Tambahkan isLoading
}) => (
  <section className="p-3 sm:p-5">
    <div className="mx-auto max-w-screen-xl px-4 lg:px-12 border-none">
      <div className="bg-white dark:bg-gray-800 relative shadow-none sm:rounded-xl overflow-hidden rounded-xl border-none">

        <SectionHeader title="Library Transmittal" onSearchChange={handleSearchChange} className="ml-30" isLoading={isLoading} /> {/* Teruskan isLoading */}

        <div className="px-1 sm:px-10 py-0 bg-white border-none ">
          <LibraryTable
            projects={projects}
            currentPage={currentPage}
            projectsPerPage={projectsPerPage}
            handlePreviewClick={handlePreviewClick}
            handleDeleteClick={handleDeleteClick}
            isLoading={isLoading}
          />
        </div>
        <Pagination
          currentPage={currentPage}
          usersPerPage={projectsPerPage}
          totalUsers={totalProjects}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>

    <ModalConfirmation
      isOpen={deleteModalOpen}
      icon="exclamation-triangle"
      title={`Hapus project ${projectToDelete?.projectName}?`}
      message={`Data yang dihapus tidak dapat dikembalikan.`}
      onConfirm={handleDeleteConfirm}
      onCancel={handleDeleteCancel}
      confirmText="Ya, Hapus"
    />
  </section>
);

export default LibraryTemplate;