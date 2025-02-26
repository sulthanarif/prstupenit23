// src/pages/users/index.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import UserManagementTemplate from '@/components/templates/UserManagementTemplate';
import { decodeToken } from '@/utils/authHelpers';
import { useRouter } from 'next/router';

const UsersPage = () => {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalUsers, setTotalUsers] = useState(0);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [password, setPassword] = useState("");
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Tambahkan state isLoading


    const [editedUserData, setEditedUserData] = useState({
        ...selectedUser,
        password: password
    });


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
           const decoded = decodeToken(token)
           setLoggedInUserId(decoded.userId);
        }

    }, []);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm, usersPerPage]);


    const fetchUsers = async () => {
        setIsLoading(true); // Atur isLoading menjadi true sebelum pengambilan data
        try {
            const response = await fetch(`/api/users?page=${currentPage}&limit=${usersPerPage}&search=${searchTerm}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.length > 0) {
                setUsers(data.map(user => ({
                      ...user,
                      isCurrentUser: loggedInUserId === user.userId
                 })));
                setTotalUsers(data[0].total);
            } else {
                setUsers([]);
                setTotalUsers(0);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Terjadi kesalahan saat mengambil data user.", {
                duration: 5000,
                position: "top-center",
            });
        } finally {
            setIsLoading(false); // Atur isLoading menjadi false setelah selesai pengambilan data
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditedUserData({
            ...user,
             isCurrentUser: loggedInUserId === user.userId,
        });
        setOpenModal('update-modal');
    };
   
     const handleViewProjectsClick = (user) => {
          router.push({
              pathname: '/admin/AdminUserProjectsPage',
               query: {
                  userId: user.userId,
                   userName: user.nama_pegawai
                },
           });
    };
    const handleModalClose = () => {
        setOpenModal(null);
        setEditedUserData({
            ...selectedUser,
            password: ""
        });
        setSelectedUser(null);
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/users/${editedUserData.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: editedUserData.userId,
                    password: editedUserData.password,
                    email: editedUserData.email,
                    nomor_pegawai: editedUserData.nomor_pegawai,
                    nama_pegawai: editedUserData.nama_pegawai,
                    role: editedUserData.role,
                    email_verified: editedUserData.email_verified,
                }),
            });

            if (response.ok) {
                toast.success("User Berhasil di Update", {
                    duration: 5000,
                    position: "top-center",
                });
                fetchUsers();
                setOpenModal(null);
            } else {
                const errorData = await response.json();
                toast.error(errorData?.message || "Terjadi kesalahan, coba lagi.", {
                    duration: 5000,
                    position: "top-center",
                });
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Terjadi kesalahan, coba lagi.", {
                duration: 5000,
                position: "top-center",
            });
        }
    };


 const handleInputChangePassword = (e) => {
       const { value } = e.target;
        setPassword(value);
       setEditedUserData((prevData) => ({
         ...prevData,
          password: value,
       }));
  }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditedUserData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
         if(name == 'password'){
              handleInputChangePassword(e)
          }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`/api/users/${userToDelete.userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success("User Berhasil di Hapus", {
                    duration: 5000,
                    position: "top-center",
                });
                fetchUsers();
            } else {
                 const errorData = await response.json();
                toast.error(errorData?.message || "Terjadi kesalahan, coba lagi.", {
                    duration: 5000,
                     position: "top-center",
                });
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Terjadi kesalahan, coba lagi.", {
                duration: 5000,
                position: "top-center",
            });
        } finally {
            setDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setUserToDelete(null);
    };

    return (
        <UserManagementTemplate
            users={users}
            currentPage={currentPage}
            usersPerPage={usersPerPage}
            totalUsers={totalUsers}
            searchTerm={searchTerm}
            openModal={openModal}
      
            selectedUser={editedUserData}
            deleteModalOpen={deleteModalOpen}
            userToDelete={userToDelete}
             editedUserData={editedUserData}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            handleSearchChange={handleSearchChange}
            handlePageChange={handlePageChange}
            handleModalClose={handleModalClose}
            handleSubmit={handleSubmit}
             handleInputChange={handleInputChange}
            handleDeleteConfirm={handleDeleteConfirm}
            handleDeleteCancel={handleDeleteCancel}
            handleViewProjectsClick={handleViewProjectsClick}
            loggedInUserId={loggedInUserId}
            isLoading={isLoading} // Kirim isLoading
        />
    );
};

export default UsersPage;