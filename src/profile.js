import Nav from "./nav";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import Logo2 from "./assets/img101.png";
import Logo3 from "./assets/img102.png";
import Logo from "./assets/2150771049.jpg";
import same from "./assets/icons8-arrow-24.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./profile.css";
import { BASE_URL } from "./api";
import logo3 from "./assets/icons8-delete-30.png";
import logo4 from "./assets/Cute_realistic_a_Adolescent_men_with_a_smile_on_.jpg"

const Profile = () => {
  const token = localStorage.getItem("token");
  const { devoteeId } = useParams();

  const [successMessage, setSuccessMessage] = useState("");
  const [donations, setDonations] = useState([]);
  const [assigned_courses, setAssigned_courses] = useState([]);
  const [devotee, setDevotee] = useState([]);
  const [courses, setCourses] = useState([]);
  const [addCourseDevotee, setAddCourseDevotee] = useState({
    course_name: "",
  });
  const [addDonation, setAddDonation] = useState({
    amount_to_donate: "",
    paymentMode: "",
  });
  const [accordionState, setAccordionState] = useState({
    assigned_courses: false,
    donations: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showAssignedCourses, setShowAssignedCourses] = useState(false);
  const [showDonations, setShowDonations] = useState(false);
  const [devoteeImage, setDevoteeImage] = useState(null);


  const handleForward = () => {
    window.history.forward();
  };

  const handleBackward = () => {
    window.history.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const fetchData = async () => {
    try {
      const responseDevotee = await fetch(
        `${BASE_URL}/get_devotee_details/${devoteeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataDevotee = await responseDevotee.json();
      if (responseDevotee.ok) {
        setDevotee(dataDevotee.devotee_details);
        setAssigned_courses(dataDevotee.assigned_courses);
        setDonations(dataDevotee.donations);

        // Assuming image_id is part of devotee_details, you can extract it here
        const imageId = dataDevotee.devotee_details.image_id;
        // Now you can use this imageId to fetch the image
        fetchImage(imageId);

      } else {
        console.error("Error fetching devotee details:", dataDevotee.message);
      }

      const responseCourses = await fetch(`${BASE_URL}/get_all_courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataCourses = await responseCourses.json();
      if (responseCourses.ok) {
        setCourses(dataCourses.courses);
      } else {
        console.error("Error fetching courses:", dataCourses.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [devoteeId, token, showModal1, showModal]);

  const toggleAccordion = (section) => {
    setAccordionState((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const fetchImage = async (imageId) => {
    try {
      const response = await fetch(`${BASE_URL}/get_image/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const imageData = await response.json();
      if (response.ok) {
        // Assuming the image URL is returned in the response data
        const imageUrl = imageData.url;
        // Set the image URL in the state to display in the UI
        setDevoteeImage(imageUrl);
      } else {
        console.error("Error fetching image:", imageData.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  

  const handleAddDevoteeToCourse = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${BASE_URL}/add_devotee_to_course/${devoteeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            course_name: addCourseDevotee.course_name,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        console.log("Course added successfully:", data.message);
        setShowModal(false);
        toast.success(
          `Course '${addCourseDevotee.course_name}' added successfully`,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 300,
          }
        );
      } else if (response.status === 400) {
        console.error("Error adding course:", data.message);
        toast.warning(`Maximum limit exceeded!`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 300,
        });
      } else if (response.status === 404) {
        console.error("Error adding course:", data.message);
        toast.warning(`${data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 300,
        });
      } else {
        console.error("Unknown error:", data.message);
        toast.error("An error occurred. Please try again later.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 300,
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleAddDonation = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/add_donation/${devoteeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount_to_donate: addDonation.amount_to_donate,
          paymentMode: addDonation.paymentMode, // Include the payment method in the request
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Donation added successfully:", data.message);
        // console.log("Payment Method:", payment_method); // Output payment method to console
        setShowModal1(false);
        toast.success(`Donation added successfully`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 300,
        });
      } else {
        console.error("Error adding Donation:", data.message);
        toast.warning("Error in adding Donation", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 300,
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddCourseDevotee((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };
  // Handle change in Payment Method

  const handleChangeDonation = (event) => {
    const { name, value } = event.target;
    setAddDonation((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  const [assignedCoursesCount, setAssignedCoursesCount] = useState({
    assigned_courses: 0,
    donations: 0,
  });

  useEffect(() => {
    // Update assigned courses count when devotee.courses or donations change
    setAssignedCoursesCount({
      assigned_courses: assigned_courses ? assigned_courses.length : 0,
      donations: donations ? donations.length : 0,
    });
  }, [devotee.courses, donations]);

  const handleBackClick = () => {
    window.location.href = "/devotees";
  };

  const openModal = () => {
    setShowModal(true);
  };

  const openModal1 = () => {
    setShowModal1(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeModal1 = () => {
    setShowModal1(false);
  };

  const handleRemoveDevoteeFromCourse = async (courseId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/remove_devotee_from_course/${devoteeId}/${courseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Devotee removed successfully:", data.message);
        // Reload data after successful removal
        fetchData();
        toast.success("Devotee removed from course successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 300,
        });
      } else {
        console.error("Error removing devotee from course:", data.message);
        toast.error("Error removing devotee from course", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 300,
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("An error occurred. Please try again later.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 300,
      });
    }
  };

  return (
    <>
      <Nav></Nav>
      <div
        className="container-fluid 
      "
      >
        <div className="row">
          <div className="col-md-3 col-sm-6 colm  fixed-column mixed-color  ">
            <div className="col text-center ">
              <img
                 src={devoteeImage} alt="Devotee Image"

                className="img-fluid  imgs rounded-4 shadow-lg "
              />
              <h1 className="text-center fw-medium ">{devotee.name} </h1>
            </div>
            <div className="col text-start ">
              <img src={Logo2} className="img-fluid  imgs1 " />
            </div>
          </div>
          <div className="col-md-9 col-sm-6 scrollable-column ">
            <div className="row">
              <div className=" text-end coln ">
                <img src={Logo3} className="img-fluid  imgs2 " />
              </div>
              <div className="col-md-6">
                <button
                  type="button"
                  className="btn btn-dark btn-sm text-light shadow button space "
                  onClick={handleBackward}
                >
                  <img src={same} className="img-fluid" />
                </button>
              </div>
              <div className="text-end col-md-6">
                <button
                  type="button"
                  className="btn btn-dark btn-sm rounded shadow button "
                  onClick={() => openModal1()}
                >
                  Donate
                </button>
                &nbsp;
                <button
                  type="button"
                  className="btn btn-dark rounded btn-sm shadow button "
                  onClick={() => openModal()}
                >
                  Course Enroll
                </button>
              </div>
            </div>
            <br />
            <div className="table-responsive">
              <table className="table card-table">
                <tbody className="shadow">
                  <tr>
                    <td className="bg-secondary text-light fw-bold">Name:</td>
                    <td className="fw-semibold">{devotee.name}</td>
                    <td className="bg-secondary text-light fw-bold">Email:</td>
                    <td className="fw-semibold">{devotee.mail}</td>
                  </tr>
                  <tr>
                    <td className="bg-secondary text-light fw-bold">Mobile:</td>
                    <td className="fw-semibold">{devotee.mobile}</td>
                    <td className="bg-secondary text-light fw-bold">Gender:</td>
                    <td className="fw-semibold">{devotee.gender}</td>
                  </tr>
                  <tr>
                    <td className="bg-secondary text-light fw-bold">Age:</td>
                    <td className="fw-semibold">{devotee.age}</td>
                    <td className="bg-secondary text-light fw-bold">
                      Join Date:
                    </td>
                    <td className="fw-semibold">{devotee.join_date}</td>
                  </tr>
                  <tr>
                    <td className="bg-secondary text-light fw-bold">
                      Language:
                    </td>
                    <td className="fw-semibold">{devotee.language}</td>
                    <td className="bg-secondary text-light fw-bold">
                      Country:
                    </td>
                    <td className="fw-semibold">{devotee.country}</td>
                  </tr>
                  <tr>
                    <td className="bg-secondary text-light fw-bold">DNO:</td>
                    <td className="fw-semibold">
                      {devotee.address && devotee.address.dno}
                    </td>
                    <td className="bg-secondary text-light fw-bold">Street:</td>
                    <td className="fw-semibold">
                      {devotee.address && devotee.address.street}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-secondary text-light fw-bold">
                      Village/City:
                    </td>
                    <td className="fw-semibold">
                      {devotee.address && devotee.address.villageCity}
                    </td>
                    <td className="bg-secondary text-light fw-bold">State:</td>
                    <td className="fw-semibold">
                      {devotee.address && devotee.address.state}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <br />

            <div className="accordion shadow rounded " id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingAssignedCourses">
                  <button
                    className={`accordion-button fw-bold  ${accordionState.assigned_courses ? "" : "collapsed"
                      }`}
                    type="button"
                    onClick={() => toggleAccordion("assigned_courses")}
                  >
                    Assigned Courses ({assignedCoursesCount.assigned_courses})
                  </button>
                </h2>{" "}
                <br />
                <div
                  className={`accordion-collapse ${accordionState.assigned_courses ? "show" : "collapse"
                    }`}
                  id="collapseAssignedCourses"
                >
                  <div className="accordion-body pg">
                    {assigned_courses && assigned_courses.length > 0 && (
                      <table>
                        <thead>
                          <tr>
                            <th className="bg-dark text-light">Name</th>
                            <th className="bg-dark text-light">Duration</th>
                            <th className="bg-dark text-light">Start Date</th>
                            <th className="bg-dark text-light">End Date</th>
                            <th className="bg-dark text-light">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {assigned_courses.map((course, index) => (
                            <tr key={index}>
                              <td>{course.name}</td>
                              <td>{course.duration}</td>
                              <td>{course.start_date}</td>
                              <td>{course.end_date}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-light btn-sm shadow "
                                  onClick={() =>
                                    handleRemoveDevoteeFromCourse(course._id)
                                  }
                                >
                                  <img
                                    src={logo3}
                                    className="img-fluid img21"
                                  />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header  " id="headingDonations">
                  <button
                    className={`accordion-button fw-bold  ${accordionState.donations ? "" : "collapsed"
                      }`}
                    type="button"
                    onClick={() => toggleAccordion("donations")}
                  >
                    Donations ({assignedCoursesCount.donations})
                  </button>
                </h2>
                <div
                  className={`accordion-collapse ${accordionState.donations ? "show" : "collapse"
                    }`}
                  id="collapseDonations"
                >
                  <div className="accordion-body">
                    {donations.length > 0 && (
                      <table>
                        <thead>
                          <tr>
                            <th className="bg-dark text-light ">Donation</th>
                            <th className="bg-dark text-light ">
                              Amount Donated
                            </th>
                            <th className="bg-dark text-light ">PaymentMode</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.map((donation, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{donation.amount_to_donate}</td>
                              <td>{donation.paymentMode}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <br />

            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}

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
                  left: "20px",
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
              <form onSubmit={handleAddDevoteeToCourse}>
                <h3 className="text-dark rounded form-outline mb-2  ">
                  Add Course Enroll
                </h3>
                <div className="d-grid gap-2">
                  <div className="mb-1">
                    <label className="form-label" htmlFor="form6Example1">
                      Select Course
                    </label>
                    <select
                      name="course_name"
                      id="form6Example1"
                      className="form-select"
                      onChange={handleChange}
                      value={addCourseDevotee.course_name}
                    >
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course.name}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row g-2">
                    <div className="col-md-6 mb-1 d-grid">
                      <button type="submit" className="btn btn-dark rounded-2">
                        Enroll
                      </button>
                    </div>
                    <div className="col-md-6 mb-1 d-grid">
                      <button
                        type="button"
                        className="btn btn-danger rounded-2"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </Modal>
            <Modal
              isOpen={showModal1}
              onRequestClose={closeModal1}
              contentLabel="Add Donation Modal"
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
                  maxWidth: "600px", // Adjust this width as needed
                  maxHeight: "75vh", // Adjust this height as needed
                  padding: "20px",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.5)",
                  overflow: "auto",
                },
              }}
            >
              <form onSubmit={handleAddDonation} className="p-2">
                <h3 className="text-dark form-outline mb-2  rounded ">
                  Add Donation
                </h3>
                <div className="d-grid gap-2">
                  <div className="mb-1">
                    <label className="form-label" htmlFor="form6Example1">
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount_to_donate"
                      id="form6Example1"
                      className="form-control"
                      onChange={handleChangeDonation}
                    />
                  </div>

                  {/* Add Payment Method dropdown */}
                  <div className="mb-1">
                    <label className="form-label" htmlFor="form6Example1">
                      Payment Method
                    </label>
                    <select
                      id="form6Example1"
                      name="paymentMode"
                      className="form-control"
                      onChange={handleChangeDonation}
                    >
                      <option value="-1"> Select PaymentMethod</option>
                      <option value="cash">Cash</option>
                      <option value="credit card">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="phone pay">Phone pay</option>
                      <option value="googlepay">Googlepay</option>
                      <option value="paytem">Paytem</option>
                      {/* Add more options based on your needs */}
                    </select>
                  </div>

                  <div className="row g-2">
                    <div className="col-md-6 mb-1 d-grid">
                      <button type="submit" className="btn btn-dark rounded-2">
                        Submit
                      </button>
                    </div>
                    <div className="col-md-6 mb-1 d-grid">
                      <button
                        type="button"
                        className="btn btn-danger rounded-2"
                        onClick={closeModal1}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
//dummy commit
