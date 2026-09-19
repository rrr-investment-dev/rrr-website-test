import { useState, useEffect } from "react";
import { fetchFormConfig, submitInquiry } from "@/lib/api";

export default function DiscoveryCallForm() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetchFormConfig();
        
        let configFields = [];
        if (response && Array.isArray(response.data)) {
          configFields = response.data;
        } else if (Array.isArray(response)) {
          configFields = response;
        }
        
        // Sort fields by order
        configFields.sort((a, b) => (a.order || 0) - (b.order || 0));

        setFields(configFields);

        // Initialize values state
        const initialValues = {};
        configFields.forEach((field) => {
          if (field.type === "checkbox") {
            initialValues[field.name] = [];
          } else {
            initialValues[field.name] = "";
          }
        });
        setFormValues(initialValues);
      } catch (err) {
        console.error("Failed to load form config:", err);
        setErrorMsg("Failed to load form configuration. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  const handleChange = (name, value, isCheckbox = false) => {
    if (isCheckbox) {
      setFormValues((prev) => {
        const currentList = prev[name] || [];
        if (currentList.includes(value)) {
          return { ...prev, [name]: currentList.filter((item) => item !== value) };
        } else {
          return { ...prev, [name]: [...currentList, value] };
        }
      });
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    // Validate inputs
    for (const field of fields) {
      if (field.required) {
        const val = formValues[field.name];
        if (field.type === "checkbox") {
          if (!val || val.length === 0) {
            setErrorMsg(`"${field.label}" is required.`);
            setSubmitting(false);
            return;
          }
        } else {
          if (!val || String(val).trim() === "") {
            setErrorMsg(`"${field.label}" is required.`);
            setSubmitting(false);
            return;
          }
        }
      }
    }

    try {
      await submitInquiry(formValues);
      setSuccess(true);
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="skeleton-form">
        {[1, 2, 3].map((num) => (
          <div key={num} className="skeleton-field">
            <div className="skeleton-label-bar"></div>
            <div className="skeleton-input-bar"></div>
          </div>
        ))}
        <div className="skeleton-button-bar"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="form-success-container">
        <div className="success-icon-wrapper">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 className="success-title">Discovery Call Scheduled!</h2>
        <p className="success-message">
          Thank you for reaching out. We have successfully received your inquiry and will review it immediately. Our team will contact you shortly to schedule your call.
        </p>
      </div>
    );
  }

  return (
    <form className="dynamic-form" onSubmit={handleSubmit}>
      {errorMsg && <div className="form-error-banner">{errorMsg}</div>}

      {fields.map((field) => {
        const { _id, label, name, type, placeholder, required, options } = field;

        return (
          <div className="form-group" key={_id || name}>
            <label className="form-label" htmlFor={name}>
              {label}
              {required && <span className="required-star">*</span>}
            </label>

            {type === "textarea" ? (
              <textarea
                id={name}
                name={name}
                className="form-textarea"
                placeholder={placeholder}
                required={required}
                value={formValues[name] || ""}
                onChange={(e) => handleChange(name, e.target.value)}
              />
            ) : type === "select" ? (
              <select
                id={name}
                name={name}
                className="form-select"
                required={required}
                value={formValues[name] || ""}
                onChange={(e) => handleChange(name, e.target.value)}
              >
                <option value="">{placeholder || "-- Select Option --"}</option>
                {options &&
                  options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
              </select>
            ) : type === "radio" ? (
              <div className="options-group">
                {options &&
                  options.map((opt) => (
                    <label key={opt.value} className="option-item">
                      <input
                        type="radio"
                        name={name}
                        value={opt.value}
                        checked={formValues[name] === opt.value}
                        onChange={() => handleChange(name, opt.value)}
                        required={required}
                      />
                      {opt.label}
                    </label>
                  ))}
              </div>
            ) : type === "checkbox" ? (
              <div className="options-group">
                {options &&
                  options.map((opt) => (
                    <label key={opt.value} className="option-item">
                      <input
                        type="checkbox"
                        name={name}
                        value={opt.value}
                        checked={(formValues[name] || []).includes(opt.value)}
                        onChange={() => handleChange(name, opt.value, true)}
                      />
                      {opt.label}
                    </label>
                  ))}
              </div>
            ) : (
              <input
                id={name}
                name={name}
                type={type}
                className="form-input"
                placeholder={placeholder}
                required={required}
                value={formValues[name] || ""}
                onChange={(e) => handleChange(name, e.target.value)}
              />
            )}
          </div>
        );
      })}

      <button className="form-submit-btn" type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <div className="spinner"></div> Submitting...
          </>
        ) : (
          "Schedule Call"
        )}
      </button>
    </form>
  );
}
