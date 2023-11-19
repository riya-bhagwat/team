import React, { useEffect, useState } from "react";
import "./home.css";
// import { user_data } from "../data";
import ReactPaginate from "react-paginate";
import axios from "axios";

function Home() {
  const [search, setSearch] = useState("");
  const [user_data, setUser_data] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAvailable,setSelectedAvailable]=useState("");
  const [pagenumber, setPagenumber] = useState(0);

  const userperpage = 20;
  const pagesvisited = pagenumber * userperpage;
  const count = Math.ceil(user_data.length / userperpage);


  useEffect(() => {
    const loadData = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        let result = await axios.get(
          "http://localhost:5000/api/users/",
          config
        );
        setUser_data(result.data);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, []);



  const handleDomainChange = (e) => {
    const selectedDomain = e.target.value;
    setSelectedDomain(selectedDomain);
  };


  const handelGenderChange=(e)=>{
    const selectedGender=e.target.value;
    setSelectedGender(selectedGender)
  }


  const handelAvailable=(e)=>{
    const selectedAvailable=e.target.value;
    setSelectedAvailable(selectedAvailable);
  }

  const changePage = ({ selected }) => {
    setPagenumber(selected);
  };


  const displayusers = [...new Set(user_data.map((user) => user.id))].map((userId) => user_data.find((user) => user.id === userId))
    .filter((item) => {
      const isDomainMatch =
        selectedDomain === "" || item.domain === selectedDomain;

      const isNameMatch =
        search.toLowerCase() === "" ||
        item.first_name.toLowerCase().includes(search);

      const isGenderMatch= 
            selectedGender=== "" || item.gender===selectedGender;

      const isAvailable=
      selectedAvailable==="" || String(item.available)===selectedAvailable;

      return isDomainMatch && isNameMatch && isGenderMatch && isAvailable;
    })
  .slice(pagesvisited, pagesvisited + userperpage)
    .map((user, index) => {
      return (
        <div className="Container" key={index}>
          <div className="name">{user.first_name} {user.last_name}</div>
          <div className="name">{user.domain} </div>
          <div className="name">{user.gender} </div>
          <div className="name">{String(user.available)} </div>
        </div>
      );
    });

 
 

  return (
    <div className="outercontainer">
    <div className="Navbar">
      <div className="Search_Container ">
        <div className="Input_Container">
          <input
            type="text"
            placeholder="Search by name"
            //   value={searchTerm}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="dropdown">
          <select className="selected " onChange={handleDomainChange} value={selectedDomain}>
            {[...new Set(user_data.map((user) => user.domain))].map((user) => (
              <option key={user.id}>{user}</option>
            ))}
          </select>

          <select className="selected " onChange={handelGenderChange} value={selectedGender}>
          {[...new Set(user_data.map((user) => user.gender))].map((user) => (
              <option key={user.id}>{user}</option>
            ))}
          </select>

          <select className="selected " onChange={handelAvailable} value={selectedAvailable}>
            <option>true</option>
            <option>false</option>
          </select>
        </div>
      </div>

      <div className="outer-Container">
        <div className="displayusers">
        {displayusers}
        </div>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"next"}
          pageCount={count}
          onPageChange={changePage}
          containerClassName="paginationButton"
          nextLinkClassName="nextButton"
          previousLinkClassName="previousButton"
          disabledClassName="paginationDisabled"
          activeClassName="paginationActive"
        />
      </div>
      </div>
    </div>
  );
}

export default Home;
