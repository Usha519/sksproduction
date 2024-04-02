import React, { useState, useEffect } from "react";
import Nav from "./nav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./donation.css";
import DonationImg from "./assets/Charity-cuate.png";
// import Pagination from "./pagination";
import Modal from "react-modal";
import { BASE_URL } from "./api";
import "./App.css";
import logo3 from "./assets/icons8-delete-30.png";
import { Link } from "react-router-dom";
import logo2 from "./assets/icons8-edit-25.png";


const Donation = () => {
  const token = localStorage.getItem("token");
  const [donation, setDonation] = useState({
    devotee_name: "",
    devotee_mail: "",
    amount_to_donate: "",
    mobile_num: "",
    user: "",
    paymentMode: "", // Add payment Mode property
  });
  const [editingDonation, setEditingDonation] = useState(null);
  const [reload,setReload]=useState(false)
  const [showModal, setShowModal] = useState(false);
  const [donationslist, setDonationslist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [devoteeMobile, setDevoteeMobile] = useState([]);
  const [combinedInput, setCombinedInput] = useState("");
  const [suggestedMobile, setSuggestedMobile] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const donationPerPage = 5;

  const resetForm = () => {
    setDonation({
      devotee_name: "",
      devotee_mail: "",
      amount_to_donate: "",
      mobile_num: "",
      paymentMode: "",
    });
    setSuggestedMobile([]);
    setSearchTerm("");
  };

  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestedMobileClick = async (mobile) => {
    try {
      console.log("Fetching devotee details for mobile:", mobile);
      const response = await fetch(
        `${BASE_URL}/get_devotee_details_by_mobile/${mobile}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("Devotee details response:", data);

      if (response.ok) {
        setDonation((prevDonation) => ({
          ...prevDonation,
          mobile_num: mobile,
          devotee_name: data.devotee_details.name,
          devotee_mail: data.devotee_details.mail,
        }));
        setCombinedInput(mobile);
        setSuggestedMobile([]);
      } else {
        console.error("Error fetching devotee details:", data.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm(); // Reset form data when the modal is closed
  };

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/get_all_donations?page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setDonationslist(data.donations);
          setTotalPages(data.total_pages);
          setReload(false)
        } else {
          console.error("Error fetching devotees:", data.message);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };
    fetchDonations();
  }, [reload,donation,token, currentPage]);

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

  const handleDeleteDonation = async (donationId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/delete_donation/${donationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReload(true)
        // Remove the deleted donation from the list
        setDonationslist(
          donationslist.filter((donation) => donation._id !== donationId)
        );
        toast.success("Donation Deleted Successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoclose: 300,
        });
        
      } else {
        const errorData = await response.json();
        console.error("Error deleting donation:", errorData.message);
        // Handle error scenarios, show error message, etc.
      }
    } catch (error) {
      console.error("Error:", error.message);
      // Handle error scenarios
    }
  };

  useEffect(() => {
    const fetchDevoteeMobile = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/devotee_mobile_numbers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setDevoteeMobile(data.devotee_mobile_numbers);
        } else {
          console.error("Error fetching devotee emails:", data.message);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };
    fetchDevoteeMobile();
  }, [token]);

  const handleAddDonation = async () => {
    if (!donation.mobile_num && !donation.devotee_name && !donation.amount_to_donate && !donation.paymentMode) {
      toast.error("Please fill in all required fields.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
    if (!donation.mobile_num) {
      console.error("Please enter mobile.");
      // Display an error message on the UI
      toast.error("Please enter mobile number.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 300,
      });
      return;
    }
    const isValidAmount = /^\d+(\.\d{1,2})?$/.test(donation.amount_to_donate);

    if (!isValidAmount) {
      console.error("Please enter a valid amount .");
      // Display an error message on the UI
      toast.error("Please enter Amount .", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 300,
      });
      return;
    }


    if (!isValidAmount && !donation.paymentMode) {
      console.error("Please enter a valid amount and select a payment method.");
      // Display an error message on the UI
      toast.error("Please enter Amount and select a Payment Method.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 300,
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/add_donation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          devotee_name: donation.devotee_name,
          devotee_mail: donation.devotee_mail,
          amount_to_donate: donation.amount_to_donate,
          mobile_num: donation.mobile_num,
          user: donation.user,
          paymentMode: donation.paymentMode,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setDonationslist([...donationslist, data.donation]);
        toast.success("Donation Added Successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      } else {
        toast.error(`Error adding donation: ${data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(`Error: ${error.message}`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
    setShowModal(false);
    resetForm();
  };
  const handleDonationChange = (event) => {
    const { name, value } = event.target;

    setDonation((prevDonation) => ({
      ...prevDonation,
      [name]: value,
    }));

    if (name === "mobile_num") {
      if (devoteeMobile && value.trim().length > 0) {
        const filteredMobiles = devoteeMobile.filter((mobile) =>
          mobile.startsWith(value)
        );

        console.log("Filtered Mobiles:", filteredMobiles);
        setSuggestedMobile(filteredMobiles);
      } else {
        setSuggestedMobile([]);
      }
    }
  };
  const handleEditOrAddDonation = async (event) => {
    event.preventDefault();
   
  
    // Validate the amount format
    const isValidAmount = /^\d+(\.\d{1,2})?$/.test(donation.amount_to_donate);
    if (!isValidAmount) {
      toast.error("Please enter a valid amount.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
  
    if (!donation.paymentMode) {
      toast.error("Please select a payment method.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
    if (!donation.mobile_num || !donation.devotee_name || !donation.amount_to_donate || !donation.paymentMode) {
      toast.error("Please fill in all required fields.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
  
    try {
      if (editingDonation) {
        await handleEditSubmit();
      } else {
        await handleAddDonation();
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(`Error: ${error.message}`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };
  
  const handleEditSubmit = async (event) => {
    event.preventDefault();
    // Validate if all required fields are filled
    if (!donation.mobile_num && !donation.devotee_name && !donation.amount_to_donate && !donation.paymentMode) {
      toast.error("Please fill in all required fields.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }

    // Validate the amount format
    const isValidAmount = /^\d+(\.\d{1,2})?$/.test(donation.amount_to_donate);
    if (!isValidAmount) {
      toast.error("Please enter a valid amount.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return;
    }
    if (!isValidAmount && !donation.paymentMode) {
      console.error("Please enter a valid amount and select a payment method.");
      // Display an error message on the UI
      toast.error("Please enter Amount and select a Payment Method.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 300,
      });
      return;
    }
    if (!donation.mobile_num) {
      console.error("Please enter mobile.");
      // Display an error message on the UI
      toast.error("Please enter mobile number.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 300,
      });
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/update_donation/${editingDonation._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          devotee_name: donation.devotee_name,
          devotee_mail: donation.devotee_mail,
          amount_to_donate: donation.amount_to_donate,
          mobile_num: donation.mobile_num,
          paymentMode: donation.paymentMode,
        }),
      });

      if (response.ok) {
        const updatedDonation = await response.json();
        const updatedDonations = donationslist.map((donation) =>
          donation._id === updatedDonation._id ? updatedDonation : donation
        );
        setDonationslist(updatedDonations);
        toast.success("Donation Updated Successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
        closeModal();
      } else {
        const errorData = await response.json();
        console.error("Error updating donation:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };




  useEffect(() => {
    if (editingDonation) {
      setDonation({
        devotee_name: editingDonation.devotee_name || "",
        devotee_mail: editingDonation.devotee_mail || "",
        amount_to_donate: editingDonation.amount_to_donate || "",
        mobile_num: editingDonation.mobile_num || "",
        paymentMode: editingDonation.paymentMode || "",
      });
    } else {
      // If no editingDonation is set, reset the donation fields
      setDonation({
        devotee_name: "",
        devotee_mail: "",
        amount_to_donate: "",
        mobile_num: "",
        paymentMode: "",
      });
    }
  }, [editingDonation]);

  useEffect(() => {
    const updatedFilteredDonations = donationslist.filter(
      (donation) =>
        donation.devotee_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        donation.mobile_num
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        donation.amount_to_donate
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        donation.paymentMode
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredDonations(updatedFilteredDonations);
  }, [donationslist, searchTerm]);

  const handleEditDonation = (donation) => {
    setEditingDonation(donation);
    setShowModal(true);
  };

  return (
    <>
      <Nav></Nav>
      <br />
      <br />
      <br />
      <section className=" container-fluid ">
        <div className="row">
          <div className="col-mb-6">
            <div className="row">
              <div className="col-md-4 col-3 ">
                <div className="text-ster top">
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="input rounded"
                  />
                </div>
              </div>
              <div className="col-md-4 col-6 ">
                <div className="text-center">
                  <img
                    src={DonationImg}
                    className="img-fluid cimg"
                    alt="..."
                    
                  />
                </div>
              </div>
              <div className="col-md-4 col-3">
                <div className="text-end top">
                  <button
                    type="button"
                    className="btn btn-dark rounded btn-sm f shadow-sm"
                    onClick={openModal}
                  >
                    Add Donation
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Modal
            isOpen={showModal}
            onRequestClose={closeModal}
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
            {filteredDonations.length === 0}

            <form onSubmit={handleEditOrAddDonation} >
              <h3 className="text-dark  form-outline mb-2">
                Add Donation Form
              </h3>
              <div className="d-grid gap-2">
                <div className="mb-1 position-relative">
                  <label className="form-label" htmlFor="combinedInput">
                    Mobile
                  </label>
                  <input
                    type="number"
                    id="combinedInput"
                    name="mobile_num"
                    placeholder="Enter Mobile"
                    value={donation.mobile_num}
                    onChange={handleDonationChange}
                    className="form-control mb-2"
                  />

                  {suggestedMobile.length > 0 && (
                    <div className="suggested-mobile-container">
                      {suggestedMobile.map((mobile) => (
                        <div
                          key={mobile}
                          onClick={() => handleSuggestedMobileClick(mobile)}
                          className="suggested-mobile-item"
                        >
                          {mobile}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-1">
                  <label className="form-label" htmlFor="paymentMethodInput">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethodInput"
                    name="paymentMode"
                    value={donation.paymentMode}
                    onChange={handleDonationChange}
                    className="form-control mb-2"
                  >
                    <option value="">Select Payment</option>
                    <option value="cash">Cash</option>
                    <option value="credit card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="phone pay">Phone pay</option>
                    <option value="googlepay">Googlepay</option>
                    <option value="paytem">Paytem</option>
                    {/* Add more payment options as needed */}
                  </select>
                </div>

                <div className="mb-1">
                  <label className="form-label" htmlFor="form6Example5">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount_to_donate"
                    id="form6Example5"
                    value={donation.amount_to_donate}
                    className="form-control"
                    onChange={handleDonationChange}
                  />
                </div>

                <div className="mb-1">
                  <label className="form-label" htmlFor="form6Example5">
                    Name
                  </label>
                  <input
                    type="text"
                    name="devotee_name"
                    id="form6Example5"
                    className="form-control"
                    onChange={handleDonationChange}
                    value={donation.devotee_name}
                  />
                </div>
                <div className="mb-1">
                  <label className="form-label" htmlFor="form6Example5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="devotee_mail"
                    id="form6Example5"
                    className="form-control"
                    onChange={handleDonationChange}
                    value={donation.devotee_mail}
                  />
                </div>

                <div className="row g-2">
                  <div className="col-md-6 mb-1 d-grid">
                    <button type="submit" className="btn btn-dark rounded-pill">
                      Submit
                    </button>
                  </div>
                  <div className="col-md-6 mb-1 d-grid">
                    <button
                      type="button"
                      className="btn btn-danger rounded-pill"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </Modal>
          <div className="mt-6 flex flex-col">
            {/* <div className="flex justify-between items-center mt-4 ">
            <label htmlFor="minAmount" className=" fw-bolder ">Min Amount :</label>
            <input
              type="number"
              id="minAmount"
              className="inputs rounded"
              value={minAmount}
              onChange={handleMinAmountChange}
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <label htmlFor="maxAmount" className=" fw-bolder ">Max Amount:</label>
            <input
              type="number"
              id="maxAmount"
              className="inputs rounded"
              value={maxAmount}
              onChange={handleMaxAmountChange}
            />
          </div> */}
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="">
                  <div className="mt-5">
                    <div className="card-table table-responsive rounded">
                      <div className="cart-product">
                        <table className="table table-responsive table-bordered table-hover text-center text-capitalize table-small-font">
                          <thead>
                            <tr className="table-dark text-light">
                              <th>S.No</th>
                              <th>Name</th>
                              <th>Email Id</th>
                              <th>Date</th>
                              <th>Amount</th>
                              <th> payment method</th>
                              <th>Edit</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody className="fw-semibold">
                            {filteredDonations.map((donation, i) => (
                              <tr key={donation._id}>
                                <td>{i + 1}</td>
                                <td>{donation.devotee_name}</td>
                                <td>{donation.devotee_mail}</td>
                                <td>{donation.donation_date}</td>
                                <td>{donation.amount_to_donate}</td>
                                <td>{donation.paymentMode}</td>
                                <td>
                                  <button
                                    className="btn btn-light btn-sm rounded shadow btn-md "
                                    onClick={() => handleEditDonation(donation)} // Call handleEditDonation with the donation data
                                  >
                                    <img
                                      src={logo2}
                                      className="img-fluid img21"
                                    />{" "}
                                  </button>
                                </td>
                                <td>
                                  <button className="btn btn-light btn-sm  text-light rounded shadow  ">
                                    <Link
                                      className="nav-link text-dark text-center "
                                      onClick={() =>
                                        handleDeleteDonation(donation._id)
                                      }
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pagination-container">
          <button
            className="pagination-btn prev-btn btn-sm fw-light   rounded"
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
            className="pagination-btn btn-sm next-btn rounded fw-light  "
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

export default Donation;
