// src/pages/myprojects/index.js

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import LibraryTemplate from '@/components/templates/LibraryTemplate';
import { decodeToken } from '@/utils/authHelpers';

import TransmittalDataPreviewModal from '@/components/molecules/TransmittalDataPreviewModal';
import { useRouter } from 'next/router';


const LibraryPage = () => {
    const router = useRouter();
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
     const [ocrResults, setOcrResults] = useState([])
    const [isLoading, setIsLoading] = useState(false); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeToken(token)
            setLoggedInUserId(decoded.userId);
        }
    }, []);


     useEffect(() => {
        fetchProjects();
    }, [currentPage, searchTerm, projectsPerPage, loggedInUserId]);


    useEffect(() => {
        if(projects.length > 0){
             fetchOcrResults();
        }
    }, [projects]);


    const fetchProjects = async () => {
      if(!loggedInUserId) return;
        setIsLoading(true); // Mulai loading
        try {
            const response = await fetch(`/api/projects?page=${currentPage}&limit=${projectsPerPage}&search=${searchTerm}&userId=${loggedInUserId}`);
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
             setIsLoading(false); // Selesai loading
        }
    };
      const fetchOcrResults = async () => {
           if(!loggedInUserId) return;
            setIsLoading(true); // Mulai loading
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
             setIsLoading(false); // Selesai loading
         }
    };


   const handlePreviewClick = (project) => {
     router.push({
           pathname: '/scanfile',
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
        <LibraryTemplate
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
            isLoading={isLoading} 
        />
    );
};

export default LibraryPage;