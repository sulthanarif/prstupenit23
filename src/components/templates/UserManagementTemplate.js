// src/components/templates/UserManagementTemplate.js
import React from 'react';
import SectionHeader from '../organisms/SectionHeader';
import UsersTable from '../organisms/UsersTable';
import Pagination from '../organisms/Pagination';
import UserModal from '../organisms/UserModal';
import ModalConfirmation from '../molecules/ModalConfirmation';

const UserManagementTemplate = ({
    users,
    currentPage,
    usersPerPage,
    totalUsers,
    searchTerm,
    openModal,
    selectedUser,
    deleteModalOpen,
    userToDelete,
    editedUserData,
    handleEditClick,
    handleDeleteClick,
    handleSearchChange,
    handlePageChange,
    handleModalClose,
    handleSubmit,
    handleInputChange,
    handleDeleteConfirm,
    handleDeleteCancel,
    loggedInUserId,
    isLoading // Terima isLoading
}) => (
    <section className="p-3 sm:p-5">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12 border-none">
        <div className="bg-white dark:bg-gray-800 relative shadow-none sm:rounded-xl overflow-hidden rounded-xl border-none">

        <SectionHeader title="Kelola Akun" onSearchChange={handleSearchChange} className="ml-30" isLoading={isLoading} /> {/* Teruskan isLoading */}

                <div className="px-1 sm:px-10 py-0 bg-white border-none "> 
                     <UsersTable
                         users={users}
                        currentPage={currentPage}
                         usersPerPage={usersPerPage}
                          handleEditClick={handleEditClick}
                        handleDeleteClick={handleDeleteClick}
                         loggedInUserId={loggedInUserId}
                     />
                </div>
                 <Pagination
                     currentPage={currentPage}
                    usersPerPage={usersPerPage}
                      totalUsers={totalUsers}
                      handlePageChange={handlePageChange}
                 />
            </div>
        </div>
       <UserModal
            isOpen={openModal === 'update-modal'}
             selectedUser={editedUserData}
             handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleModalClose={handleModalClose}
            title="Update User"
        />
         
        <ModalConfirmation
           isOpen={deleteModalOpen}
            icon="exclamation-triangle"
            title={`Hapus akun ${userToDelete?.nama_pegawai}?`}
             message={`Data yang dihapus tidak dapat dikembalikan.`}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            confirmText="Ya, Hapus"
         />
    </section>
);

export default UserManagementTemplate;