// src/components/templates/AdminProjectManagementTemplate.js
import React from 'react';
import SectionHeader from '../organisms/SectionHeader';
import LibraryTable from '../organisms/LibraryTable';
import Pagination from '../organisms/Pagination';
import ModalConfirmation from '../molecules/ModalConfirmation';

const AdminProjectManagementTemplate = ({
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
    handleUserFilterChange,
    handleStartDateChange,
    handleEndDateChange,
    users,
    startDate,
    endDate,
    selectedUser,
    isLoading // Terima isLoading
}) => (
    <section className="p-3 sm:p-5">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12 border-none">
            <div className="bg-white dark:bg-gray-800 relative shadow-none sm:rounded-xl overflow-hidden rounded-xl border-none">
                <SectionHeader title="Admin Project Management" onSearchChange={handleSearchChange} isLoading={isLoading}> {/* Teruskan isLoading */}
                    <div className="flex flex-col items-start mt-4 md:mt-0 md:flex-row md:items-center flex-1 md:justify-end space-y-3 md:space-y-0 md:space-x-3">
                        <select
                            id="user-filter"
                            onChange={handleUserFilterChange}
                            value={selectedUser}
                            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Users</option>
                            {users.map(user => (
                                <option key={user.userId} value={user.userId}>
                                    {user.nama_pegawai}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            id="start-date"
                            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleStartDateChange}
                            value={startDate}
                        />
                        <p>To</p>
                        <input
                            type="date"
                            id="end-date"
                            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleEndDateChange}
                            value={endDate}
                        />
                    </div>
                </SectionHeader>

                <div className="px-2 sm:px-10 py-2 bg-white dark:bg-gray-800 overflow-x-auto">
                    <LibraryTable
                        projects={projects}
                        currentPage={currentPage}
                        projectsPerPage={projectsPerPage}
                        handlePreviewClick={handlePreviewClick}
                        handleDeleteClick={handleDeleteClick}
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

export default AdminProjectManagementTemplate;