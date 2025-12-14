// import React, { useState } from "react";
// // import "./ApplyVendor.css";

// const ApplyVendor = () => {
//   const [formData, setFormData] = useState({
//     businessName: "",
//     contactName: "",
//     email: "",
//     phone: "",
//     businessType: "",
//     description: "",
//     website: "",
//     address: "",
//     taxId: "",
//     agreeTerms: false,
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1500));

//     setIsSubmitting(false);
//     setSubmitSuccess(true);
//     // Reset form
//     setFormData({
//       businessName: "",
//       contactName: "",
//       email: "",
//       phone: "",
//       businessType: "",
//       description: "",
//       website: "",
//       address: "",
//       taxId: "",
//       agreeTerms: false,
//     });
//   };

//   const businessTypes = [
//     "Bus",
//     "Train",
//     "Plane",
//     "Car Rental",
//     "CNG",
//     "Bike Rental",
//     "Boat",
//     "Yath",
//     "Other",
//   ];

//   return (
//     <div className="apply-vendor-container">
//       <div className="vendor-hero">
//         <div className="hero-content">
//           <h1 className="hero-title">Join Our Marketplace</h1>
//           <p className="hero-subtitle">
//             Become a vendor and reach millions of customers worldwide
//           </p>
//           <div className="hero-features">
//             <div className="feature">
//               <span className="feature-icon">🚀</span>
//               <span>Grow Your Business</span>
//             </div>
//             <div className="feature">
//               <span className="feature-icon">🌍</span>
//               <span>Global Reach</span>
//             </div>
//             <div className="feature">
//               <span className="feature-icon">🛡️</span>
//               <span>Secure Payments</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="vendor-form-wrapper">
//         <div className="form-container">
//           <div className="form-header">
//             <h2>Vendor Application Form</h2>
//             <p>Fill out the form below to start your journey with us</p>
//           </div>

//           {submitSuccess && (
//             <div className="success-message">
//               <div className="success-icon">✓</div>
//               <h3>Application Submitted Successfully!</h3>
//               <p>
//                 We'll review your application and contact you within 3-5
//                 business days.
//               </p>
//               <button
//                 className="btn-secondary"
//                 onClick={() => setSubmitSuccess(false)}
//               >
//                 Submit Another Application
//               </button>
//             </div>
//           )}

//           {!submitSuccess && (
//             <form onSubmit={handleSubmit} className="vendor-form">
//               <div className="form-grid">
//                 <div className="form-group">
//                   <label htmlFor="businessName">
//                     Business Name <span className="required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="businessName"
//                     name="businessName"
//                     value={formData.businessName}
//                     onChange={handleChange}
//                     placeholder="Enter your business name"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="contactName">
//                     Contact Person <span className="required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="contactName"
//                     name="contactName"
//                     value={formData.contactName}
//                     onChange={handleChange}
//                     placeholder="Full name"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="email">
//                     Email Address <span className="required">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="your@email.com"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="phone">
//                     Phone Number <span className="required">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     id="phone"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     placeholder="+1 (123) 456-7890"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="businessType">
//                     Business Type <span className="required">*</span>
//                   </label>
//                   <select
//                     id="businessType"
//                     name="businessType"
//                     value={formData.businessType}
//                     onChange={handleChange}
//                     required
//                   >
//                     <option value="">Select business type</option>
//                     {businessTypes.map((type, index) => (
//                       <option key={index} value={type}>
//                         {type}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="taxId">Tax ID / EIN</label>
//                   <input
//                     type="text"
//                     id="taxId"
//                     name="taxId"
//                     value={formData.taxId}
//                     onChange={handleChange}
//                     placeholder="Optional"
//                   />
//                 </div>

//                 <div className="form-group full-width">
//                   <label htmlFor="address">
//                     Business Address <span className="required">*</span>
//                   </label>
//                   <textarea
//                     id="address"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     placeholder="Full business address"
//                     rows="3"
//                     required
//                   />
//                 </div>

//                 <div className="form-group full-width">
//                   <label htmlFor="website">Website (Optional)</label>
//                   <input
//                     type="url"
//                     id="website"
//                     name="website"
//                     value={formData.website}
//                     onChange={handleChange}
//                     placeholder="https://yourwebsite.com"
//                   />
//                 </div>

//                 <div className="form-group full-width">
//                   <label htmlFor="description">
//                     Business Description <span className="required">*</span>
//                   </label>
//                   <textarea
//                     id="description"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     placeholder="Tell us about your business, products, and unique selling points..."
//                     rows="4"
//                     required
//                   />
//                   <small className="char-count">
//                     {formData.description.length}/500 characters
//                   </small>
//                 </div>
//               </div>

//               <div className="terms-group">
//                 <input
//                   type="checkbox"
//                   id="agreeTerms"
//                   name="agreeTerms"
//                   checked={formData.agreeTerms}
//                   onChange={handleChange}
//                   required
//                 />
//                 <label htmlFor="agreeTerms">
//                   I agree to the{" "}
//                   <a href="/terms" className="terms-link">
//                     Terms & Conditions
//                   </a>{" "}
//                   and
//                   <a href="/privacy" className="terms-link">
//                     {" "}
//                     Privacy Policy
//                   </a>{" "}
//                   <span className="required">*</span>
//                 </label>
//               </div>

//               <button
//                 type="submit"
//                 className="submit-btn"
//                 disabled={isSubmitting || !formData.agreeTerms}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <span className="spinner"></span>
//                     Processing...
//                   </>
//                 ) : (
//                   "Submit Application"
//                 )}
//               </button>

//               <p className="form-footer">
//                 We'll review your application within 3-5 business days and
//                 contact you.
//               </p>
//             </form>
//           )}
//         </div>

//         <div className="benefits-sidebar">
//           <div className="benefits-card">
//             <h3>Why Join Us?</h3>
//             <ul className="benefits-list">
//               <li>
//                 <span className="benefit-icon">💼</span>
//                 <div>
//                   <strong>Easy Setup</strong>
//                   <p>Get started in minutes with our simple onboarding</p>
//                 </div>
//               </li>
//               <li>
//                 <span className="benefit-icon">📈</span>
//                 <div>
//                   <strong>Sales Dashboard</strong>
//                   <p>Track your performance with real-time analytics</p>
//                 </div>
//               </li>
//               <li>
//                 <span className="benefit-icon">🔒</span>
//                 <div>
//                   <strong>Secure Payments</strong>
//                   <p>Get paid on time with our secure payment system</p>
//                 </div>
//               </li>
//               <li>
//                 <span className="benefit-icon">🎯</span>
//                 <div>
//                   <strong>Targeted Marketing</strong>
//                   <p>Reach the right customers with our marketing tools</p>
//                 </div>
//               </li>
//               <li>
//                 <span className="benefit-icon">📞</span>
//                 <div>
//                   <strong>24/7 Support</strong>
//                   <p>Get help whenever you need it with our support team</p>
//                 </div>
//               </li>
//             </ul>
//           </div>

//           <div className="contact-info">
//             <h4>Need Help?</h4>
//             <p>Email: vendors@marketplace.com</p>
//             <p>Phone: +1 (800) 123-4567</p>
//             <p>Business Hours: Mon-Fri, 9AM-6PM EST</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApplyVendor;
import React, { useState } from "react";
// import "./ApplyVendor.css";
import api from "../../services/api"; // Adjust path based on your structure

const ApplyVendor = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    description: "",
    website: "",
    address: "",
    taxId: "",
    agreeTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare data for API
      const applicationData = {
        businessName: formData.businessName,
        contactName: formData.contactName,
        phone: formData.phone,
        businessType: formData.businessType,
        description: formData.description,
        website: formData.website || "",
        address: formData.address,
        taxId: formData.taxId || ""
      };

      const response = await api.submitVendorApplication(applicationData);
      
      if (response.data.success) {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Reset form
        setFormData({
          businessName: "",
          contactName: "",
          email: "",
          phone: "",
          businessType: "",
          description: "",
          website: "",
          address: "",
          taxId: "",
          agreeTerms: false
        });
      } else {
        setError(response.data.message || "Failed to submit application");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const businessTypes = [
    // "Fashion & Apparel",
    // "Electronics",
    // "Home & Garden",
    // "Health & Beauty",
    // "Food & Beverage",
    // "Art & Crafts",
    // "Sports & Outdoors",
    // "Books & Stationery",
    // "Other"
    "Bus",
    "Train",
    "Plane",
    "Car Rental",
    "CNG",
    "Bike Rental",
    "Boat",
    "Yath",
    "Other",
  ];

  return (
    <div className="apply-vendor-container">
      <div className="vendor-hero">
        <div className="hero-content">
          <h1 className="hero-title">Join Our Marketplace</h1>
          <p className="hero-subtitle">
            Become a vendor and reach millions of customers worldwide
          </p>
          <div className="hero-features">
            <div className="feature">
              <span className="feature-icon">🚀</span>
              <span>Grow Your Business</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🌍</span>
              <span>Global Reach</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🛡️</span>
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </div>

      <div className="vendor-form-wrapper">
        <div className="form-container">
          <div className="form-header">
            <h2>Vendor Application Form</h2>
            <p>Fill out the form below to start your journey with us</p>
          </div>

          {error && (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          )}

          {submitSuccess ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Application Submitted Successfully!</h3>
              <p>We'll review your application and contact you within 3-5 business days.</p>
              <p>You can check your application status in your dashboard.</p>
              <button 
                className="btn-secondary"
                onClick={() => setSubmitSuccess(false)}
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="vendor-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="businessName">
                    Business Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contactName">
                    Contact Person <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (123) 456-7890"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="businessType">
                    Business Type <span className="required">*</span>
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="taxId">Tax ID / EIN (Optional)</label>
                  <input
                    type="text"
                    id="taxId"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    placeholder="Enter tax ID if available"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">
                    Business Address <span className="required">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full business address including street, city, state, and zip code"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="website">Website (Optional)</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">
                    Business Description <span className="required">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell us about your business, products, unique selling points, and why you want to join our marketplace..."
                    rows="4"
                    required
                  />
                  <small className="char-count">
                    {formData.description.length}/500 characters
                  </small>
                </div>
              </div>

              <div className="terms-group">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="agreeTerms">
                  I agree to the <a href="/terms" className="terms-link">Terms & Conditions</a> and 
                  <a href="/privacy" className="terms-link"> Privacy Policy</a> <span className="required">*</span>
                </label>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>

              <p className="form-footer">
                We'll review your application within 3-5 business days. You'll receive an email notification once your application is reviewed.
              </p>
            </form>
          )}
        </div>

        <div className="benefits-sidebar">
          <div className="benefits-card">
            <h3>Why Join Us?</h3>
            <ul className="benefits-list">
              <li>
                <span className="benefit-icon">💼</span>
                <div>
                  <strong>Easy Setup</strong>
                  <p>Get started in minutes with our simple onboarding</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">📈</span>
                <div>
                  <strong>Sales Dashboard</strong>
                  <p>Track your performance with real-time analytics</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">🔒</span>
                <div>
                  <strong>Secure Payments</strong>
                  <p>Get paid on time with our secure payment system</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">🎯</span>
                <div>
                  <strong>Targeted Marketing</strong>
                  <p>Reach the right customers with our marketing tools</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">📞</span>
                <div>
                  <strong>24/7 Support</strong>
                  <p>Get help whenever you need it with our support team</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="contact-info">
            <h4>Need Help?</h4>
            <p>Email: vendors@marketplace.com</p>
            <p>Phone: +1 (800) 123-4567</p>
            <p>Business Hours: Mon-Fri, 9AM-6PM EST</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyVendor;