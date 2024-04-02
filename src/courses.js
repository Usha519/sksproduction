import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import courseimg from "./assets/6696.jpg";
import { BASE_URL } from "./api";
import logo1 from "./assets/icons8-view-30.png";
import logo2 from "./assets/edit.png";
import logo3 from "./assets/icons8-delete-30.png";
import "./App.css";
import Nav from "./nav"; // Import the Nav component

const Courses = () => {
  const token = localStorage.getItem("token");
  const [course, setCourse] = useState({
    courseName: "",
    courseDuration: "",
    start_date: "",
    end_date: "",
    no_of_devotees:"",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [coursesList, setCoursesList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errors, setErrors] = useState({
    courseName: "",
    courseDuration: "",
    start_date: "",
    end_date: "",
    no_of_devotees:"",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [reload,setReload]=useState(false)
  

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/get_all_courses?page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setReload(false)
          setCoursesList(data.courses);
          setTotalPages(data.total_pages);
        } else {
          console.error("Error fetching courses:", data.message);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchCourses();
  }, [reload,token, currentPage, course]);

  const handleAddOrUpdatecourse = async (event) => {
    event.preventDefault();
    if (isEditMode && editCourseId) {
      await handleUpdateCourse();
    } else {
      const isValid = validateInput();
      if (isValid) {
        await handleAddCourse();
      } else {
        toast.error("Please fill in all required fields correctly!", {
          position: toast.POSITION.TOP_RIGHT,
          autoclose:300,
        });
      }
    }
  };
  const filteredCourses = coursesList.filter(
    (course) =>
      course &&
      (course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.duration.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddCourse = async () => {
    try {
      const response = await fetch(`${BASE_URL}/add_course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: course.courseName,
          duration: course.courseDuration,
          start_date: course.start_date,
          end_date: course.end_date,
          no_of_devotees:course.no_of_devotees,
        }),
      });

      const res = await response.json();

      if (res && res.status_code === 200) {
        setCoursesList([...coursesList, res.course]);
        toast.success("Course Added Successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoclose: 300,
        });
        setCourse({
          courseName: "",
          courseDuration: "",
          start_date: "",
          end_date: "",
          no_of_devotees:"",
        });
        setShowModal(false);
      } else if (res && res.status_code === 401) {
        // Devotee already exists
        console.warn("start date should be greater", res.message);
        toast.warning(`start date should be greater!`, {
            position: toast.POSITION.TOP_RIGHT,
            autoclose: 300,
        });
    }
    else if (res && res.status_code === 400) {
      // Devotee already exists
      console.warn("course already exist", res.message);
      toast.warning(`Course already exists!`, {
          position: toast.POSITION.TOP_RIGHT,
          autoclose: 300,
      });
  }else {
        console.error("Error adding course:", res.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleEditCourse = (courseId) => {
    const courseToEdit = coursesList.find((course) => course._id === courseId);
    setIsEditMode(true);
    setEditCourseId(courseId);
    setCourse({
      courseName: courseToEdit.name,
      courseDuration: courseToEdit.duration,
      start_date: courseToEdit.start_date,
      end_date: courseToEdit.end_date,
      no_of_devotees:courseToEdit.no_of_devotees
    });
    setErrors({});
    setShowModal(true);
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

  const handleUpdateCourse = async () => {
    if (!validateInput()) {
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/update_course/${editCourseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: course.courseName,
            duration: course.courseDuration,
            start_date: course.start_date,
            end_date: course.end_date,
            no_of_devotees:course.no_of_devotees
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCoursesList((prevCourses) =>
          prevCourses.map((course) =>
            course._id === editCourseId ? data.course : course
          )
        );
        toast.success("Course Updated Successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoclose: 300,
        });
        setCourse({
          courseName: "",
          courseDuration: "",
          start_date: "",
          end_date: "",
          no_of_devotees:""
        });
        setShowModal(false);
      } else {
        console.error("Error updating course:", data.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const validateInput = () => {
    let valid = true;
    const newErrors = {};

    if (!course.courseName) {
      newErrors.courseName = "Course name is required";
      valid = false;
    }

    if (!course.courseDuration) {
      newErrors.courseDuration = "Duration is required";
      valid = false;
    }

    if (!course.start_date) {
      newErrors.start_date = "Start date is required";
      valid = false;
    }

    if (!course.end_date) {
      newErrors.end_date = "End date is required";
      valid = false;
    }

    if (!course.no_of_devotees) {
      newErrors.devotess = "no_of_devotees is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCourseChange = (event) => {
    const { name, value } = event.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(`${BASE_URL}/delete_course/${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setReload(true)
        setCoursesList(coursesList.filter((course) => course._id !== courseId));
        toast.success("Course Deleted Successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoclose: 300,
        });
      } else {
        const errorData = await response.json();
        console.error("Error deleting course:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const openModal = () => {
    setIsEditMode(false);
    setShowModal(true);
    setCourse({
      courseName: "",
      courseDuration: "",
      start_date: "",
      end_date: "",
      no_of_devotees:""
    });
    setErrors({});
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Nav /> {/* Include the Nav component */}
      <ToastContainer />
      <br /> <br />
      <br />
      <div className="container-fluid">
        <div className="row">
          <div className="col-mb-6">
            <div className="row">
              <div className="col-md-4 col-3 col-sm-4">
                <div className="text-ster top">
                  <input
                    type="text"
                    placeholder="Search by course name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className=" input rounded"
                  />
                </div>
              </div>
              <div className="col-md-4 col-6 col-sm-4 ">
                <div className="text-center">
                  <img
                    src={courseimg}
                    className="img-fluid cimg"
                    alt="..."
                    
                  />
                </div>
              </div>
              <div className="col-md-4 col-3 col-sm-4">
                <div className="text-end top">
                  <button
                    onClick={openModal}
                    className="btn btn-dark btn-sm rounded"
                  >
                    Add Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={showModal}
          onRequestClose={closeModal}
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
              maxWidth: "1500px",
              maxHeight: "75vh",
              padding: "20px",
              borderRadius: "10px",
              border: "none",
              boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.5)",
              overflow: "auto",
            },
          }}
        >
          {showModal && (
            <form onSubmit={handleAddOrUpdatecourse} className="p-2">
              <h3 className="text-dark form-outline mb-2">
                &nbsp;&nbsp;&nbsp;Course Form
              </h3>

              <div className="d-grid gap-2 ">
                <div className="mb-2">
                  <label className="form-label" htmlFor="form6Example1">
                    Course Name
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    id="form6Example1"
                    className={`form-control ${
                      errors.courseName && "is-invalid"
                    }`}
                    onChange={handleCourseChange}
                    value={course.courseName}
                  />
                  {errors.courseName && (
                    <div className="invalid-feedback">{errors.courseName}</div>
                  )}
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="form6Example1">
                    Duration Per Day
                  </label>
                  <input
                    type="text"
                    name="courseDuration"
                    id="form6Example1"
                    className={`form-control ${
                      errors.courseDuration && "is-invalid"
                    }`}
                    onChange={handleCourseChange}
                    value={course.courseDuration}
                  />
                  {errors.courseDuration && (
                    <div className="invalid-feedback">
                      {errors.courseDuration}
                    </div>
                  )}
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="form6Example5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    id="form6Example5"
                    className={`form-control ${
                      errors.start_date && "is-invalid"
                    }`}
                    onChange={handleCourseChange}
                    value={course.start_date}
                  />
                  {errors.start_date && (
                    <div className="invalid-feedback">{errors.start_date}</div>
                  )}
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="form6Example5">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    id="form6Example5"
                    className={`form-control ${
                      errors.end_date && "is-invalid"
                    }`}
                    onChange={handleCourseChange}
                    value={course.end_date}
                  />
                  {errors.end_date && (
                    <div className="invalid-feedback">{errors.end_date}</div>
                  )}
                </div>
                <div className="mb-2">
                  <label className="form-label" htmlFor="form6Example5">
                    Limit
                  </label>
                  <input
                    type="text"
                    name="no_of_devotees"
                    id="form6Example5"
                    className={`form-control ${
                      errors.no_of_devotees && "is-invalid"
                    }`}
                    onChange={handleCourseChange}
                    value={course.no_of_devotees}
                  />
                  {errors.no_of_devotees && (
                    <div className="invalid-feedback">{errors.no_of_devotees}</div>
                  )}
                </div>
                <div className="row g-2 ">
                  <div className="col-md-6 mb-2 d-grid">
                    <button type="submit" className="btn btn-dark rounded">
                      Submit
                    </button>
                  </div>
                  <div className="col-md-6 mb-2 d-grid">
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
          )}
        </Modal>
      </div>
      <div className="mt-6 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="container-fluid">
              <div className=" mt-5">
                <div className="card-table table-responsive rounded">
                  <div className="cart-product">
                    <table className="table table-responsive table-bordered table-hover text-center text-capitalize table-small-font">
                      <thead>
                        <tr className="table-dark text-light">
                          <th>S.No</th>
                          <th>name</th>
                          <th>Duration</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Profile</th>

                          <th>Edit</th>
                          <th>Delete</th>
                          {/* Added Edit column header */}
                        </tr>
                      </thead>
                      <tbody className="fw-semibold">
                        {filteredCourses.map((course, i) => (
                          <tr key={course._id}>
                            <td>{i + 1}</td>
                            <td>{course?.name}</td>
                            <td>{course?.duration}</td>
                            <td>{course?.start_date}</td>
                            <td>{course?.end_date}</td>
                            <td>
                              <button className="btn btn-light btn-sm text-light rounded shadow ">
                                <Link
                                  className="nav-link text-dark text-center"
                                  to={`/course/${course._id}`}
                                >
                                  <img
                                    src={logo1}
                                    className="img-fluid img21"
                                  />
                                </Link>
                              </button>
                            </td>
                            <td>
                              <button className="btn btn-light btn-sm btn-md text-light rounded shadow ">
                                <Link
                                  className="nav-link text-dark text-center"
                                  onClick={() => handleEditCourse(course._id)}
                                >
                                  <img
                                    src={logo2}
                                    className="img-fluid img21"
                                  />
                                </Link>
                              </button>
                            </td>
                            <td>
                              <button className="btn btn-light btn-sm text-light rounded shadow  ">
                                <Link
                                  className="nav-link text-dark text-center"
                                  onClick={() => handleDeleteCourse(course._id)}
                                >
                                  <img
                                    src={logo3}
                                    className="img-fluid img21"
                                  />
                                </Link>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                    <span className="btn rounded btn-sm me-2 border fw-medium   orange">
                      OF
                    </span>
                    <span className="btn btn-secondary btn-sm rounded">
                      {totalPages}
                    </span>
                  </div>
                  <button
                    className="pagination-btn btn-sm next-btn rounded fw-light "
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Courses;
