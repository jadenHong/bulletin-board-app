import React, { useState, useEffect } from 'react';
import { REQUEST_TYPE } from './Constants';
import { URL } from './Constants';

const App = () => {
  const [userSearch, setUserSearch] = useState('');


  const [userInfo, setUserInfo] = useState({
    name: '',
    gender: '',
    email: '',
  });
  const [custInfo, setCustInfo] = useState([]);
  const [updateInfo, setUpdateInfo] = useState({
    id: '',
    content: '',
  });
  // const { id, passwd, name, gender, email } = information;

  useEffect(() => {
    getAllData();
  }, []);

  const makeObj = (param) => {
    return {
      test: 1,
      ...(param === 1 && { test2: 2 })
    }
    // if (param === 1) {
    //   return {
    //     test: 1,
    //     test2: 2
    //   }
    // } else {
    //   return {
    //     test: 1
    //   }
    // }
  }


  const fetchAPI = async (url, method = REQUEST_TYPE.GET, body = undefined) => {
    const fetchOpt = {
      method,
      headers: { 'Content-Type': 'application/json' },
    }
    if (method === REQUEST_TYPE.POST && body) {
      fetchOpt.body = JSON.stringify(body)
    }
    const response = await fetch(url, fetchOpt);
    const json = await response.json();
    return json;
  }



  // ***** 이름으로 검색해서 출력 *****
  const sendDataToServer = async (userSearch) => {
    const data = await fetchAPI(`${URL.SEARCH}${userSearch}`);
    const [userData] = data.map((info) => info)
    console.log(userData);
    setUserInfo({ name: userData.name, gender: userData.gender, email: userData.email });
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



  // userID, content 내용 입력후 update한다.
  const handlChangeToUpdate = (e) => {
    const { value, name } = e.target;
    setUpdateInfo({
      ...updateInfo,
      [name]: value
    });

  }


  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    const data = fetchAPI(URL.UPDATE, REQUEST_TYPE.POST, updateInfo);
    getAllData(data);
  }


  // 데이터 다 가져오기
  const getAllData = async () => {
    const data = await fetchAPI(URL.GETALL)
    setCustInfo(data);
  }

  // content 삭제!!!
  const deleteInfo = async (id) => {
    const path = URL.DELETE + id;
    const data = await fetchAPI(path)
    getAllData(data);
  }




  return (
    <div>
      {/* 선택한 이름의 유저 정보얻기 */}
      <form onSubmit={handleSubmitFind} className="find-customer">
        <input type="text" onChange={handleChange} value={userSearch} />
      </form>

      {/* 모든 유저정보 얻기 */}
      <div>
        {`Name: ${userInfo.name} Gender: ${userInfo.gender} Email: ${userInfo.email}`}
      </div>



      {/* 유저 이름으로 content Update하기 */}
      <form onSubmit={handleSubmitUpdate} >
        <h2>content 와 userID 를 입력하세요</h2>
        <input type="text" onChange={handlChangeToUpdate} name="id" />
        <input type="text" onChange={handlChangeToUpdate} name="content" />
        <input type="submit" />
      </form>

      {/* id입력받고 해당 데이터 삭제 */}
      {custInfo.map((data, index) => {
        const { id, name, gender, email, title, content } = data;
        return (
          // button에 onClick 시에 함수에 인자가 들어가게 되면 무조건 콜백사용해서 해라 제발
          <div key={index}>{`${id} - ${name} - ${gender} - ${email} - ${title} - ${content}`}<button onClick={() => deleteInfo(id)}>Delete</button></div>
        )
      })}

    </div>


  )
}

export default App;
