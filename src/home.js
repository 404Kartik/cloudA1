import React, { useState, useEffect } from 'react';
import NavBar from './navbar';
import { useLocation } from 'react-router-dom';
import './home.css';
import MusicSection from './musicSection';
import QuerySection from './querySection';
import UserSection from './userSection';

export default function Home() {
  const location = useLocation();
  const email = location?.state?.email;
  const API_URL = "https://wt4cndvg3g.execute-api.us-east-1.amazonaws.com/Staging/";

  const [homeData, setHomeData] = useState(null);
  const [username, setUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [email]);

  useEffect(() => {
    console.log('Home data updated:', homeData);
  }, [homeData]);

  async function fetchData() {
    try {
      const username_and_songs = await fetchHomeData(email, API_URL);
      setUsername(username_and_songs.user_name);
      setHomeData(username_and_songs.subscribed_songs);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setIsLoading(false);
    }
  }

  async function fetchHomeData(email, API_URL) {
    const response_username = await fetch(API_URL + "home", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (!response_username.ok) {
      throw new Error('Network response was not ok');
    }

    return response_username.json();
  }

  const handleUnsubscribe = async (song_name) => {
    try {
      const response = await unsubscribeSong(email, song_name, API_URL);

      if (response.ok) {
        const newHomeData = homeData.filter(
          (music) => `${music.title}-${music.artist}` !== song_name
        );
        setHomeData(newHomeData);
      } else {
        console.error('Error unsubscribing from the song');
      }
    } catch (error) {
      console.error('Error unsubscribing from the song:', error);
    }
  };

  async function unsubscribeSong(email, song_name, API_URL) {
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, song_name, action: 'unsubscribe' }),
    };

    return fetch(API_URL + 'home', requestOptions);
  }

  const handleSubscribe = async (song_name, query_data) => {
    try {
      const response = await subscribeSong(email, song_name, API_URL);

      if (response.ok) {
        const newMusic = query_data.find(
          (music) => `${music.title}-${music.artist}` === song_name
        );

        if (newMusic) {
          const newHomeData = [...homeData, newMusic];
          setHomeData(newHomeData);
        }
      } else {
        console.error('Error subscribing from the song');
      }
    } catch (error) {
      console.error('Error subscribing from the song:', error);
    }
  };

  async function subscribeSong(email, song_name, API_URL) {
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, song_name, action: 'subscribe' }),
    };

    return fetch(API_URL + 'home', requestOptions);
  }

  // Rendering the home page.
  return (
    <div className='main_content'>
        <NavBar />
        <UserSection username={username} />
        <MusicSection homeData={homeData} isLoading={isLoading} onUnsubscribe={handleUnsubscribe} />        
        <QuerySection email={email} onSubscribe={handleSubscribe} isLoading={isLoading} />
    </div>
  )
}