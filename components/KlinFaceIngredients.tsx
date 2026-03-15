// components/KlinFaceIngredients.tsx
'use client';

import React from 'react';

const KlinFaceIngredients = () => {
  return (
    <div className="klinface-ingredients">
      <style jsx>{`
        .klinface-ingredients {
          font-family: 'Roboto', Arial, sans-serif;
        }
        .ingredients-section {
          padding: 60px;
          background: #f4f9fd;
          text-align: center;
          position: relative;
        }
        .ingredients-section h2 {
          font-size: 2.8em;
          color: #2575fc;
          margin-bottom: 20px;
          font-weight: 700;
        }
        .ingredients-section > p {
          font-size: 1.2em;
          color: #34495e;
          margin-bottom: 40px;
        }
        .ingredients-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 30px;
        }
        .ingredient-item {
          width: 280px;
          text-align: center;
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease-in-out;
        }
        .ingredient-item:hover {
          transform: scale(1.05);
        }
        .ingredient-item img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 50%;
          margin-bottom: 15px;
        }
        .ingredient-item h3 {
          color: #2575fc;
          font-weight: 600;
          margin: 0 0 10px 0;
        }
        .ingredient-item p {
          color: #34495e;
          font-size: 0.95em;
          margin: 0;
        }
        @media (max-width: 768px) {
          .ingredient-item {
            width: 90%;
          }
        }
      `}</style>

      <section className="ingredients-section">
        <h2>Powerful Natural Ingredients</h2>
        <p>
          KlinFace is formulated with a blend of potent natural ingredients that effectively remove warts, skin tags,
          moles, and black spots within just 3 days of application.
        </p>

        <div className="ingredients-container">
          {/* Garlic */}
          <div className="ingredient-item">
            <img
              src="https://imported2nairobi.co.ke/wp-content/uploads/2024/12/GarlicDuganski600.jpg"
              alt="Garlic"
            />
            <h3>Garlic</h3>
            <p>
              Garlic’s enzymes dissolve warts and skin tags, while its natural acids break down moles and black spots
              for a clear skin surface.
            </p>
          </div>

          {/* Manjistha */}
          <div className="ingredient-item">
            <img
              src="https://imported2nairobi.co.ke/wp-content/uploads/2024/12/red_sandalwoodpan_3_1200x1200.webp"
              alt="Manjistha"
            />
            <h3>Manjistha</h3>
            <p>
              This blood‑purifying herb helps to fade stubborn black spots and supports the natural shedding of warts
              and skin tags.
            </p>
          </div>

          {/* Sandalwood */}
          <div className="ingredient-item">
            <img
              src="https://imported2nairobi.co.ke/wp-content/uploads/2024/12/Manjistha.webp"
              alt="Sandalwood"
            />
            <h3>Sandalwood</h3>
            <p>
              Sandalwood’s active compounds soothe the skin and help repair damage caused by warts, moles, and skin tags.
            </p>
          </div>

          {/* Indian Lilac */}
          <div className="ingredient-item">
            <img
              src="https://imported2nairobi.co.ke/wp-content/uploads/2024/12/Indian-lilac.avif"
              alt="Indian Lilac"
            />
            <h3>Indian Lilac</h3>
            <p>
              Also known as neem, it destroys wart‑causing viruses and reduces skin tags with its antifungal and
              antibacterial properties.
            </p>
          </div>

          {/* Aloe Vera */}
          <div className="ingredient-item">
            <img
              src="https://imported2nairobi.co.ke/wp-content/uploads/2024/12/Health-GettyImages-1475314230-068b30b5f380418b89350af13bdb111c.jpg"
              alt="Aloe Vera"
            />
            <h3>Aloe Vera</h3>
            <p>
              Aloe Vera provides deep hydration while targeting black spots and aiding in the quick removal of warts
              and skin tags.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KlinFaceIngredients;