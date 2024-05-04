"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { loremIpsum } from 'lorem-ipsum';
import styles from './styles/Home.module.css';

const Home = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadedImageURL, setUploadedImageURL] = useState<string | null>(null);
  const [leftText, setLeftText] = useState('');  // State to hold the left side text
  const [rightText, setRightText] = useState(''); // State to hold the right side text

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedImage(file || null);
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await axios.post('/api/remove-background', formData);
        setUploadedImageURL(response.data.url);
        console.log('Background removal and upload successful');
      } catch (error) {
        console.error('Error removing background and uploading image:', error);
      }
    }
  };

  const handleProcessImage = async () => {
    try {
        const response = await fetch('/api/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to process image');
        }

        const data = await response.json();
        console.log(data.message); // Or handle the success response as needed
    } catch (error) {
        console.error('Error processing image:', error);
    }
};

  // Generates two parts of random text for left and right of the image
  const generateRandomText = () => {
    const fullText = loremIpsum({
      count: 20, // Generate 20 sentences
      units: 'sentences',
      format: 'plain',
    }).split('. '); // Split the text into sentences
    const middleIndex = Math.floor(fullText.length / 2); // Find the middle index
    setLeftText(fullText.slice(0, middleIndex).join('. ') + '.'); // First half for left text
    setRightText(fullText.slice(middleIndex).join('. ') + '.'); // Second half for right text
  };

  useEffect(() => {
    generateRandomText();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>State-of-the-Art AI Image Generation Platform</h1>
        <p className={styles.description}>
          Unleash the power of artificial intelligence to create stunning images like never before. Our cutting-edge technology allows you to generate unique and captivating visuals with ease. Whether you need images for your website, social media, or creative projects, our platform has got you covered.
        </p>
      </header>
      <div>
            <h1>Image Processor</h1>
            <button onClick={handleProcessImage}>Process Image</button>
            {/* Display the result image or any other content */}
        </div>
      <section className={styles.uploadSection}>
        <label htmlFor="imageUpload" className={styles.uploadLabel}>
          Choose Image
        </label>
        <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className={styles.uploadInput} />
        {selectedImage && (
          <div className={styles.selectedImage}>
            <p>Selected Image: {selectedImage.name}</p>
          </div>
        )}
      </section>
      {uploadedImageURL && (
        <section className={styles.resultSection}>
          <h2>Processed Image:</h2>
          <div className={styles.imageTextWrapper}>
            <div className={styles.wrapText}>{leftText}</div>
            <img src={uploadedImageURL} alt="Processed Image" className={styles.processedImage} />
            <div className={styles.wrapText}>{rightText}</div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
