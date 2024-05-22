import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'; // Updated to chevron icons
import './HomePage.css';
import FAQ from './FaqButton';

// Import the specific slide images
import slide1 from './pictures/Slide_1.png';
import slide2 from './pictures/Slide_2.png';
import slide3 from './pictures/Slide_3.png';
import intro1 from './pictures/Home_Intro.png';

const Homepage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const images = [slide1, slide2, slide3];
    const totalSlides = images.length;

    useEffect(() => {
        const intervalId = setInterval(() => {
            nextSlide();
        }, 3000); // Change slides every 3 seconds
        return () => clearInterval(intervalId);
    }, [currentSlide]);

    const nextSlide = () => {
        setCurrentSlide((currentSlide + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((currentSlide - 1 + totalSlides) % totalSlides);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div>
            <Navbar />
            <div className="slideshow">
            <FontAwesomeIcon icon={faChevronLeft} onClick={prevSlide} className="slide-arrow left-arrow"/>
                <div className="slide-container" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {images.map((image, index) => (
                        <div className="slide" key={index}>
                            <img src={image} alt={`Slide ${index + 1}`} />
                        </div>
                    ))}
                </div>
                <FontAwesomeIcon icon={faChevronRight} onClick={nextSlide} className="slide-arrow right-arrow"/>
                <div className="slide-dots">
                    {images.map((_, index) => (
                        <span key={index} className={`dot ${index === currentSlide ? 'active' : ''}`} onClick={() => goToSlide(index)}></span>
                    ))}
                </div>
            </div>
            <div className="product-introduction">
            <h1>ABOUT US</h1>
            <div className="content-wrapper">
                <div className="text-box">
                    <p>At EmotionsAI, we specialize in leveraging cutting-edge technology to help you master the emotional nuances of your writing. Our web application, inspired by Grammarly, empowers authors, students, speechwriters, and professionals across diverse fields to craft compelling content that resonates with audiences on a deeper level.</p>
                </div>
                <img src={intro1} alt="Emotions AI Logo" className="about-image"/>
            </div>
            <button className="get-started-button">Get Started</button> {/* New button added here */}
        </div>
            <Footer />
            <FAQ />
        </div>
    );
}

export default Homepage;