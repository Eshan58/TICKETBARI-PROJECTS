import React, { useState } from "react";
import api from "../../services/api";

const ApplyVendor = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
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
  const [applicationId, setApplicationId] = useState("");

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
    
    // Validation
    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    if (formData.description.length < 50) {
      setError("Business description must be at least 50 characters");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // console.log("📤 Submitting vendor application...");
      
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

      // console.log("Application data:", applicationData);

      const response = await api.submitVendorApplication(applicationData);
      
      // console.log("✅ Application response:", response.data);
      
      if (response.data.success) {
        setApplicationId(response.data.data?.application?._id || "pending");
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Reset form
        setFormData({
          businessName: "",
          contactName: "",
          phone: "",
          businessType: "",
          description: "",
          website: "",
          address: "",
          taxId: "",
          agreeTerms: false
        });

        // Track successful submission
        localStorage.setItem('lastVendorApplication', new Date().toISOString());
        
      } else {
        setError(response.data.message || "Failed to submit application");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("❌ Error submitting application:", err);
      
      // Enhanced error messages
      let errorMsg = "Something went wrong. Please try again.";
      if (err.response) {
        if (err.response.status === 400) {
          errorMsg = err.response.data.message || "Please check your application details";
        } else if (err.response.status === 401) {
          errorMsg = "Please login to submit an application";
        } else if (err.response.data?.message) {
          errorMsg = err.response.data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      setIsSubmitting(false);
    }
  };

  const businessTypes = [
    "Bus Service",
    "Train Service", 
    "Airline/Aviation",
    "Car Rental Service",
    "CNG Service",
    "Bike Rental Service",
    "Boat/Launch Service",
    "Yacht Service",
    "Travel Agency",
    "Tour Operator",
    "Hotel/Resort",
    "Restaurant/Cafe",
    "Event Management",
    "Other Transportation",
    "Other"
  ];

  // Inline CSS styles
  const styles = {
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "20px"
    },
    hero: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      borderRadius: "20px",
      padding: "60px 40px",
      marginBottom: "40px",
      textAlign: "center"
    },
    heroTitle: {
      fontSize: "48px",
      fontWeight: "bold",
      marginBottom: "16px"
    },
    heroSubtitle: {
      fontSize: "20px",
      opacity: "0.9",
      marginBottom: "30px"
    },
    heroFeatures: {
      display: "flex",
      justifyContent: "center",
      gap: "40px",
      flexWrap: "wrap"
    },
    feature: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "16px"
    },
    formWrapper: {
      display: "flex",
      gap: "40px",
      flexWrap: "wrap"
    },
    formContainer: {
      flex: "2",
      minWidth: "300px",
      background: "white",
      borderRadius: "20px",
      padding: "40px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
    },
    formHeader: {
      textAlign: "center",
      marginBottom: "30px"
    },
    formHeaderH2: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#1a202c",
      marginBottom: "8px"
    },
    errorMessage: {
      background: "#fed7d7",
      border: "1px solid #fc8181",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "24px"
    },
    errorIcon: {
      fontSize: "24px",
      marginRight: "10px"
    },
    successMessage: {
      background: "#c6f6d5",
      border: "1px solid #9ae6b4",
      borderRadius: "12px",
      padding: "30px",
      textAlign: "center"
    },
    successIcon: {
      fontSize: "48px",
      color: "#38a169",
      marginBottom: "20px"
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "24px",
      marginBottom: "24px"
    },
    formGroup: {
      marginBottom: "20px"
    },
    fullWidth: {
      gridColumn: "1 / -1"
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#4a5568",
      marginBottom: "8px"
    },
    required: {
      color: "#e53e3e"
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      fontSize: "16px",
      transition: "all 0.3s",
      boxSizing: "border-box"
    },
    inputFocus: {
      borderColor: "#4299e1",
      outline: "none",
      boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)"
    },
    textarea: {
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      fontSize: "16px",
      resize: "vertical",
      minHeight: "100px",
      transition: "all 0.3s",
      boxSizing: "border-box"
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      fontSize: "16px",
      backgroundColor: "white",
      transition: "all 0.3s",
      boxSizing: "border-box"
    },
    charCount: {
      fontSize: "12px",
      color: "#718096",
      marginTop: "8px",
      display: "block"
    },
    termsGroup: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "30px",
      padding: "20px",
      background: "#f7fafc",
      borderRadius: "12px"
    },
    termsLink: {
      color: "#4299e1",
      textDecoration: "none",
      fontWeight: "600"
    },
    submitBtn: {
      width: "100%",
      padding: "16px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "18px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px"
    },
    submitBtnDisabled: {
      opacity: "0.6",
      cursor: "not-allowed"
    },
    formFooter: {
      fontSize: "14px",
      color: "#718096",
      textAlign: "center",
      marginTop: "20px",
      paddingTop: "20px",
      borderTop: "1px solid #e2e8f0"
    },
    benefitsSidebar: {
      flex: "1",
      minWidth: "300px"
    },
    benefitsCard: {
      background: "white",
      borderRadius: "20px",
      padding: "30px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
      marginBottom: "30px"
    },
    benefitsList: {
      listStyle: "none",
      padding: "0"
    },
    benefitItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "15px",
      marginBottom: "25px"
    },
    benefitIcon: {
      fontSize: "24px",
      minWidth: "40px",
      height: "40px",
      background: "#edf2f7",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    contactInfo: {
      background: "#f7fafc",
      borderRadius: "20px",
      padding: "30px"
    },
    spinner: {
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "3px solid rgba(255,255,255,0.3)",
      borderRadius: "50%",
      borderTopColor: "white",
      animation: "spin 1s ease-in-out infinite"
    }
  };

  // Add spinner animation
  const spinnerStyle = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={styles.container}>
      <style>{spinnerStyle}</style>
      
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Join Our Marketplace</h1>
        <p style={styles.heroSubtitle}>
          Become a vendor and reach millions of customers worldwide
        </p>
        <div style={styles.heroFeatures}>
          <div style={styles.feature}>
            <span>🚀</span>
            <span>Grow Your Business</span>
          </div>
          <div style={styles.feature}>
            <span>🌍</span>
            <span>Global Reach</span>
          </div>
          <div style={styles.feature}>
            <span>🛡️</span>
            <span>Secure Payments</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.formWrapper}>
        {/* Application Form */}
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formHeaderH2}>Vendor Application Form</h2>
            <p>Fill out the form below to start your journey with us</p>
          </div>

          {error && (
            <div style={styles.errorMessage}>
              <div style={{display: "flex", alignItems: "center", marginBottom: "10px"}}>
                <span style={styles.errorIcon}>⚠️</span>
                <h3 style={{margin: 0, color: "#c53030"}}>Error</h3>
              </div>
              <p style={{margin: 0, color: "#c53030"}}>{error}</p>
            </div>
          )}

          {submitSuccess ? (
            <div style={styles.successMessage}>
              <div style={styles.successIcon}>✅</div>
              <h3 style={{color: "#276749", marginBottom: "15px"}}>
                Application Submitted Successfully!
              </h3>
              <p style={{color: "#276749", marginBottom: "10px"}}>
                We'll review your application and contact you within 3-5 business days.
              </p>
              <p style={{color: "#276749", marginBottom: "20px"}}>
                You can check your application status in your dashboard.
              </p>
              {applicationId && (
                <p style={{
                  background: "white",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  marginBottom: "20px"
                }}>
                  <strong>Application ID:</strong> {applicationId}
                </p>
              )}
              <button 
                style={{
                  padding: "12px 30px",
                  background: "#38a169",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
                onClick={() => setSubmitSuccess(false)}
              >
                Submit Another Application
              </button>
              <p style={{marginTop: "20px", fontSize: "14px", color: "#4a5568"}}>
                <a href="/vendor/application-status" style={{color: "#4299e1", textDecoration: "none"}}>
                  Check your application status →
                </a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                {/* Business Name */}
                <div style={styles.formGroup}>
                  <label htmlFor="businessName" style={styles.label}>
                    Business Name <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Enter your business name"
                    required
                    style={styles.input}
                    onFocus={(e) => e.target.style = {...styles.input, ...styles.inputFocus}}
                    onBlur={(e) => e.target.style = styles.input}
                  />
                </div>

                {/* Contact Person */}
                <div style={styles.formGroup}>
                  <label htmlFor="contactName" style={styles.label}>
                    Contact Person <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                    style={styles.input}
                    onFocus={(e) => e.target.style = {...styles.input, ...styles.inputFocus}}
                    onBlur={(e) => e.target.style = styles.input}
                  />
                </div>

                {/* Phone Number */}
                <div style={styles.formGroup}>
                  <label htmlFor="phone" style={styles.label}>
                    Phone Number <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1234 567890"
                    required
                    style={styles.input}
                    onFocus={(e) => e.target.style = {...styles.input, ...styles.inputFocus}}
                    onBlur={(e) => e.target.style = styles.input}
                  />
                </div>

                {/* Business Type */}
                <div style={styles.formGroup}>
                  <label htmlFor="businessType" style={styles.label}>
                    Business Type <span style={styles.required}>*</span>
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                    style={styles.select}
                    onFocus={(e) => e.target.style = {...styles.select, ...styles.inputFocus}}
                    onBlur={(e) => e.target.style = styles.select}
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Tax ID */}
                <div style={styles.formGroup}>
                  <label htmlFor="taxId" style={styles.label}>
                    Tax ID / EIN (Optional)
                  </label>
                  <input
                    type="text"
                    id="taxId"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    placeholder="Enter tax ID if available"
                    style={styles.input}
                    onFocus={(e) => e.target.style = {...styles.input, ...styles.inputFocus}}
                    onBlur={(e) => e.target.style = styles.input}
                  />
                </div>

                {/* Business Address */}
                <div style={{...styles.formGroup, ...styles.fullWidth}}>
                  <label htmlFor="address" style={styles.label}>
                    Business Address <span style={styles.required}>*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full business address including street, city, and country"
                    rows="3"
                    required
                    style={styles.textarea}
                    onFocus={(e) => e.target.style = {...styles.textarea, ...styles.inputFocus}}
                    onBlur={(e) => e.target.style = styles.textarea}
                  />
                </div>

                {/* Website */}
                <div style={{...styles.formGroup, ...styles.fullWidth}}>
                  <label htmlFor="website" style={styles.label}>
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    style={styles.input}
                    onFocus={(e) => e.target.style = {...styles.input, ...styles.inputFocus}}
                    onBlur={(e) => e.target.style = styles.input}
                  />
                </div>

                {/* Business Description */}
                <div style={{...styles.formGroup, ...styles.fullWidth}}>
                  <label htmlFor="description" style={styles.label}>
                    Business Description <span style={styles.required}>*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell us about your business, services, unique selling points, and why you want to join our marketplace..."
                    rows="5"
                    required
                    minLength="50"
                    style={styles.textarea}
                    onFocus={(e) => e.target.style = {...styles.textarea, ...styles.inputFocus}}
                    onBlur={(e) => e.target.style = styles.textarea}
                  />
                  <small style={styles.charCount}>
                    {formData.description.length}/500 characters • Minimum 50 characters required
                  </small>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div style={styles.termsGroup}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer"
                  }}
                />
                <label htmlFor="agreeTerms" style={{fontSize: "14px", color: "#4a5568"}}>
                  I agree to the{" "}
                  <a href="/terms" style={styles.termsLink}>Terms & Conditions</a> and{" "}
                  <a href="/privacy" style={styles.termsLink}>Privacy Policy</a>{" "}
                  <span style={styles.required}>*</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  ...styles.submitBtn,
                  ...(isSubmitting ? styles.submitBtnDisabled : {})
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span style={styles.spinner}></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>

              {/* Form Footer */}
              <p style={styles.formFooter}>
                We'll review your application within 3-5 business days. 
                You'll receive an email notification once your application is reviewed.
                <br />
                <a href="/vendor/application-status" style={{color: "#4299e1", textDecoration: "none"}}>
                  Check existing application status
                </a>
              </p>
            </form>
          )}
        </div>

        {/* Benefits Sidebar */}
        <div style={styles.benefitsSidebar}>
          <div style={styles.benefitsCard}>
            <h3 style={{color: "#1a202c", marginBottom: "25px", fontSize: "24px"}}>Why Join Us?</h3>
            <ul style={styles.benefitsList}>
              <li style={styles.benefitItem}>
                <span style={styles.benefitIcon}>🚀</span>
                <div>
                  <strong style={{display: "block", marginBottom: "5px", color: "#2d3748"}}>
                    Easy Setup
                  </strong>
                  <p style={{margin: 0, color: "#718096", fontSize: "14px"}}>
                    Get started in minutes with our simple onboarding
                  </p>
                </div>
              </li>
              <li style={styles.benefitItem}>
                <span style={styles.benefitIcon}>📈</span>
                <div>
                  <strong style={{display: "block", marginBottom: "5px", color: "#2d3748"}}>
                    Sales Dashboard
                  </strong>
                  <p style={{margin: 0, color: "#718096", fontSize: "14px"}}>
                    Track your performance with real-time analytics
                  </p>
                </div>
              </li>
              <li style={styles.benefitItem}>
                <span style={styles.benefitIcon}>🔒</span>
                <div>
                  <strong style={{display: "block", marginBottom: "5px", color: "#2d3748"}}>
                    Secure Payments
                  </strong>
                  <p style={{margin: 0, color: "#718096", fontSize: "14px"}}>
                    Get paid on time with our secure payment system
                  </p>
                </div>
              </li>
              <li style={styles.benefitItem}>
                <span style={styles.benefitIcon}>🌍</span>
                <div>
                  <strong style={{display: "block", marginBottom: "5px", color: "#2d3748"}}>
                    Global Reach
                  </strong>
                  <p style={{margin: 0, color: "#718096", fontSize: "14px"}}>
                    Access millions of customers worldwide
                  </p>
                </div>
              </li>
              <li style={styles.benefitItem}>
                <span style={styles.benefitIcon}>📞</span>
                <div>
                  <strong style={{display: "block", marginBottom: "5px", color: "#2d3748"}}>
                    24/7 Support
                  </strong>
                  <p style={{margin: 0, color: "#718096", fontSize: "14px"}}>
                    Get help whenever you need it with our support team
                  </p>
                </div>
              </li>
            </ul>
          </div>
          
          <div style={styles.contactInfo}>
            <h4 style={{color: "#1a202c", marginBottom: "15px"}}>Need Help?</h4>
            <p style={{margin: "8px 0", color: "#4a5568"}}>Email: vendors@marketplace.com</p>
            <p style={{margin: "8px 0", color: "#4a5568"}}>Phone: +880 1712 345678</p>
            <p style={{margin: "8px 0", color: "#4a5568"}}>Business Hours: Mon-Fri, 9AM-6PM</p>
            <div style={{marginTop: "20px", padding: "15px", background: "white", borderRadius: "10px"}}>
              <p style={{margin: 0, fontSize: "14px", color: "#2d3748"}}>
                <strong>Note:</strong> Applications are typically reviewed within 3-5 business days.
              </p>
            </div>
          </div>

          {/* Application Process Info */}
          <div style={{
            marginTop: "30px",
            padding: "25px",
            background: "#f0f9ff",
            borderRadius: "15px",
            border: "1px solid #bee3f8"
          }}>
            <h4 style={{color: "#2b6cb0", marginBottom: "15px"}}>Application Process</h4>
            <ol style={{paddingLeft: "20px", color: "#4a5568"}}>
              <li style={{marginBottom: "10px"}}>Submit this application form</li>
              <li style={{marginBottom: "10px"}}>Admin reviews your application</li>
              <li style={{marginBottom: "10px"}}>If approved, your account becomes "vendor"</li>
              <li style={{marginBottom: "10px"}}>Access vendor dashboard</li>
              <li>Start creating tickets and managing your business</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Debug Info (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          marginTop: "40px",
          padding: "20px",
          background: "#f7fafc",
          borderRadius: "15px",
          border: "1px solid #e2e8f0"
        }}>
          <details>
            <summary style={{cursor: "pointer", fontWeight: "600", color: "#4a5568"}}>
              Debug Information
            </summary>
            <div style={{
              marginTop: "15px",
              padding: "15px",
              background: "white",
              borderRadius: "10px",
              fontSize: "14px",
              fontFamily: "monospace"
            }}>
              <p>Form Data: {JSON.stringify(formData, null, 2)}</p>
              <p>Description length: {formData.description.length}</p>
              <p>Required minimum: 50 characters</p>
              <button 
                onClick={() => {
                  // console.log("Form Data:", formData);
                  // console.log("API Object:", {
                  //   businessName: formData.businessName,
                  //   contactName: formData.contactName,
                  //   phone: formData.phone,
                  //   businessType: formData.businessType,
                  //   description: formData.description,
                  //   website: formData.website,
                  //   address: formData.address,
                  //   taxId: formData.taxId
                  // });
                }}
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  background: "#4299e1",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Log to Console
              </button>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default ApplyVendor;