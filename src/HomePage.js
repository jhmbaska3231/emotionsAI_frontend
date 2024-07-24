import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './HomePage.css';
import PublicNavbar from './PublicNavbar';
import FAQ from './FaqButton';
import Footer from './Footer';
import slide1 from './pictures/slide1.png';
import slide2 from './pictures/slide2.png';
import slide3 from './pictures/slide3.png';
import home_intro_pic from './pictures/home_intro_pic.png';

const Homepage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const images = [slide1, slide2, slide3];
    const totalSlides = images.length;

    useEffect(() => {
        const intervalId = setInterval(() => {
            nextSlide();
        }, 3000);
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
        <div className="hp-container">
            <PublicNavbar />
            <div className="hp-slideshow">
                <FontAwesomeIcon icon={faChevronLeft} onClick={prevSlide} className="hp-slide-arrow hp-left-arrow" />
                <div className="hp-slide-container" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {images.map((image, index) => (
                        <div className="hp-slide" key={index}>
                            <img src={image} alt={`Slide ${index + 1}`} />
                        </div>
                    ))}
                </div>
                <FontAwesomeIcon icon={faChevronRight} onClick={nextSlide} className="hp-slide-arrow hp-right-arrow" />
                <div className="hp-slide-dots">
                    {images.map((_, index) => (
                        <span key={index} className={`hp-dot ${index === currentSlide ? 'hp-active' : ''}`} onClick={() => goToSlide(index)}></span>
                    ))}
                </div>
            </div>
            <div className="hp-product-introduction">
                <h1>ABOUT US</h1>
                <div className="hp-content-wrapper">
                    <div className="hp-text-box">
                        <p>At EmotionsAI, we specialize in leveraging cutting-edge technology to help you master the emotional nuances of your writing. Our web application, inspired by Grammarly, empowers authors, students, speechwriters, and professionals across diverse fields to craft compelling content that resonates with audiences on a deeper level.</p>
                    </div>
                    <img src={home_intro_pic} alt="Emotions AI Logo" className="hp-about-image" />
                </div>
                <div className="hp-get-started-button-container">
                    <Link to="/login">
                        <button className="hp-get-started-button">Get Started</button>
                    </Link>
                </div>
            </div>
            <FAQ />
            <Footer />
        </div>
    );
}

export default Homepage;
