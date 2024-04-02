import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Nav from "./nav";
import DevoteeTile from "./devoteeTile";
import CourseTile from "./coursesTile";
import DonationTile from "./donationTile";

import DevoteeImg from "./assets/sl_031623_56570_41.jpg";
import DonationImg from "./assets/9189.jpg";
import Img from "./assets/SL-031623-56570-81.jpg";
import Title from "./assets/siva-kundalini-sadhana-high-resolution-logo-transparent (1).png";
import CourseImg from "./assets/3921140.jpg";
import { BASE_URL } from "./api";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [devoteesCount, setDevoteesCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [donationsCount, setDonationsCount] = useState(0);
  const [currentCourses, setCurrentCourses] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/get_counts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setDevoteesCount(data.devotees_count);
          setCoursesCount(data.courses_count);
          setDonationsCount(data.donations_count);
          setCurrentCourses(data.current_courses);
        } else {
          console.error("Error fetching counts:", data.message);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchCounts();
  }, [token]);

  return (
    <>
      <Nav />
      <br /> <br /> <br /> <br />
      <div className="text-center container">
        <img
          src={Title}
          className="img-fluid s"
          style={{ width: "500px" }}
          alt="Title"
        />
      </div>
      <br />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4 col-sm-6 col-lg-4 justify-content-center ">
            <div className="card shadow-lg rounded-5">
              <Link to="/devotees">
                <img
                  src={DevoteeImg}
                  className="card-img-top img-fluid rounded-5 equal-image-size"
                  alt="Devotees"
                />
              </Link>
              <DevoteeTile count={devoteesCount} />
            </div>
          </div>
          <div className="col-md-4 col-sm-6 col-lg-4">
            <div className="card shadow-lg rounded-5 text-center">
              <Link to="/courses">
                <img
                  src={CourseImg}
                  className="card-img-top img-fluid rounded-5 equal-image-size"
                  alt="Courses"
                />
              </Link>
              <CourseTile count={coursesCount} />
            </div>
          </div>
          <div className="col-md-4 col-sm-6 col-lg-4">
            <div className="card shadow-lg rounded-5">
              <NavLink to="/donation">
                <img
                  src={DonationImg}
                  className="card-img-top img-fluid rounded-5 equal-image-size"
                  alt="Donations"
                />
              </NavLink>
              <DonationTile count={donationsCount} />
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      {currentCourses && currentCourses.length > 0 && (
        <div className="text-center container ">
          <h3 className="fw-bold font-monospace img1">Current Courses</h3>
          <br />
          <div
            id="courseCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner hight">
              {currentCourses.map((course, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <div className="d-flex justify-content-around align-items-stretch">
                    {currentCourses.slice(index, index + 3).map((course, i) => (
                      <div
                        key={i}
                        className="card mx-3 rounded-5 border-1 shadow"
                        style={{ width: "23rem" }}
                      >
                        <div className="card-body">
                          <h4 className="card-title bg-dark fw-bold  text-light p-3 mb-0 rounded-top-5">
                            {course.name}
                          </h4>

                          <div className="card-text imagebg">
                            <p className="mb-1">
                              <strong>Duration:</strong> {course.duration}
                            </p>
                            <p className="mb-1">
                              <strong>Start Date:</strong> {course.start_date}
                            </p>
                            <p className="mb-1">
                              <strong>End Date:</strong> {course.end_date}
                            </p>
                            <p className="mb-1">
                              <strong>Limit:</strong> {course.no_of_devotees}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#courseCarousel"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#courseCarousel"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      )}
      <br />
      <div className=" text-center">
        <img
          src={Img}
          className="img-fluid "
          style={{ width: "50rem" }}
          alt="Image"
        />
      </div>
    </>
  );
};

export default Dashboard;
