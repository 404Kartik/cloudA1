
import React, { useState } from 'react';
import './querySection.css';

function QuerySection({ email, onSubscribe, isLoading }) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [artist, setArtist] = useState('');
  const [queryData, setQueryData] = useState([]);

  const handleSubscribe = (song_name, queryData) => {
    const tempQueryData = [...queryData];
    const index = queryData.findIndex((song) => `${song.title}-${song.artist}` === song_name);
    queryData.splice(index, 1);
    onSubscribe(song_name, tempQueryData);
  };

  const handleQuery = async () => {
    if (title === '' && artist === '' && year === '') {
      alert('Please enter at least one search parameter');
      return;
    }

    try {
      const data = await fetchQueryResults(email, title, artist, year);
      if (data.length === 0) {
        alert('No results found. Please try again.');
        return;
      }
      setQueryData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchQueryResults = async (email, title, artist, year) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, title, artist, year }),
    };

    const response = await fetch('https://wt4cndvg3g.execute-api.us-east-1.amazonaws.com/Staging/home', requestOptions);
    return response.json();
  };

  return (
    <div className="query-section">
      <h1> Query Section</h1>
      <QueryForm title={title} setTitle={setTitle} year={year} setYear={setYear} artist={artist} setArtist={setArtist} handleQuery={handleQuery} />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <MusicList queryData={queryData} handleSubscribe={handleSubscribe} />
      )}
    </div>
  );
}

function QueryForm({ title, setTitle, year, setYear, artist, setArtist, handleQuery }) {
  return (
    <>
      <label htmlFor="title">Title:</label>
      <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <label htmlFor="year">Year:</label>
      <input type="text" id="year" value={year} onChange={(e) => setYear(e.target.value)} />
      <label htmlFor="artist">Artist:</label>
      <input type="text" id="artist" value={artist} onChange={(e) => setArtist(e.target.value)} />
      <button onClick={handleQuery}>Query</button>
    </>
  );
}

function MusicList({ queryData, handleSubscribe }) {
  return (
    <div className="musicList">
      {queryData.map((music) => (
        <MusicItem key={music.title} music={music} handleSubscribe={() => handleSubscribe(`${music.title}-${music.artist}`, queryData)} />
      ))}
    </div>
  );
}

function MusicItem({ music, handleSubscribe }) {
    return (
      <div className="musicItem">
        <p>{music.title}</p>
        <p>{music.artist}</p>
        <p>{music.year}</p>
        <img src={music.img_url} alt={music.artist} />
        <button onClick={handleSubscribe}>
          Subscribe
        </button>
      </div>
    );
  }
  
  export default QuerySection;