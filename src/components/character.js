import React, { useEffect, useState } from "react";
import axios from "axios";

function Character() {
  const [character, setCharacter] = useState({});
  const [isPaused, setPaused] = useState(false);
  const [characterList, setList] = useState([]);;


  useEffect(() => {
    if (!character.id) {
      getData()
    }
    const interval = setInterval(() => {
      if (!isPaused) {
        getData()
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isPaused, characterList]);

  function getData() {
      const randomCharacterId = Math.floor((Math.random() * 183) + 1)
      axios.get(`https://rickandmortyapi.com/api/character/${randomCharacterId}`).then((res) => {
        setCharacter(res?.data);
        handleAdd(res?.data)
      }).catch((err) => {
        alert('An error occured')
      })
      ;
  };
  
  function handleAdd(data) {
    if (checkForDuplicateCharacters(data)) {
      getData()
    } else {
      characterList.push(data);
      setList(characterList);
    }
  }

  function checkStatus(status) {
    return status !== "alive"
  }

  function checkForDuplicateCharacters(data) {
    return characterList.some(item => item.id === data.id)
  }

  function statusColor(status) {
    switch(status) {
      case 'Alive': 
        return 'green';
      case 'Dead': 
        return 'red'
      case 'unknown': 
        return 'grey'    
      default: 
        return 'grey'
    }
  }

  function skip() {
    getData();
  }

  function pause() {
    setPaused(!isPaused)
  }

  function status() {
    const filtered = characterList.filter((item) => item.status === "Alive")
    setList(filtered);
  }
  
  return (
    <div>
      <div className="flex w-160 h-60 rounded-lg container">
        <img className="character-img" src={character.image}></img>
        <div className="flex flex-col text-white p-3 pl-6 w-full">
          <span className="text-2xl font-bold">{character.name}</span>
          <div className="flex flex-col mb-2">
            <span className="text-lg text-gray-400">Status</span>
            <div className="flex leading-tight items-center">
              <span className="status-icon" style={{backgroundColor: statusColor(character.status)}}></span> {character.status}
            </div>
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-lg text-gray-400">Species</span>
            <span className="leading-tight">{character.species}</span>
          </div>
          <div className="flex flex-col mb-2">
            <span className="text-lg text-gray-400">Gender</span>
            <span className="leading-tight">{character.gender}</span>
          </div>
        </div>
        <div className="w-full overlay">
          <div className="text flex flex-col text-white ">
            <span className="text-2xl font-bold">Location Data</span>
            <span className="leading-tight">{character?.location?.name}</span>          
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex relative">
        {characterList.slice(Math.max(characterList.length - 5, 0)).map((data, i) => {
          return (
            <div key={i} className="text-white flex mr-4 overflow-ellipsis listItem">
                <span className="absolute text-xs p-1 z-50">{data.name}</span>
                <span className="absolute text-xs p-1 z-50 top-4">
                  <div className="flex leading-tight items-center">
                    <span className="status-icon block" style={{backgroundColor: statusColor(data.status)}}></span> {data.status}
                  </div>
                </span>
                <img className="w-32 h-32 rounded-lg" src={data.image}></img>
                <div className="listOverlay"></div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-evenly mt-4">
        <button className="control-btn" onClick={skip}>Skip</button>
        <button onClick={pause} style={{backgroundColor: isPaused ? 'black' : ''}}>Pause</button>
        <button onClick={status}>Status</button>

      </div>
    </div>
  );
}

export default Character;