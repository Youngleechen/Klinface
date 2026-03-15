// components/KlinFaceHomepage.tsx
'use client'; // only needed if you later add interactivity

import React from 'react';

const KlinFaceHomepage = () => {
  return (
    <div className="klinface-homepage">
      <style jsx>{`
        /* General Styling */
        .klinface-homepage {
          font-family: 'Arial', sans-serif;
          color: #333;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background: #fff;
        }
        section {
          padding: 60px 30px;
          margin: 0 auto;
          max-width: 1200px;
        }

        /* Hero Section */
        .klinface-hero {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          padding: 60px 20px;
          background: linear-gradient(135deg, #f9f9f9, #eaeaea);
          border-bottom: 5px solid #6a0dad;
        }
        .hero-content {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }
        .hero-text {
          flex: 1;
          min-width: 280px;
          max-width: 600px;
          text-align: left;
          padding: 20px;
        }
        .hero-text h1.fixed-break {
          font-size: 3rem;
          margin-bottom: 15px;
          line-height: 1.2;
          font-weight: bold;
          color: #6a0dad;
        }
        .hero-text h1.fixed-break .subline {
          display: block;
          font-size: 2.2rem;
          font-weight: normal;
          margin-top: 5px;
          color: #6a0dad;
        }
        .hero-text p {
          font-size: 1.3rem;
          margin-bottom: 20px;
          color: #444;
        }
        .hero-text a.button-primary {
          display: inline-block;
          padding: 10px 20px;
          background: #6a0dad;
          color: #fff;
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
          transition: background 0.3s;
        }
        .hero-text a.button-primary:hover {
          background: #580b9e;
        }
        .hero-image {
          flex: 1;
          max-width: 500px;
          text-align: center;
        }
        .hero-image img {
          max-width: 100%;
          height: auto;
          border-radius: 15px;
          box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
        }
        .hero-image-mobile {
          display: none;
        }
        
        /* Features Section */
        .klinface-features {
          text-align: center;
          background: #f7f7f7;
        }
        .klinface-features h2 {
          font-size: 2.5rem;
          color: #6a0dad;
          margin-bottom: 30px;
        }
        .features-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          justify-content: center;
        }
        .feature-item {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 300px;
          text-align: center;
        }
        .feature-item i.icon {
          font-size: 2rem;
          color: #6a0dad;
          margin-bottom: 10px;
        }
        .feature-item h3 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 15px;
        }
        .feature-item p {
          font-size: 1rem;
          color: #555;
          margin-bottom: 15px;
        }
        .feature-item a.button-secondary {
          display: inline-block;
          padding: 8px 15px;
          background: #6a0dad;
          color: #fff;
          border-radius: 5px;
          text-decoration: none;
          font-size: 0.9rem;
          transition: background 0.3s;
        }
        .feature-item a.button-secondary:hover {
          background: #580b9e;
        }
        
        /* Products Section */
        .klinface-products {
          text-align: center;
        }
        .klinface-products h2 {
          font-size: 2.5rem;
          color: #6a0dad;
          margin-bottom: 30px;
        }
        .product-item {
          display: inline-block;
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          text-align: center;
        }
        .product-item img {
          max-width: 100%;
          height: auto;
          border-radius: 15px;
          margin-bottom: 15px;
        }
        .product-item h3 {
          font-size: 1.8rem;
          color: #333;
          margin-bottom: 15px;
        }
        .product-item p {
          font-size: 1rem;
          color: #555;
          margin-bottom: 15px;
        }
        .product-item p.price {
          font-size: 1.2rem;
          color: #6a0dad;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .product-item a.button-secondary {
          display: inline-block;
          padding: 10px 20px;
          background: #6a0dad;
          color: #fff;
          border-radius: 5px;
          text-decoration: none;
          font-size: 1rem;
          transition: background 0.3s;
        }
        .product-item a.button-secondary:hover {
          background: #580b9e;
        }
        
        /* Call to Action Section */
        .klinface-cta {
          background: #6a0dad;
          color: #fff;
          text-align: center;
          padding: 60px 20px;
          border-radius: 15px;
        }
        .klinface-cta h2 {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }
        .klinface-cta p {
          margin-bottom: 20px;
          font-size: 1.2rem;
        }
        .klinface-cta a.button-primary {
          display: inline-block;
          padding: 15px 30px;
          background: #fff;
          color: #6a0dad;
          border-radius: 5px;
          font-weight: bold;
          text-decoration: none;
          font-size: 1rem;
          transition: background 0.3s, color 0.3s;
        }
        .klinface-cta a.button-primary:hover {
          background: #580b9e;
          color: #fff;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
          }
          .hero-text {
            text-align: center;
          }
          .hero-image {
            display: none;
          }
          .hero-image-mobile {
            display: block;
            margin: 10px 0;
          }
          .klinface-cta {
            padding: 40px 20px;
          }
          .klinface-cta h2 {
            font-size: 2rem;
          }
          .klinface-cta p {
            font-size: 1rem;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="klinface-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="fixed-break">
              KlinFace Herbal Skin
              <span className="subline">Solution</span>
            </h1>
            <div className="hero-image-mobile">
              <img
                src="https://imported2nairobi.co.ke/wp-content/uploads/2024/12/say-goodbye-to-warts.jpg"
                alt="KlinFace Solution"
              />
            </div>
            <p>Say goodbye to black spots, moles, warts, and skin tags with our 100% natural herbal formula.</p>
            <a href="#features" className="button-primary">Learn More</a>
          </div>
          <div className="hero-image">
            <img
              src="https://imported2nairobi.co.ke/wp-content/uploads/2024/12/say-goodbye-to-warts.jpg"
              alt="KlinFace Solution"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="klinface-features">
        <h2>Why Choose KlinFace?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <i className="icon">🌿</i>
            <h3>100% Natural Ingredients</h3>
            <p>Crafted with herbal ingredients like garlic, aloe vera, and sandalwood for safe, effective results.</p>
            <a href="#cta" className="button-secondary">Learn More</a>
          </div>
          <div className="feature-item">
            <i className="icon">✨</i>
            <h3>Proven Results</h3>
            <p>Thousands of satisfied customers trust KlinFace for flawless, healthy skin.</p>
            <a href="/testimonials" className="button-secondary">See Testimonials</a>
          </div>
          <div className="feature-item">
            <i className="icon">🏠</i>
            <h3>Easy to Use</h3>
            <p>Designed for simple, at‑home application with step‑by‑step instructions.</p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="klinface-products">
        <h2>Our Featured Product</h2>
        <div className="product-item">
          <img
            src="https://imported2nairobi.co.ke/wp-content/uploads/2024/12/2970.png"
            alt="KlinFace Jar"
          />
          <h3>KlinFace Herbal Jar</h3>
          <p>Perfect for removing black spots, moles, warts, and skin tags naturally.</p>
          <p className="price">
            Only Ksh 1500 <strong>(Delivery Inclusive!)</strong>
          </p>
          <a href="/order" className="button-secondary">Buy Now</a>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta" className="klinface-cta">
        <h2>Your Skin Transformation Starts Here</h2>
        <p>Join thousands of happy customers and achieve flawless skin with KlinFace. Don’t wait!</p>
        <a href="/order" className="button-primary">Shop Now</a>
      </section>
    </div>
  );
};

export default KlinFaceHomepage;