import React, { useState, useEffect } from "react";
import Nav from "./nav";
import { useParams } from "react-router-dom";
import { BASE_URL } from "./api";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Logo from "./assets/yoga33.png";
import Logo2 from "./assets/img101.png";
import "./donation.css";
import Logo3 from "./assets/img102.png";
import Pagination from "./pagination";
import same from "./assets/icons8-arrow-24.png";
import "./profile.css";
import logo3 from "./assets/icons8-delete-30.png";
const Profile1 = () => {
  const { courseId } = useParams();
  const token = localStorage.getItem("token");
  const [course, setCourse] = useState({});
  const [assignedDevotees, setAssignedDevotees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [devoteeInput, setDevoteeInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const devoteesPerPage = 5;
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  async function fetchCourseDetails() {
    try {
      const response = await fetch(
        `${BASE_URL}/get_course_details/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCourse(data.course_details);
        setAssignedDevotees(data.assigned_devotees);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  }

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId, token, showModal]);

  // Function to handle changes in devotee input
  // Function to handle changes in devotee input
  const handleDevoteeInput = (event) => {
    const value = event.target.value;
    setDevoteeInput(value);

    // Filter the devotee mobile numbers based on user input
    const filteredMobileNumbers = value
      ? filterData.filter((mobileNumber) => mobileNumber.includes(value))
      : [];

    // Update the state to reflect the filtered mobile numbers
    setData(filteredMobileNumbers);
  };

  // Function to handle enrollment of course
  const enrollCourse = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${BASE_URL}/add_course_to_devotee/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            // Send devotee input to the backend
            [getInputField(devoteeInput)]: devoteeInput,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Devotees added successfully:", data.message);
        setShowModal(false);
        toast.success(`Devotees added successfully to '${course.name}'.`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 300,
        });
      } else if (response.status === 400) {
        console.error("Error adding course:", data.message);
        toast.warning(`Maximum limit exceeded!`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 300,
        });
      } else if (response.status === 404) {
        console.error("Devotee not found");
        toast.warning(`Devotee not found`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 300,
        });
      } else {
        const errorMessage =
          data.message || "An error occurred while adding devotees.";
        console.error("Error adding devotees:", errorMessage);
        toast.error(errorMessage, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 300,
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Function to determine the input field based on user input
  const getInputField = (input) => {
    // Check if input is mail, mobile, or name
    if (input.includes("@")) {
      return "mail";
    } else if (!isNaN(input)) {
      return "mobile";
    } else {
      return "name";
    }
  };

  // Function to open modal
  const openModal = () => {
    setShowModal(true);
  };

  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Function to remove a course from a devotee
  const removeCourseFromDevotee = async (devoteeId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/remove_course_from_devotee/${courseId}/${devoteeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        // Refresh the data after successful removal
        fetchCourseDetails();
        toast.success("devotee removed successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 300,
        });
      } else {
        console.error(data.message);
        toast.error("Error removing course from devotee", {
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
  useEffect(() => {
    fetch(`${BASE_URL}/devotee_mobile_numbers/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((responseData) => {
        console.log(responseData);
        const mobileNumbers = responseData.devotee_mobile_numbers || []; // Ensure it's initialized with an empty array if responseData is undefined
        setFilterData(mobileNumbers);
        setDevoteeInput(""); // Clear the input field when new data is fetched
      })
      .catch((err) => console.log(err));
  }, []);

  // Empty dependency array means this effect runs only once on component mount
  const handleFilter = (value) => {
    const res = filterData.filter((f) => f.mobile.includes(value));
  };
  const handleBackward = () => {
    window.history.back();
  };
  // Function to handle clicking on a mobile number
  const handleMobileNumberClick = (clickedNumber) => {
    // Update the input field with the clicked number
    setDevoteeInput(clickedNumber);
    setData([]);
  };

  return (
    <>
      <Nav />
      <div className="container-fluid colt">
        <div className="row justify-content-center">
          <div className="col-md-3 col-sm-3  colm ">
            <div className=" col text-center ">
              <img src={Logo} className="img-fluid imgs4" alt="Logo" />
            </div>
            <div className=" col text-start ">
              <img src={Logo2} className="img-fluid  imgs5 " />
            </div>
          </div>
          <div className="col-md-9 col-sm-9">
            <div className="row">
              <div className=" text-end coln ">
                <img src={Logo3} className="img-fluid  imgs6" />
              </div>
              <div className="col-md-6 col-6">
                <button
                  type="button"
                  className="btn btn-dark btn-sm rounded shadow"
                  onClick={handleBackward}
                >
                  <img src={same} className="img-fluid" />
                </button>
              </div>

              <div className="col-md-6 col-6  text-end">
                <button
                  type="button"
                  className="btn btn-dark rounded shadow"
                  onClick={openModal}
                >
                  Enroll Course
                </button>
              </div>
            </div>

            {course && (
              <div className="table-responsive mt-4 ">
                <table className="table table-bordered table-hover">
                  <tbody className="shadow rounded">
                    <tr>
                      <td className="bg-secondary fw-bold text-light">Name:</td>
                      <td className="fw-semibold">{course.name}</td>
                      <td className=" fw-bold bg-secondary  text-light">
                        Duration:
                      </td>
                      <td className="fw-semibold">{course.duration}</td>
                    </tr>
                    <tr>
                      <td className="bg-secondary fw-bold text-light">
                        Start date:
                      </td>
                      <td className="fw-semibold ">{course.start_date}</td>
                      <td className=" fw-bold bg-secondary   text-light">
                        End date:
                      </td>
                      <td className="fw-semibold">{course.end_date}</td>
                    </tr>
                    <tr>
                      <td className="bg-secondary fw-bold text-light">
                        Limit:
                      </td>
                      <td className="fw-semibold ">{course.no_of_devotees}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {assignedDevotees && assignedDevotees.length > 0 && (
              <div className="table-responsive">
                <table className="table table-bordered table-hover text-center text-capitalize">
                  <thead className="table-dark text-light">
                    <tr>
                      <th>Sno</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Join Date</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedDevotees
                      .slice(
                        (currentPage - 1) * devoteesPerPage,
                        currentPage * devoteesPerPage
                      )
                      .map((devotee, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{devotee.name}</td>
                          <td>{devotee.mail}</td>
                          <td>{devotee.mobile}</td>
                          <td>{devotee.join_date}</td>
                          <td>
                            {/* Added delete button */}
                            <button
                              className="btn btn-light btn-sm rounded shadow "
                              onClick={() =>
                                removeCourseFromDevotee(devotee._id)
                              }
                            >
                              <img src={logo3} className="img-fluid img21" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="row mt-3">
              <div className="col text-end">
                <Pagination
                  currentPage={currentPage}
                  coursesPerPage={devoteesPerPage}
                  totalCourses={assignedDevotees.length}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Add Devotees Modal"
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
        <form onSubmit={enrollCourse} className="p-2">
          <h3 className="text-dark form-outline mb-2">Add Bulk Devotees</h3>
          <div className="d-grid gap-2">
            <div className="mb-1 position-relative">
              <label className="form-label" htmlFor="devoteeInput">
                Enter name,mail,search mobile
              </label>
              <input
                type="text"
                name="devoteeInput"
                id="devoteeInput"
                className="form-control"
                value={devoteeInput}
                onChange={handleDevoteeInput}
                placeholder=""
              />
              {/* Display filtered mobile numbers */}
              <div className="suggested-mobile-container">
                {data.map((mobileNumber, index) => (
                  <div
                    key={index}
                    onClick={() => handleMobileNumberClick(mobileNumber)}
                    className="suggested-mobile-item"
                  >
                    {mobileNumber}
                  </div>
                ))}
              </div>
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
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Profile1;
