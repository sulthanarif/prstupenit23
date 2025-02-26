// src/pages/projects/index.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminProjectManagementTemplate from '@/components/templates/AdminProjectManagementTemplate';
import { decodeToken } from '@/utils/authHelpers';
import UploadQueueModal from '@/components/molecules/UploadQueueModal';
import TransmittalDataPreviewModal from '@/components/molecules/TransmittalDataPreviewModal';

import { router } from 'next/router';


const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage, setProjectsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalProjects, setTotalProjects] = useState(0);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [uploadQueueModalOpen, setUploadQueueModalOpen] = useState(false);
    const [uploadQueueImages, setUploadQueueImages] = useState([]);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [ocrResults, setOcrResults] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [isLoading, setIsLoading] = useState(false); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeToken(token)
            setLoggedInUserId(decoded.userId);
        }
    }, []);


     useEffect(() => {
        fetchUsers();
        fetchProjects();
    }, [currentPage, searchTerm, projectsPerPage,loggedInUserId,selectedUser, startDate, endDate]);

    useEffect(() => {
        if(projects.length > 0){
            fetchOcrResults();
        }
     }, [projects]);

    const fetchUsers = async () => {
        setIsLoading(true); // Atur isLoading menjadi true sebelum pengambilan data
        try {
            const response = await fetch(`/api/users`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.length > 0) {
                setUsers(data);
            } else {
                setUsers([]);
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

    const fetchProjects = async () => {
        setIsLoading(true); // Atur isLoading menjadi true sebelum pengambilan data
        if(!loggedInUserId) return;
        try {
            let url = `/api/projects?page=${currentPage}&limit=${projectsPerPage}&search=${searchTerm}`;
             if (selectedUser) {
                 url += `&userId=${selectedUser}`;
            }

             if (startDate) {
                  url += `&startDate=${startDate}`;
             }

             if (endDate) {
                  url += `&endDate=${endDate}`;
            }


            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
              if (data.length > 0) {
                setProjects(data);
                setTotalProjects(data[0].total);
            } else {
                 setProjects([]);
                 setTotalProjects(0);
            }
        } catch (error) {
            console.error("Error fetching Projects:", error);
            toast.error("Terjadi kesalahan saat mengambil data project.", {
                duration: 5000,
                position: "top-center",
            });
        } finally {
            setIsLoading(false); // Atur isLoading menjadi false setelah selesai pengambilan data
        }
    };

    const fetchOcrResults = async () => {
        setIsLoading(true); // Atur isLoading menjadi true sebelum pengambilan data
        try {
              const projectIds = projects.map(project => project.projectId);
             const response = await fetch(`/api/getocrdatabyprojectid?projectIds=${JSON.stringify(projectIds)}`);
            if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.length > 0) {
                 setOcrResults(data);
             } else {
                setOcrResults([])
            }
         } catch (error) {
            console.error("Error fetching OCR Results:", error);
             toast.error("Terjadi kesalahan saat mengambil data OCR.", {
                duration: 5000,
                position: "top-center",
             });
         } finally {
            setIsLoading(false); // Atur isLoading menjadi false setelah selesai pengambilan data
        }
    };


    const handlePreviewClick = (project) => {
        router.push({
              pathname: '/admin/scanfile',
             query: {
                projectId: project.projectId
            },
         })
      };
     const handleClosePreviewModal = () => {
        setPreviewModalOpen(false);
        setSelectedProject(null);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

   const handleUserFilterChange = (e) => {
      setSelectedUser(e.target.value);
      setCurrentPage(1);
    };
   const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
       setCurrentPage(1);
   };
   const handleEndDateChange = (e) => {
       setEndDate(e.target.value);
        setCurrentPage(1);
    };

    const handleDeleteClick = (project) => {
        setProjectToDelete(project);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if(!projectToDelete) return;
        try {
            const response = await fetch(`/api/projects/${projectToDelete.projectId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success("Project Berhasil di Hapus", {
                    duration: 5000,
                    position: "top-center",
                });
                fetchProjects();
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
            setProjectToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setProjectToDelete(null);
    };

  const handleOpenUploadQueue = (images) => {
      setUploadQueueImages(images)
      setUploadQueueModalOpen(true);
  }

  const handleCloseUploadQueue = () => {
    setUploadQueueModalOpen(false);
    setUploadQueueImages([]);
  };
  const handleDeleteImageFromQueue = (index) => {
        const updatedImages = [...uploadQueueImages];
        updatedImages.splice(index, 1);
       setUploadQueueImages(updatedImages);
    };

    return (
       <AdminProjectManagementTemplate
           projects={projects}
            currentPage={currentPage}
            projectsPerPage={projectsPerPage}
            totalProjects={totalProjects}
            searchTerm={searchTerm}
            deleteModalOpen={deleteModalOpen}
            projectToDelete={projectToDelete}
            handlePreviewClick={handlePreviewClick}
            handleDeleteClick={handleDeleteClick}
            handleSearchChange={handleSearchChange}
            handlePageChange={handlePageChange}
            handleDeleteConfirm={handleDeleteConfirm}
            handleDeleteCancel={handleDeleteCancel}
           handleUserFilterChange={handleUserFilterChange}
           handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
           users={users}
            startDate={startDate}
           endDate={endDate}
           selectedUser={selectedUser}
            isLoading={isLoading} 
        >
        
                <UploadQueueModal
                isOpen={uploadQueueModalOpen}
                images={uploadQueueImages}
                onClose={handleCloseUploadQueue}
                onDeleteImage={handleDeleteImageFromQueue}
              />
           <TransmittalDataPreviewModal
                isOpen={previewModalOpen}
                onClose={handleClosePreviewModal}
               selectedProject={selectedProject}
               ocrResults={ocrResults}
             />
        </AdminProjectManagementTemplate>
    );
};

export default ProjectsPage;