import React, { useEffect, useState } from 'react';

import './UserPage.css';
import { FaRegTrashAlt   } from 'react-icons/fa';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa';

const UserPage = () => {
    const [username, setUsername] = useState('');
    const [profileImageUrl, setprofileImageUrl] = useState('');

    const [collectionCount, setCollectionCount] = useState(0);
    const [generatedImagesCount, setGeneratedImagesCount] = useState(0);
    const [activeTab, setActiveTab] = useState('collections'); // State to track active tab

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const [collections, setCollections] = useState([]); 

    const [clickedCollectionId, setClickedCollectionId] = useState(null);
    const [collectionImages, setCollectionImages] = useState([]);

    const [clickedImageId, setClickedImageId] = useState(null);
    const [UserImages, setUserImages] = useState([]);
    const [selectedCollectionForImage, setSelectedCollectionForImage] = useState(null);

    const [isCreatingCollection, setIsCreatingCollection] = useState(false);

    const handleCollectionClick = async (event, collectionId) => {
        if (event.target.className === 'modal') {
            setClickedCollectionId(null);
            setCollectionImages([]); // Reset images when closing the modal
        } else {
            setClickedCollectionId(collectionId);
            await fetchCollectionImages(collectionId); // Fetch images for the clicked collection
        }
    };

    const openCreateModal = () => {
        setIsCreateModalVisible(true);
    };

    const handleBackdropClick = (event) => {
        // Using currentTarget ensures that this only triggers if you've actually clicked on the backdrop, not its children
        if (event.currentTarget === event.target) {
            setIsCreateModalVisible(false);
        }
    };

    useEffect(() => {
        // FUNCTION to select the user images

        if (sessionStorage.length == 0) {
            setUsername("Invité");
            setprofileImageUrl("https://img.freepik.com/vecteurs-premium/pigeon-effraye_79591-242.jpg");
        } else {
            const fetchUserProfileInformation = async () => {
                try {
                    // Fetch the images corresponding to the user from the backend API
                    const response = await fetch('http://localhost:3000/api/user/getUserProfileInformation', {
                        method: 'GET',
                        headers: { 
                        'Content-Type': 'application/json',
                        'User-ID': String(sessionStorage.getItem('userId'))
                        },
                    });

                    const responseData = await response.json(); // Wait for the JSON Promise to resolve

                    setUsername(responseData.username);
                    setprofileImageUrl(responseData.profile_photo);

                } catch (error) {
                    console.error(error);
                }
            }
            fetchUserProfileInformation();
        }
    }, []);

    const handleCreateCollection = async (e) => {
        e.preventDefault();
        setIsCreateModalVisible(false);
        try {
            const response = await fetch('http://localhost:3000/api/collection/createCollection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCollectionName, idCreator: String(sessionStorage.getItem('userId')) }),
            }); 
            if (!response.ok) {
                throw new Error('Failed to create collection');
            }

            const newCollection = await response.json();
            setFeedbackMessage(`Collection "${newCollection.name}" created successfully!`);
            // Refresh
            fetchCollections();
        } catch (error) {
            setFeedbackMessage(error.message);
        }
    };

    useEffect(() => {
        const fetchCollections = async () => {
            console.log(sessionStorage);
            try {
                const response = await fetch('http://localhost:3000/api/image/getUserCollection', {
                    method: 'GET',
                    headers: { 
                        'Content-Type': 'application/json',
                        'User-ID': String(sessionStorage.getItem('userId'))
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch collections');
                }
                const UserCollections = await response.json();
                setCollections(UserCollections);
                setCollectionCount(UserCollections.length);
            } catch (error) {
                console.error('Error fetching collections:', error);
            }
        };
    
        fetchCollections();
    }, []);

    const fetchCollectionImages = async (collectionId) => {
        try {
            const response = await fetch('http://localhost:3000/api/collection/getImagesOfCollection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collectionId: collectionId }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch collection images');
            }
    
            const images = await response.json();
            setCollectionImages(images);
        } catch (error) {
            console.error('Error fetching collection images:', error);
            setCollectionImages([]);
        }
    };
    

    useEffect(() => {
        // FUNCTION to select the user images
        const fetchImages = async () => {
            try {
                // Fetch the images corresponding to the user from the backend API
                const response = await fetch('http://localhost:3000/api/image/getUserHistoric', {
                    method: 'GET',
                    headers: { 
                    'Content-Type': 'application/json',
                    'User-ID': String(sessionStorage.getItem('userId'))
                    },
                });
                const UserImages = await response.json();
                const sortedUserImages = UserImages.sort((a, b) => b.id - a.id);

                setUserImages(sortedUserImages);
                setGeneratedImagesCount(UserImages.length);

            } catch (error) {
                console.error(error);
            }
        };

        fetchImages();
    }, []);

    
    const handleImageClick = async (event, id) => {
        // Check if the user clicked outside of the modal content
        if (event.target.className === 'modal') {
            setClickedImageId(null);
        } else {
            setClickedImageId(id);
        }
    };

    const handleDownload = async (src) => {
        // Fetch the image data
        const response = await fetch(src);
        const blob = await response.blob();

        // Create an object URL for the image data
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element and click it to start the download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'image.jpg'; // or any other filename you want
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleAddImageToCollection = async (imageId) => {
        if (!selectedCollectionForImage) {
            console.log("No collection selected");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/api/collection/addImageToCollection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collectionId: selectedCollectionForImage, imageId: imageId }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to add image to collection');
            }
    
            console.log("Image added to collection successfully");
            // Reset the selected collection
            setSelectedCollectionForImage(null);
            // Close the modal
            setClickedImageId(null);
        } catch (error) {
            console.error('Error adding image to collection:', error);
        }
    };

    const handleRemoveImageFromCollection = async (imageId) => {
        try {
            const response = await fetch('http://localhost:3000/api/collection/removeImageFromCollection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collectionId: clickedCollectionId, imageId: imageId }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to remove image from collection');
            }
    
            console.log("Image removed from collection successfully");
            // Optionally, refresh the collection images here
            await fetchCollectionImages(clickedCollectionId);
        } catch (error) {
            console.error('Error removing image from collection:', error);
        }
    };


    return (
        <div className="user-page">
            <div className="profile">
                <img src={profileImageUrl}
                    alt={username}
                    className="profile-pic" />
                <h1 className="username">{username}</h1>
                <p className="description">This is the user's profile description.</p>
                <div className="counts">
                    <div className="count-item">
                        <span className="count-number">{collectionCount}</span>
                        <span className="count-label">Collections</span>
                    </div>
                    <div className="count-item">
                        <span className="count-number">{generatedImagesCount}</span>
                        <span className="count-label">Generated Images</span>
                    </div>
                </div>
            </div>
            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'collections' ? 'activeLink' : ''}`}
                    id="collections-tab"
                    onClick={() => setActiveTab('collections')}
                >
                    Collections
                </button>
                <button
                    className={`tab-button ${activeTab === 'generated' ? 'activeLink' : ''}`}
                    id="generated-tab"
                    onClick={() => setActiveTab('generated')}
                >
                    Generated Images
                </button>
            </div>
            <div className="content">
                {activeTab === 'collections' && (
                    <div>
                        <div className="collections-line">
                        {collections.map(collection => (
                            <div key={collection.id} className="collection-item" onClick={(event) => handleCollectionClick(event, collection.id)}>
                                {collection.images && collection.images.length > 0 ? (
                                    <img src={collection.images[0].url} alt={collection.name} className="collection-image"/>
                                ) : (
                                    <div className="placeholder-image"></div>
                                )}
                                <h3 className="collection-name"><strong>{collection.name}</strong></h3>
                            </div>
                        ))}

                        <div className="collection-item create-collection" onClick={openCreateModal}>
                            <div className="placeholder-image"></div>
                        </div>

                        {isCreateModalVisible && (
                            <div className="create-collection-modal-backdrop" onClick={handleBackdropClick}>
                                <div className="create-collection-modal" onClick={(e) => e.stopPropagation()}>
                                    <div className="create-collection-modal-header">
                                        <h2>Créer une collection</h2>
                                    </div>
                                    <form onSubmit={handleCreateCollection}>
                                        <div className="create-collection-modal-body">
                                            <label htmlFor="collectionName">Nom</label>
                                            <input
                                                id="collectionName"
                                                type="text"
                                                placeholder="Ex.: « Style Miyazaki » ou « Tatouages Maoris »"
                                                value={newCollectionName}
                                                onChange={(e) => setNewCollectionName(e.target.value)}
                                            />
                                            {/* Other form elements */}
                                        </div>
                                        <div className="create-collection-modal-footer">
                                            <button type="submit" className="create-collection-modal-button">Créer</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        </div>
                    </div>
                )}

                {clickedCollectionId && (
                    <div className="modal" onClick={(event) => handleCollectionClick(event, null)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Collection Details</h2>
                                <hr />
                            </div>
                            
                            <div className="collection-masonry-gallery">
                                {collectionImages.map((image) => (
                                    <div key={image.id} className="collection-image-item">
                                        <img src={image.url_image} alt={image.prompt} />
                                        <FaRegTrashAlt   
                                            className="remove-icon"
                                            onClick={() => handleRemoveImageFromCollection(image.id)}
                                            title="Remove from Collection"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'generated' && (
                    <div className="gallery-container">
                        {UserImages.length === 0 ? (
                            <p>No matching images found.</p>
                        ) : (
                            <div className="masonry-gallery">
                                {UserImages.map((image) => (
                                    <div className="communityGalleryImages" onClick={(event) => handleImageClick(event, image.id)} key={image.id}>
                                        <img
                                            src={image.url_image}
                                            alt={image.prompt}
                                            className="communityGalleryImage"
                                            loading="lazy"
                                        />
                                        {clickedImageId === image.id && 
                                        <div className="modal" onClick={(event) => handleImageClick(event, image.id)}>
                                            <div className="modal-content" onClick={e => e.stopPropagation()}>
                                            <div className="modal-text">
                                                <div className="modal-prompt">
                                                <p>{image.prompt}</p>
                                                </div>
                                                <div className="modal-parameters">
                                                <p>Width<br/><span>{image.width}</span></p>
                                                <p>Height<br/><span>{image.height}</span></p>
                                                <p>Generation Step<br/><span>{image.step}</span></p>
                                                <p>Guidance Scale<br/><span>{image.cfg_scale}</span></p>
                                                </div>
                                            </div>
                                            <div className="modal-image">
                                                <img
                                                id={image.id}
                                                src={image.url_image}
                                                alt={image.id}
                                                className="communityGalleryImage"
                                                />
                                                <button onClick={() => handleDownload(image.url_image)} className="download-button">
                                                <FaDownload />
                                                </button>
                                                {/* Dropdown to select a collection */}
                                                <select value={selectedCollectionForImage} onChange={(e) => setSelectedCollectionForImage(e.target.value)}>
                                                    <option value="">Select a Collection</option>
                                                    {collections.map((collection) => (
                                                        <option key={collection.id} value={collection.id}>{collection.name}</option>
                                                    ))}
                                                </select>

                                                {/* Button to add image to collection */}
                                                <button onClick={() => handleAddImageToCollection(clickedImageId)}>Add to Collection</button>
                                            </div>
                                            </div>
                                        </div>
                                        }
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPage;