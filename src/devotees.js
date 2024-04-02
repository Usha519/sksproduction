import { Link } from "react-router-dom";
import Nav from "./nav";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "./assets/sl_031623_56570_58.jpg";
import logo1 from "./assets/icons8-view-30.png";
import logo2 from "./assets/icons8-edit-25.png";
import logo3 from "./assets/icons8-delete-30.png";
import { BASE_URL } from "./api";
import "./App.css";
import "./table.css";
Modal.setAppElement("#root");

const Devotee = () => {
  const [hasError, setHasError] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editDevoteeId, setEditDevoteeId] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token")); // Added state for token
  const [reload, setReload] = useState(false)

  const [devotee, setDevotee] = useState({
    name: "",
    mail: "",
    mobile: "",
    gender: "",
    age: "",
    language: "",
    country: "",
    address: {
      dno: "",
      street: "",
      villageCity: "",
      state: "",
    },
    image_id:""
  });
  const [errors, setErrors] = useState({});
  const [devoteesList, setDevoteesList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDevotees = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/get_all_devotees?page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setReload(false)
          setDevoteesList(data.devotees);
          setTotalPages(data.total_pages);
        } else {
          console.error("Error fetching devotees:", data.message);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };
    fetchDevotees();
  }, [reload, currentPage, showModal, totalPages]);


  const handleEditDevotee = (devoteeId) => {
    const devoteeToEdit = devoteesList.find(
      (devotee) => devotee._id === devoteeId
    );
    if (devoteeToEdit) {
      setIsEditMode(true);
      setEditDevoteeId(devoteeId);
      setDevotee({
        name: devoteeToEdit.name,
        mail: devoteeToEdit.mail,
        mobile: devoteeToEdit.mobile,
        gender: devoteeToEdit.gender,
        age: devoteeToEdit.age,
        language: devoteeToEdit.language,
        country: devoteeToEdit.country,
        address: {
          dno: devoteeToEdit.address.dno,
          street: devoteeToEdit.address.street,
          villageCity: devoteeToEdit.address.villageCity,
          state: devoteeToEdit.address.state,
        },
        image_id:devoteeToEdit.image_id
      });
      // Reset errors state
      setErrors({});
      setShowModal(true);
    }
  };

  const handleAddOrUpdateDevotee = async (event) => {
    event.preventDefault();
    if (isEditMode && editDevoteeId) {
      await updateDevotee(editDevoteeId);
    } else {
      // Validate before adding new devotee
      const isValid = validateForm();
      if (isValid) {
        await addDevotee();
      } else {
        toast.error("Please fill in all required fields correctly!", {
          position: toast.POSITION.TOP_RIGHT,
          autoclose: 300,
        });
      }
    }
  };
  const handleDeleteDevotee = async (devoteeId) => {
    try {
      const response = await fetch(`${BASE_URL}/delete_devotee/${devoteeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReload(true)
        // Remove the deleted devotee from the list
        setDevoteesList(
          devoteesList.filter((devotee) => devotee._id !== devoteeId)
        );
        toast.success("Devotee Deleted Successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoclose: 300,
        });
      } else {
        const errorData = await response.json();
        console.error("Error deleting devotee:", errorData.message);
        // Handle error scenarios, show error message, etc.
      }
    } catch (error) {
      console.error("Error:", error.message);
      // Handle error scenarios
    }
  };

  const addDevotee = async () => {
    try {
      const response = await fetch(`${BASE_URL}/add_devotee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(devotee),
      });

      const res = await response.json();

      if (res && res.status_code === 200) {
        console.log("Devotee added successfully:", res.message);
        setDevoteesList((prevDevotees) => [...prevDevotees, res.devotee]);
        setShowModal(false);
        setErrors({}); // Reset errors state when devotee is added successfully
        toast.success("Devotee Added successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoclose: 300,
        });
      } else if (res && res.status_code === 401) {
        // Devotee already exists
        console.warn("Devotee already exists:", res.message);
        toast.warning(`devotee already exists!`, {
          position: toast.POSITION.TOP_RIGHT,
          autoclose: 300,
        });
      } else {
        // Handle other error cases
        console.error("Error adding devotee:", res.message);
        toast.error("Error adding devotee. Please try again later.", {
          position: toast.POSITION.TOP_RIGHT,
          autoclose: 300,
        });
      }
    } catch (error) {
      // Handle network errors
      console.error("Network error:", error.message);
      toast.error("Network error. Please check your internet connection.", {
        position: toast.POSITION.TOP_RIGHT,
        autoclose: 300,
      });
    }
  };


  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Validate name
    if (!devotee.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    // Validate email
    if (!devotee.mail.trim() || !/^\S+@\S+\.\S+$/.test(devotee.mail)) {
      newErrors.mail = "Valid email is required";
      valid = false;
    }

    // Validate mobile
    if (!devotee.mobile.trim() || !/^\d{10}$/.test(devotee.mobile)) {
      newErrors.mobile = "Valid 10-digit mobile number is required";
      valid = false;
    }

    // Validate gender
    if (!devotee.gender.trim()) {
      newErrors.gender = "Gender is required";
      valid = false;
    }

    // Validate age
    if (!devotee.age.trim()) {
      newErrors.age = "Age is required";
      valid = false;
    } else if (isNaN(devotee.age) || parseInt(devotee.age) < 0) {
      newErrors.age = "Age must be a non-negative integer";
      valid = false;
    }

    // Validate language
    if (!devotee.language.trim()) {
      newErrors.language = "Language is required";
      valid = false;
    }

    // Validate country
    if (!devotee.country.trim()) {
      newErrors.country = "Country is required";
      valid = false;
    }

    // Validate address
    if (!devotee.address.state.trim()) {
      newErrors.address = { ...newErrors.address, state: "state is required" };
      valid = false;
    }

    // Validate country
    if (!devotee.image_id.trim()) {
      newErrors.country = "image_id is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    validateField(name, value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Clear the error message for the field being edited
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
      address: {
        ...prevErrors.address,
        [name.split(".")[1]]: "", // Clear nested address field error if any
      },
    }));

    // If the field is part of the nested address object
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1]; // Extract the nested field name
      setDevotee((prevDevotee) => ({
        ...prevDevotee,
        address: {
          ...prevDevotee.address,
          [addressField]: value,
        },
      }));
    } else {
      // For top-level fields like name, mail, gender, etc.
      setDevotee((prevDevotee) => ({
        ...prevDevotee,
        [name]: value,
      }));
    }

    // Validate field dynamically
    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };



  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        }
        break;
      case "mail":
        if (!value.trim() || !/^\S+@\S+\.\S+$/.test(value)) {
          error = "Valid email is required";
        }
        break;
      case "mobile":
        if (!value.trim() || !/^\d{10}$/.test(value)) {
          error = "Valid 10-digit mobile number is required";
        }
        break;
      case "gender":
        if (!value.trim()) {
          error = "Gender is required";
        }
        break;
      case "age":
        if (!value.trim()) {
          error = "Age is required";
        } else if (isNaN(value) || parseInt(value) < 0) {
          error = "Age must be a non-negative integer";
        }
        break;
      case "language":
        if (!value.trim()) {
          error = "Language is required";
        }
        break;
      case "country":
        if (!value.trim()) {
          error = "Country is required";
        }
        break;
      case "address.state":
        if (!value.trim()) {
          error = "State is required";
        }
        break;
      case "image_id":
        if (!value.trim()) {
          error = "Image_id is required";
        }
        break;
      default:
        break;
    }

    return error;
  };




  const updateDevotee = async (devoteeId) => {
    try {
      const response = await fetch(`${BASE_URL}/update_devotee/${devoteeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(devotee),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("devotee updated successfully:", data.message);
        const updatedDevoteesList = devoteesList.map((devotee) =>
          devotee._id === devoteeId ? data.devotee : devotee
        );
        setDevoteesList(updatedDevoteesList);
        setShowModal(false);
        toast.success("Devotee Updated successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoclose: 300,
        });
      } else {
        const errorData = await response.json();
        console.error("Error updating devotee:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const openModal = () => {
    setIsEditMode(false); // Reset the edit mode when opening the modal
    setShowModal(true);
    setDevotee({
      name: "",
      mail: "",
      mobile: "",
      gender: "",
      age: "",
      language: "",
      country: "",
      address: {
        dno: "",
        street: "",
        villageCity: "",
        state: "",
      },
      image_id:"",
    });
    setErrors({});
  };
  const closeModal = () => {
    setShowModal(false);
    setErrors({}); // Reset errors state when modal is closed
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`, // Add your authentication token here
            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const imageData = await response.json();
        console.log('Image uploaded:', imageData);
        setDevotee({
          ...devotee,
          image_id: imageData._id // Assuming the image ID field is '_id', adjust it according to your backend response
      });
        toast.success("Image uploaded Successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoclose: 300,
        });
      }
        
        
        // Handle the response as needed (e.g., update state, display success message)
     catch (error) {
        console.error('Error uploading image:', error.message);
        // Handle errors (e.g., display error message)
        toast.success("Image upload fail!", {
          position: toast.POSITION.TOP_RIGHT,
          autoclose: 300,
        });
      }
    
};

  return (
    <>
      <Nav></Nav>
      <br /> <br /> <br />
      <section className="container-fluid ">
        <div className="row">
          <div className="col-mb-6">
            <div className="row">
              <div className="col-md-4 col-3">
                <div className="text-ster top">
                  <input
                    type="text"
                    placeholder="Search by mobile"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="input rounded"
                  />
                </div>
              </div>
              <div className="col-md-4 col-6 ">
                <div className="text-center">
                  <img
                    src={Logo}
                    className="img-fluid yoga1"
                    alt="..."

                  />
                </div>
              </div>
              <div className="col-md-4 col-3">
                <div className="text-end top">
                  <button
                    type="button"
                    className="btn btn-dark btn-sm  text-end rounded"
                    onClick={() => openModal()}
                  >
                    Add Devotee
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Modal
            isOpen={showModal}
            onRequestClose={closeModal}
            contentLabel="Add Devotee Modal"
            style={{
              overlay: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
              content: {
                position: "relative",
                top: "10px",
                left: "auto",
                right: "auto",
                bottom: "auto",
                maxWidth: "600px",
                maxHeight: "75vh",
                padding: "20px",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.5)",
                overflow: "auto",
              },
            }}
          >
            <form
              onSubmit={handleAddOrUpdateDevotee}
              className="p-2"
              noValidate
            >
              <h3 className="text-dark form-outline mb-2   ">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Devotee Form
              </h3>
              <div className="d-grid gap-2">
                <div className="mb-1">
                  <label className="form-label" htmlFor="form6Example1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="form6Example1"
                    className={`form-control ${errors.name ? "is-invalid" : ""
                      }`}
                    value={devotee.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                <div className="mb-1">
                  <label className="form-label" htmlFor="form6Example2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="mail"
                    id="form6Example2"
                    className={`form-control ${errors.mail ? "is-invalid" : ""
                      }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={devotee.mail}
                  />
                  {errors.mail && (
                    <div className="invalid-feedback">{errors.mail}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="form6Example3">
                    Mobile
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    id="form6Example3"
                    value={devotee.mobile}
                    className={`form-control ${errors.mobile ? "is-invalid" : ""
                      }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.mobile && (
                    <div className="invalid-feedback">{errors.mobile}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label
                    value={devotee.gender}
                    className="form-label"
                    htmlFor="form6Example4"
                  >
                    Gender
                  </label>
                  <div className="row g-2 align-items-center">
                    <div className="col-md-6 mb-1 d-flex align-items-center">
                      <input
                        type="radio"
                        name="gender"
                        id="male"
                        value="male"
                        className="form-check-input"
                        onChange={handleChange}
                        checked={devotee.gender === "male"}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label ms-2" htmlFor="male">
                        Male
                      </label>
                    </div>
                    <div className="col-md-6 mb-1 d-flex align-items-center">
                      <input
                        type="radio"
                        name="gender"
                        id="female"
                        value="female"
                        className="form-check-input"
                        onChange={handleChange}
                        checked={devotee.gender === "female"}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label ms-2" htmlFor="female">
                        Female
                      </label>
                    </div>
                  </div>
                  {errors.gender && (
                    <div className="invalid-feedback d-block">
                      {errors.gender}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="form6Example5">
                    Age
                  </label>
                  <input
                    type="text"
                    name="age"
                    value={devotee.age}
                    id="form6Example5"
                    className={`form-control ${errors.age ? "is-invalid" : ""}`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  {errors.age && (
                    <div className="invalid-feedback">{errors.age}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Language</label>
                  <div className="row g-2 align-items-center">
                    <div className="col-md-6 mb-1 d-flex align-items-center">
                      <input
                        type="radio"
                        name="language"
                        id="telugu"
                        value="telugu"
                        className="form-check-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={devotee.language === "telugu"}
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor="telugu"
                        value={devotee.language}
                      >
                        Telugu
                      </label>
                    </div>
                    <div className="col-md-6 mb-1 d-flex align-items-center">
                      <input
                        type="radio"
                        name="language"
                        id="english"
                        value="english"
                        className="form-check-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={devotee.language === "english"}
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor="english"
                      >
                        English
                      </label>
                    </div>
                  </div>
                  {errors.language && (
                    <div className="invalid-feedback d-block">
                      {errors.language}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="form6Example8">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="form6Example8"
                    value={devotee.country}
                    className={`form-control ${errors.country ? "is-invalid" : ""
                      }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.country && (
                    <div className="invalid-feedback">{errors.country}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label" value={devotee.address}>
                    Address
                  </label>
                  <div className="row g-2">
                    <div className="col-md-6 mb-1 d-grid">
                      <label className="form-label" htmlFor="form6Example9">
                        DNo
                      </label>
                      <input
                        value={devotee.address.dno}
                        type="text"
                        name="address.dno"
                        id="form6Example9"
                        className={`form-control ${errors.address?.dno ? "is-invalid" : ""
                          }`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.address?.dno && (
                        <div className="invalid-feedback">
                          {errors.address.dno}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 mb-1 d-grid">
                      <label className="form-label" htmlFor="form6Example10">
                        Street
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={devotee.address.street}
                        id="form6Example10"
                        className={`form-control ${errors.address?.street ? "is-invalid" : ""
                          }`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.address?.street && (
                        <div className="invalid-feedback">
                          {errors.address.street}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-md-6 mb-1 d-grid">
                      <label className="form-label" htmlFor="form6Example11">
                        Village/City
                      </label>
                      <input
                        type="text"
                        value={devotee.address.villageCity}
                        name="address.villageCity"
                        id="form6Example11"
                        onBlur={handleBlur}
                        className={`form-control ${errors.address?.villageCity ? "is-invalid" : ""
                          }`}
                        onChange={handleChange}
                      />
                      {errors.address?.villageCity && (
                        <div className="invalid-feedback">
                          {errors.address.villageCity}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 mb-1 d-grid">
                      <label className="form-label" htmlFor="form6Example12">
                        State
                      </label>
                      <input
                        className={`form-control ${errors.address?.state ? "is-invalid" : ""
                          }`}
                        type="text"
                        value={devotee.address.state}
                        name="address.state"
                        id="form6Example6"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.address?.state && (
                        <div className="invalid-feedback">
                          {errors.address.state}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-1">
                  <label className="form-label" htmlFor="form6Example7">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    id="form6Example7"
                    className={`form-control ${errors.image ? "is-invalid" : ""}`}
                    onChange={handleImageChange}
                    onBlur={handleBlur}
                  />
                  {errors.image && (
                    <div className="invalid-feedback">{errors.image}</div>
                  )}
                </div>

                <div className="row g-2">
                  <div className="col-md-6 mb-1 d-grid">
                    <button type="submit" className="btn btn-dark rounded">
                      Submit
                    </button>
                  </div>
                  <div className="col-md-6 mb-1 d-grid">
                    <button
                      type="button"
                      className="btn btn-danger rounded"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </Modal>
          <div className="">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full align-middle md:px-6 lg:px-8">
                <div className="">
                  <div className=" mt-5">
                    <div className="card-table table-responsive rounded">
                      <div className="cart-product">
                        <table className="table table-responsive table-bordered table-hover text-center text-capitalize table-small-font">
                          <thead>
                            <tr className="table-dark text-light">
                              <th>S.No</th>
                              <th>name</th>
                              <th>Email Id</th>
                              <th>Mobile</th>
                              <th>Join Date</th>
                              <th>Profile</th>

                              <th>Edit</th>
                              <th>Delete</th>
                              {/* Added column for edit button */}
                            </tr>
                          </thead>
                          <tbody className=" fw-semibold ">
                            {devoteesList &&
                              devoteesList
                                .filter((devotee) => devotee) // Filter out undefined or null devotees
                                .filter((devotee) =>
                                  (devotee && devotee.name && devotee.name.toLowerCase().includes(searchInput.toLowerCase())) ||
                                  (devotee && devotee.mail && devotee.mail.toLowerCase().includes(searchInput.toLowerCase())) ||
                                  (devotee && devotee.mobile && devotee.mobile.toLowerCase().includes(searchInput.toLowerCase()))
                                )
                                .map((devotee, i) => (
                                  <tr key={devotee._id}>
                                    <td>{i + 1}</td>
                                    <td>{devotee && devotee.name}</td>
                                    <td>{devotee && devotee.mail}</td>
                                    <td>{devotee && devotee.mobile}</td>
                                    <td>{devotee && devotee.join_date}</td>
                                    <td>
                                      <button className="btn btn-light btn-sm text-light rounded shadow ">
                                        <Link
                                          className="nav-link text-dark text-center "
                                          to={`/devotee/${devotee._id}`}
                                        >
                                          <img src={logo1} className="img-fluid img21" />
                                        </Link>
                                      </button>
                                    </td>
                                    <td>
                                      <button
                                        className="btn btn-light btn-sm btn-md text-light rounded shadow  "
                                        onClick={() =>
                                          handleEditDevotee(devotee._id)
                                        }
                                      >
                                        <img src={logo2} className="img-fluid img21" />
                                      </button>
                                    </td>
                                    <td>
                                      <button className="btn btn-light btn-sm text-light rounded shadow ">
                                        <Link
                                          className="nav-link text-dark text-center"
                                          onClick={() => handleDeleteDevotee(devotee._id)}
                                        >
                                          <img src={logo3} className="img-fluid img21" />
                                        </Link>
                                      </button>
                                    </td>
                                  </tr>
                                ))}

                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pagination-container">
          <button
            className="pagination-btn prev-btn btn-sm fw-light    rounded"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="d-flex justify-content-center align-items-center">
            <span className="btn btn-dark btn-sm rounded me-2">
              {currentPage}
            </span>
            <span className="btn rounded btn-sm me-2 border fw-medium orange">OF</span>
            <span className="btn btn-secondary btn-sm rounded">
              {totalPages}
            </span>
          </div>
          <button
            className="pagination-btn btn-sm next-btn fw-light  rounded"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </section>
    </>
  );
};
export default Devotee;
