import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa';
import { FaImage , FaFileImage , FaRulerCombined, FaSortAmountDownAlt, FaRandom, FaSeedling } from 'react-icons/fa';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import UserProfileDropdown from './UserProfileDropdown';

import './HomePage.css';

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [profileImageUrl, setprofileImageUrl] = useState('');

  const [instruction, setInstruction] = useState('');
  const [imageData, setImageData] = useState([
    { id: 'image1', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Siberischer_tiger_de_edit02.jpg/640px-Siberischer_tiger_de_edit02.jpg', imageId: '', prompt: '', width: '', height: '', generationStep: '', seed: '', guidanceScale: '' },
    { id: 'image2', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Siberischer_tiger_de_edit02.jpg/640px-Siberischer_tiger_de_edit02.jpg', imageId: '', prompt: '', width: '', height: '', generationStep: '', seed: '', guidanceScale: '' },
    { id: 'image3', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Siberischer_tiger_de_edit02.jpg/640px-Siberischer_tiger_de_edit02.jpg', imageId: '', prompt: '', width: '', height: '', generationStep: '', seed: '', guidanceScale: '' },
    { id: 'image4', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Siberischer_tiger_de_edit02.jpg/640px-Siberischer_tiger_de_edit02.jpg', imageId: '', prompt: '', width: '', height: '', generationStep: '', seed: '', guidanceScale: '' },
  ]);
  const [isInstructionTutorialDone, setIsInstructionTutorialDone] = useState(false);  
  const [isInstructionButtonClicked, setIsInstructionButtonClicked] = useState(false);
  const [clickedImageId, setClickedImageId] = useState(null);
  const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false);
  const [activeTabs, setActiveTabs] = useState({
    Style: false,
    Format: false,
    Parameters: false,
  });
  const [buttonStates, setButtonStates] = useState({
    detailed: false,
    colorful: false,
    bw: false,
    highcontrast: false,
    realistic: false,
    myasaki: false,
    steampunk: false,
    japanesestyle: false,
    comics: false,
    closeup: false,
    longshot: false,
    landscape: false,
    background: false,
    portrait: false,
  });
  const [showContinueButtonStyle, setShowContinueButtonStyle] = useState(true);
  const [showContinueButtonFormat, setShowContinueButtonFormat] = useState(true);
  const possibleImageDimensions = [
    { value: '1152 x 768', width: '1024', height: '688'},
    { value: '1088 x 896', width: '1024', height: '848'},
    { value: '1024 x 1024', width: '512', height: '512'},
    { value: '896 x 1088', width: '848', height: '1024'},
    { value: '768 x 1152', width: '688', height: '1024'}
  ];  
  const [imageDimensions, setImageDimensions] = useState(possibleImageDimensions [2].value); // Default to '1024 x 1024'
  const imageDimensionsSources = [
    '768x1152.jpg',
    '896x1088.jpg',
    '1024x1024.jpg',
    '1088x896.jpg',
    '1152x768.jpg'
  ];
  const [seed, setSeed] = useState('');
  const [generationSteps, setGenerationSteps] = useState('20');
  const [guidanceScale, setGuidanceScale] = useState('7.5');
  const [galleryImages, setGalleryImages] = useState([]);
  

  // FUNCTIONS

  const handleInstructionChange = (event) => {
    setInstruction(event.target.value);
  
    // Check if the Enter key was pressed
    if (event.key === 'Enter') {
      if (username === 'Invité') {
        // Redirect to /signin if username is 'Invité'
        window.location.href = '/signIn';
      } else {
        // Existing logic for Enter key press
        handleSendInstructionTutorial();
      }
    }
  };

  const handleImageClick = async (event, id) => {
    // Check if the user clicked outside of the modal content
    if (event.target.className === 'modal') {
      setClickedImageId(null);
    } else {
      setClickedImageId(id);
    }
  };

  const handleSuggestToCommunity = async (imageId) => {
    try {
      setIsSubmitButtonClicked(prevState => !prevState);
      const updateResponse = await fetch(`http://localhost:3000/api/image/setImage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: imageId,
          isVisible: isSubmitButtonClicked
        }),

      });
      if (updateResponse.ok) {
        console.log('Image community attribute updated successfully');

        // Update the galleryImages state
        setGalleryImages(prevImages => 
          prevImages.map(image => 
            image.id === imageId ? { ...image, visible: isSubmitButtonClicked } : image
          )
        );
        
      } else {
        console.error('Failed to update image community attribute');
      }
    } catch (error) {
      console.error(error);
    }
  }  
  
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
  
  const handleTabSelect = (tabName, shouldScroll) => {
    setActiveTabs(prevState => ({
      ...prevState,
      [tabName]: !prevState[tabName] // Toggle the active state
    }));
  
    if (shouldScroll) {
      scrollToTab(tabName);
    }
  };
  
  const openTabSelect = (tabName, shouldScroll) => {
    setActiveTabs(prevState => ({
      ...prevState,
      [tabName]: true // Toggle the active state
    }));
  
    if (shouldScroll) {
      scrollToTab(tabName);
    }
  };

  const handleContinueToStyle = () => {
    openTabSelect('Style', true);
  };

  const handleContinueToFormat = () => {
    openTabSelect('Format', true);
    setShowContinueButtonStyle(false); // Hide the button after click
  };

  const handleContinueToParameters = () => {
    openTabSelect('Parameters', true);
    setShowContinueButtonFormat(false); // Hide the Format section's continue button
  };
  

  const scrollToTab = (tabName) => {
    const tabElement = document.getElementById(`${tabName.toLowerCase()}Tab`);
    if (tabElement) {
      tabElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0, // Scroll to the top of the window
      behavior: 'smooth' // Smooth scroll
    });
  };  

  const handleButtonToggle = (buttonName) => {
    setButtonStates((prevState) => ({
      ...prevState,
      [buttonName]: !prevState[buttonName],
    }));
  };

  const getButtonLabelsByTab = (tabName) => {
    const buttonLabels = {
      Style: {
        detailed: 'highly detailed',
        colorful: 'colorful, color',
        bw: 'black and white',
        highcontrast: 'high contrast',
        realistic: 'realistic',
        myasaki: 'Myasaki',
        steampunk: 'steampunk',
        japanesestyle: 'japanese style, oriental style',
        comics: 'marvel, DC Comics',
      },
      Format: {
        closeup: 'close up',
        longshot: 'longshot',
        landscape: 'landscape',
        background: 'background',
        portrait: 'portrait',
      }
    };
  
    return buttonLabels[tabName] || {};
  };

  // Function to handle image width change
  const handleImageDimensionsChange = (event) => {
    const imageDimensionsIndex = event.target.value;
    setImageDimensions(possibleImageDimensions[imageDimensionsIndex].value);
  };

  // Function to handle generation steps change
  const handleGenerationStepsChange = (event) => {
    setGenerationSteps(event.target.value);
  };

  // Function to handle guidance scale change
  const handleGuidanceScaleChange = (event) => {
    setGuidanceScale(event.target.value);
  };

  // Function to handle seed change
  const handleSeedChange = (event) => {
    setSeed(event.target.value);
  };

  // Function to handle instruction tutorial
  const handleSendInstructionTutorial = (event) => {
    if (isInstructionTutorialDone == false) {
      setIsInstructionTutorialDone(true);
      handleContinueToStyle();
    } else {
      handleSendInstruction();
      setIsInstructionButtonClicked(true);
    }
  };

  // function to get the username and profile photo
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


  // function to send instructions and retrieve the generated images.
  const handleSendInstruction = async () => {
    try {
      const instruction = document.getElementById('instructionInput').value;
      const selectedButtons = Object.keys(buttonStates).filter(buttonName => buttonStates[buttonName]);
      console.log(selectedButtons);
      const seedValue = seed.trim() || null;
      const guidanceScaleValue = Number(guidanceScale);
      const width = imageDimensions.split(' x ')[0];
      const height = imageDimensions.split(' x ')[1];

      const response = await fetch('http://localhost:3000/api/image/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}` },
        body: JSON.stringify({
          userID: String(sessionStorage.getItem('userId')),
          numberOfGeneratedImage: galleryImages.length,
          instruction: instruction,
          selectedButtons,
          imageWidth: Number(width),
          imageHeight: Number(height),
          seed: seedValue,
          generationSteps: Number.isNaN(generationSteps) ? 20 : generationSteps,
          guidanceScale: Number.isNaN(guidanceScaleValue) ? 7.5 : guidanceScaleValue,
        }),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse)
        if (jsonResponse.hasOwnProperty('message')) {
          window.location.href = "http://localhost:3000/pricing";
          
        } else { 
          updateImageSource(jsonResponse);
        }

      } else {
        throw new Error('Network response was not ok.');
      }

      // Clear the instruction input field
      instructionTextArea.value = '';

    } catch (error) {
      console.error(error);
    }
};

const updateImageSource = async (jsonResponse) => {
  const urls = jsonResponse.map(item => item.url_image);
    try {
      const fetchImage = async (url) => {
        let response;
        do {
          response = await fetch(url);
          if (!response.ok) await new Promise(resolve => setTimeout(resolve, 5000));
        } while (!response.ok);
        return URL.createObjectURL(await response.blob());
      };

      console.log(jsonResponse);

      const updatedImages = await Promise.all(urls.map(async (url, index) => ({
        ...imageData[index],
        src: await fetchImage(url),
        imageId: jsonResponse[index].id,
        prompt: instruction,
        width: jsonResponse[index].width,
        height: jsonResponse[index].height,
        generationStep: jsonResponse[index].generationSteps,
        seed: jsonResponse[index].seedValue,
        guidanceScale: jsonResponse[index].guidanceScale
      })));

      setImageData(updatedImages);
    } catch (error) {
      console.error('Error updating images:', error);
    }
};
  

useEffect(() => {
  const fetchUserImages = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/image/getUserHistoric', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'User-ID': String(sessionStorage.getItem('userId'))
        },
      });
      const UserImages = await response.json();
      const sortedUserImages = UserImages.sort((a, b) => b.id - a.id);

      setGalleryImages(sortedUserImages);
    } catch (error) {
      console.error(error);
    }
  };

  fetchUserImages();
}, []);

  // Function to chunk an array into smaller arrays of a specified size
  function chunkArray(array, size) {
    const chunked = [];
    let index = 0;
    while (index < array.length) {
      chunked.push(array.slice(index, size + index));
      index += size;
    }
    return chunked;
  }

  // Chunk the gallery images into groups of four
  const chunkedGalleryImages = chunkArray(galleryImages, 4);

  useEffect(() => {
    // Find the image that has been clicked
    const clickedImage = galleryImages.find(image => image.id === clickedImageId);
  
    // Set the button state based on the image's visibility
    if (clickedImage) {
      setIsSubmitButtonClicked(!clickedImage.visible);
    }
  }, [clickedImageId, galleryImages]);

  return (
    <div className="body-container">
      <div className="homepage-container">
        <div className="user-container">

        {username !== "Invité" ? (
        <UserProfileDropdown username={username} profileImageUrl={profileImageUrl} />
      ) : (
        <NavLink to="/signIn" className="user-profile-link">
            <div className="user-profile-container">
              <img src={profileImageUrl} alt={username} className="user-profile-image" />
              <div className="user-name">{username}</div>
            </div>
        </NavLink>
        )}
        </div>
        <div className="head-menu-container">
          <div className="head-container">
            <div className="logo-title-container">
              <div className="logo">
                <img src="Drop.jpg" alt="Logo" className="logo-image" />
              </div>
              <div className="head-title">DROP</div>
            </div>
          </div>
          
          <ul className="menu">
            <li className='activeLink'>
              <NavLink to="/">Home</NavLink>
            </li>
            <li className="separator">|</li>
            <li>
              <NavLink to="/community">Community</NavLink>
            </li>
          </ul>
        </div>
        <div className="intro">Saisissez votre imaginaire</div>
        <div className="instruction-area">
          <input 
            type="text" 
            id="instructionInput"
            className="instruction-input" 
            placeholder="Enter instruction here..." 
            value={instruction}
            onChange={handleInstructionChange}
            onKeyPress={handleInstructionChange}   
          />
          <button 
            onClick={() => {
              if (username === 'Invité') {
                // Redirect to /signin if username is 'Invité'
                window.location.href = '/signIn';
              } else {
                // Existing logic
                handleSendInstructionTutorial();
              }
            }} 
            className="send-instruction-button"
          >
            <i className="arrow right"></i>
          </button>
        </div>
  
        {isInstructionButtonClicked && 
          <div className="generatedImage-wrapper">
            {imageData.map(({ id, src, imageId, prompt, width, height, step, cfg_scale }) => (
              <div className="generatedImage" onClick={(event) => handleImageClick(event, imageId)} key={id}>
                <img
                  id={id}
                  src={src}
                  alt={id}
                  data-id={imageId}
                  className="imageStyle"
                />
                {clickedImageId === imageId && 
                  <div className="modal" onClick={(event) => handleImageClick(event, imageId)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                      <div className="modal-text">
                        <div className="modal-prompt">
                          <p>{prompt}</p>
                        </div>
                        <div className="modal-parameters">
                          <p>Width<br/><span>{width}</span></p>
                          <p>Height<br/><span>{height}</span></p>
                          <p>Generation Step<br/><span>{step}</span></p>
                          <p>Guidance Scale<br/><span>{cfg_scale}</span></p>
                        </div>
                        <button 
                          onClick={() => handleSuggestToCommunity(imageId)} 
                          className={`submit-button ${isSubmitButtonClicked ? 'clicked' : ''}`}
                        >
                          {isSubmitButtonClicked ? <FaLock /> : <FaLockOpen />}
                          <span>Keep Private</span>
                        </button>
                      </div>
                      <div className="modal-image">
                        <img
                          id={id}
                          src={src}
                          alt={id}
                          className="imageStyle"
                        />
                        <button onClick={() => handleDownload(src)} className="download-button">
                          <FaDownload />
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            ))}
          </div>
        }

        <ul className="tablist">
          <li
            className={activeTabs === 'Style' ? 'active' : ''}
            onClick={() => handleTabSelect('Style', true)}
          >
            {activeTabs.Style ? <FaChevronDown className="chevron-icon" /> : <FaChevronRight className="chevron-icon" />} Style
          </li>
        </ul>       

        <div className="tab-content" id="styleTab" style={{ display: activeTabs.Style ? 'block' : 'none' }}>
          <div className="style-tab">
              <div className="style-section">
                <h2 className="section-title">Basic Styles</h2>
                <div className="style-buttons"> {/* Add this wrapper */}
                  <div 
                    className={`style-button ${buttonStates.detailed ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('detailed')}
                  >
                    <div className="button-image">
                      <img src="detailed.jpg" alt="Detailed" />
                    </div>
                    <h3>Detailed</h3>
                  </div>            
                  <div 
                    className={`style-button ${buttonStates.colorful ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('colorful')}
                  >
                    <div className="button-image">
                      <img src="colorful.jpg" alt="Colorful" />
                    </div>
                    <h3>Colorful</h3>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.bw ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('bw')}
                  >
                    <div className="button-image">
                      <img src="bw.jpg" alt="B&W" />
                    </div>
                    <h3>B&W</h3>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.highcontrast ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('highcontrast')}
                  >
                    <div className="button-image">
                      <img src="highcontrast.jpg" alt="High Contrast" />
                    </div>
                    <h3>High Contrast</h3>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.patchdesign ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('patchdesign')}
                  >
                    <div className="button-image">
                      <img src="realistic.jpg" alt="Realistic" />
                    </div>
                    <h3>Realistic</h3>
                  </div>
                </div>      
              </div>

              <div className="style-section">
                <h2 className="section-title">Advanced Styles</h2>
                <div className="style-buttons"> {/* wrapper */}
                  <div 
                    className={`style-button ${buttonStates.myasaki ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('myasaki')}
                  >
                    <div className="button-image">
                      <img src="myasaki.jpg" alt="Myasaki" />
                    </div>
                    <h3>Myasaki</h3>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.steampunk ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('steampunk')}
                    >
                    <div className="button-image">
                      <img src="steampunk.jpg" alt="Steampunk" />
                    </div>
                    <h3>Steampunk</h3>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.japanesestyle ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('japanesestyle')}
                    >
                    <div className="button-image">
                      <img src="japanesestyle.jpg" alt="Japanese Style" />
                    </div>
                    <h3>Japanese Style</h3>
                  </div>
                  <div 
                    className={`style-button ${buttonStates.comics ? 'button-on' : 'button-off'}`}
                    onClick={() => handleButtonToggle('comics')}
                    >
                    <div className="button-image">
                      <img src="cartoon.jpg" alt="Cartoon" />
                    </div>
                    <h3>Comics</h3>
                  </div>
                </div>
              </div>
          </div>
          {showContinueButtonStyle && (
            <button 
              className="continue-button"
              onClick={handleContinueToFormat}
            >
              Continue
            </button>
          )}
        </div>
        
        <ul className="tablist">
          <li
            className={activeTabs === 'Format' ? 'active' : ''}
            onClick={() => handleTabSelect('Format', true)}
          >
            {activeTabs.Format ? <FaChevronDown className="chevron-icon" /> : <FaChevronRight className="chevron-icon" />} Format
          </li>
        </ul>

        <div className="tab-content" id="formatTab" style={{ display: activeTabs.Format ? 'block' : 'none' }}>
          <div className="format-buttons"> {/* Add this wrapper */}
            <div 
              className={`format-button ${buttonStates.closeup ? 'button-on' : 'button-off'}`}
              onClick={() => handleButtonToggle('closeup')}
              >
              <div className="button-image">
                <img src="closeup.jpg" alt="Close Up" />
              </div>
              <h3>Close Up</h3>
            </div>
            <div 
              className={`format-button ${buttonStates.longshot ? 'button-on' : 'button-off'}`}
              onClick={() => handleButtonToggle('longshot')}
              >
              <div className="button-image">
                <img src="longshot.jpg" alt="Long Shot" />
              </div>
              <h3>Long Shot</h3>
            </div>
            <div 
              className={`format-button ${buttonStates.landscape ? 'button-on' : 'button-off'}`}
              onClick={() => handleButtonToggle('landscape')}
              >
              <div className="button-image">
                <img src="landscape.jpg" alt="Landscape" />
              </div>
              <h3>Landscape</h3>
            </div>
            <div 
              className={`format-button ${buttonStates.background ? 'button-on' : 'button-off'}`}
              onClick={() => handleButtonToggle('background')}
              >
              <div className="button-image">
                <img src="background.jpg" alt="Background" />
              </div>
              <h3>Background</h3>
            </div>
            <div 
              className={`format-button ${buttonStates.portrait ? 'button-on' : 'button-off'}`}
              onClick={() => handleButtonToggle('portrait')}
              >
              <div className="button-image">
                <img src="portrait.jpg" alt="Portrait" />
              </div>
              <h3>Portrait</h3>
            </div>
          </div>
          {showContinueButtonFormat && (
            <button 
              className="continue-button"
              onClick={handleContinueToParameters}
            >
              Continue
            </button>
          )}
        </div>

        <ul className="tablist">
          <li
            className={activeTabs === 'Parameters' ? 'active' : ''}
            onClick={() => handleTabSelect('Parameters', true)}
          >
            {activeTabs.Parameters ? <FaChevronDown className="chevron-icon" /> : <FaChevronRight className="chevron-icon"/>} Paramètres
          </li>
        </ul>

        <div className="tab-content" id="parametresTab" style={{ display: activeTabs.Parameters ? 'block' : 'none' }}>
          <div className="parametres">
            <div className="dimension-parametre">
              <label htmlFor="dimension">
                <FaRulerCombined size={20} style={{ marginRight: '10px' }} />
                Dimensions
              </label>
              <div className="dimension-icons">
                <FaImage size={20} />
                <input
                  key={imageDimensions}
                  type="range"
                  id="dimension"
                  min="0"
                  max="4"
                  step="1"
                  value={possibleImageDimensions.findIndex(({ value }) => value === imageDimensions)}
                  onChange={handleImageDimensionsChange}
                />
                <FaFileImage size={20} />
              </div>
              <p>{imageDimensions}</p>
              <div className="dimension-image">
                <img src={`/${imageDimensionsSources[possibleImageDimensions.findIndex(dimensions => dimensions.value === imageDimensions)]}`} alt="Dimension Preview" />
              </div>
            </div>
            <div className="other-parametres">
                <div className="parametre">
                  <div className="parametre-title">
                    <label htmlFor="generationSteps">
                      <FaSortAmountDownAlt  size={20} style={{ marginRight: '10px' }} />
                      Generation Steps
                    </label>
                    <input
                      type="number"
                      id="generationStepsValue"
                      value={generationSteps}
                      onChange={handleGenerationStepsChange}
                      className="parametre-input"
                    />
                  </div>
                  <input
                    type="range"
                    id="generationSteps"
                    min="1"
                    max="50"
                    step="1"
                    value={generationSteps}
                    onChange={handleGenerationStepsChange}
                  />
                </div>
                <div className="parametre">
                  <div className="parametre-title">
                    <label htmlFor="guidanceScale">
                      <FaRandom  size={20} style={{ marginRight: '10px' }} />
                      Guidance Scale
                    </label>
                    <input
                      type="number"
                      id="guidanceScaleValue"
                      step="0.5"
                      value={guidanceScale}
                      onChange={handleGuidanceScaleChange}
                      className="parametre-input"
                    />
                  </div>
                  <input
                    type="range"
                    id="guidanceScale"
                    min="0"
                    max="10"
                    step="0.5"
                    value={guidanceScale}
                    onChange={handleGuidanceScaleChange}
                  />
                </div>
                <div className="parametre">
                  <div className="parametre-title">
                    <label htmlFor="seed">
                      <FaSeedling  size={20} style={{ marginRight: '10px' }} />
                      Seed
                    </label>
                    <input
                      type="text"
                      id="seed"
                      value={seed}
                      onChange={handleSeedChange}
                      placeholder="1aB2cD3eF4gH5iJ6kL7mN8oP9qR"
                      className="parametre-seed-input"
                    />
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                if (username === 'Invité') {
                  // Redirect to /signin if username is 'Invité'
                  window.location.href = '/signIn';
                } else {
                  // Existing logic
                  handleScrollToTop();
                  handleSendInstruction();
                  setIsInstructionButtonClicked(true);
                }
              }} 
              className="continue-button"
            >
              Generate
            </button>
          </div>
          <div className="gallery">
            {chunkedGalleryImages.map((imageChunk, chunkIndex) => (
              <div key={chunkIndex}>
                <div className="imageRow">
                  {imageChunk.map((image) => (
                    <div className="galleryImages">
                      <img
                        key={image.id}
                        src={image.url_image}
                        alt={image.prompt}
                        className={"galleryImage"}
                        loading="lazy" // Enable lazy loading for the image
                        onClick={(event) => handleImageClick(event, image.id)}
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
                              <button 
                                onClick={() => handleSuggestToCommunity(image.id)} 
                                className={`submit-button ${isSubmitButtonClicked ? 'clicked' : ''}`}
                              >
                                {isSubmitButtonClicked ? <FaLock /> : <FaLockOpen />}
                                <span>Keep Private</span>
                              </button>
                            </div>
                            <div className="modal-image">
                              <img
                                id={image.id}
                                src={image.url_image}
                                alt={image.id}
                                className="galleryImage"
                              />
                              <button onClick={() => handleDownload(image.url_image)} className="download-button">
                                <FaDownload />
                              </button>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  ))}
                </div>
                <div className="imagePrompt">{imageChunk[0].prompt}</div>
              </div>
            ))}
          </div>  
      </div>
    </div>
  );
};

export default HomePage;