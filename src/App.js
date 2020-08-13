import React, { useState, useEffect } from 'react';

const App = () => {
  const [userSearch, setUserSearch] = useState('');

  const [information, setInformation] = useState({
    id: '',
    passwd: '',
    name: '',
    gender: 'male',
    email: '',
  });
  const [userInfo, setUserInfo] = useState({
    name: '',
    gender: '',
    email: '',
  });
  const [custInfo, setCustInfo] = useState([]);
  const { id, passwd, name, gender, email } = information;

  useEffect(() => {
    console.log(information);
  })

  // ***** 이름으로 검색해서 출력 *****
  const sendDataToServer = (userSearch) => {
    const URL = `http://localhost:8090/customer/search/`;
    console.log(URL + userSearch);
    fetch(`${URL}${userSearch}`)
      .then((response) => response.json())
      .then((data) => {
        const [userData] = data.map((info) => info)
        console.log(userData);
        setUserInfo({ name: userData.name, gender: userData.gender, email: userData.email });
      })
  }

  const handleChange = (e) => {
    setUserSearch(e.target.value);
  }

  const handleSubmitFind = e => {
    e.preventDefault();
    sendDataToServer(userSearch);
    setUserSearch('');
  }
  // *********************************


  // ***** 모든 정보 DB에서 출력 *****


  const handleClick = () => {
    const URL = `http://localhost:8090/customer/information/`;
    fetch(URL)
      .then((response) => response.json())
      .then((data) => setCustInfo(data))
  }
  // **************************************


  // ***** 조건 입력 후 DB에 Row 추가 *****
  const handleChangeToSave = (e) => {
    const { value, name } = e.target;

    // 이전 information 값들에 추가 해주는 것.
    setInformation({
      ...information,
      [name]: value
    });

  }
  const handleSubmitSave = (e) => {
    console.log(information)
    e.preventDefault();
    const URL = `http://localhost:8090/customer/save/`;
    fetch(URL, {
      method: 'POST',
      body: JSON.stringify(information),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
  }
  // **********************************************

  return (
    <div>
      <form onSubmit={handleSubmitFind} className="find-customer">
        <input type="text" onChange={handleChange} value={userSearch} />
      </form>

      <button onClick={handleClick}>AllInfo</button>
      <div>
        {`Name: ${userInfo.name} Gender: ${userInfo.gender} Email: ${userInfo.email}`}
      </div>
      <div>
        <h2>Cust Information</h2>
        {custInfo.map((info, index) => {
          return (
            <h3 key={index}>{`Name: ${info.name} Gender: ${info.gender} Email: ${info.email} Title: ${info.title} Content: ${info.content}`}</h3>
          )
        })}
      </div>

      <form className="save-user" onSubmit={handleSubmitSave} >
        <label>User ID:</label>
        <input type="text" onChange={handleChangeToSave} name="id" />
        <label>Password:</label>
        <input type="text" onChange={handleChangeToSave} name="passwd" />
        <label>Name:</label>
        <input type="text" onChange={handleChangeToSave} name="name" />
        <label>Gender:</label>
        <select onChange={handleChangeToSave} name="gender">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <label>email:</label>
        <input type="text" onChange={handleChangeToSave} name="email" />
        <input type="submit" />
      </form>

    </div>
  )
}

export default App;
