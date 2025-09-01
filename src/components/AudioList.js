import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Card, Select } from 'antd';
import { fetchTracks } from '../features/tracksSlice';

/**
 * AudioList component to display a list of audio tracks with built‑in
 * HTML5 controls. Tracks are fetched from a JSON file via the
 * tracksSlice async thunk. Loading and error states are handled
 * gracefully and displayed to the user.
 */
const AudioList = () => {
  const dispatch = useDispatch();
  const tracks = useSelector((state) => state.tracks.tracks);
  const status = useSelector((state) => state.tracks.status);
  const error = useSelector((state) => state.tracks.error);

  // Reference array to control each audio element
  const audioRefs = useRef([]);

  // Index of the currently playing track
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  // Count of how many times the current track has been played
  const [currentPlayCount, setCurrentPlayCount] = useState(0);
  // Number of times to repeat a track before advancing (Infinity means loop forever)
  const [repeatTimes, setRepeatTimes] = useState(1);

  // Fetch tracks on initial load
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTracks());
    }
  }, [status, dispatch]);

  /**
   * Pause all audio elements except the one at the given index. This ensures
   * only a single track plays at any time.
   * @param {number} index Index of the audio that should remain playing
   */
  const pauseOthers = (index) => {
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== index) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  };

  /**
   * Handler when a track starts playing. Sets the current track index and resets the play count.
   * @param {number} index Index of the track that started playing
   */
  const handlePlay = (index) => {
    pauseOthers(index);
    setCurrentTrackIndex(index);
    // reset play count when switching tracks
    setCurrentPlayCount(1);
  };

  /**
   * Handler when a track ends. If the repeat count for the current track
   * hasn't been reached, replay the same track. Otherwise, advance to the
   * next track in the list (looping back to the first track when
   * necessary).
   */
  const handleEnded = (index) => {
    if (currentTrackIndex !== index) return;
    // Determine if we should repeat the same track
    if (repeatTimes === Infinity || currentPlayCount < repeatTimes) {
      // replay current track
      const audio = audioRefs.current[index];
      if (audio) {
        setCurrentPlayCount((prev) => prev + 1);
        // restart playback
        audio.currentTime = 0;
        audio.play();
      }
    } else {
      // move to next track
      const nextIndex = (index + 1) % tracks.length;
      setCurrentTrackIndex(nextIndex);
      setCurrentPlayCount(1);
      const nextAudio = audioRefs.current[nextIndex];
      if (nextAudio) {
        pauseOthers(nextIndex);
        nextAudio.currentTime = 0;
        nextAudio.play();
      }
    }
  };

  /**
   * Render helper to display loading or error states.
   */
  if (status === 'loading') {
    return <p>Loading...</p>;
  }
  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      {/* Repeat mode selector */}
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 8 }}>Repeat:</span>
        <Select
          value={repeatTimes}
          onChange={(value) => setRepeatTimes(value)}
          style={{ width: 120 }}
        >
          <Select.Option value={1}>1×</Select.Option>
          <Select.Option value={3}>3×</Select.Option>
          <Select.Option value={10}>10×</Select.Option>
          <Select.Option value={Infinity}>∞</Select.Option>
        </Select>
      </div>
      <List
        itemLayout="vertical"
        dataSource={tracks}
        bordered
        renderItem={(item, index) => (
          <List.Item
            style={{
              backgroundColor: currentTrackIndex === index ? '#f0f5ff' : 'transparent',
            }}
          >
            <Card title={item.title}>
              <audio
                controls
                style={{ width: '100%' }}
                ref={(el) => (audioRefs.current[index] = el)}
                onPlay={() => handlePlay(index)}
                onEnded={() => handleEnded(index)}
              >
                <source
                  src={`${process.env.PUBLIC_URL}/${item.file}`}
                  type="audio/mpeg"
                />
                Your browser does not support the audio element.
              </audio>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default AudioList;