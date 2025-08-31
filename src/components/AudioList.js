import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Typography } from 'antd';
import { fetchTracks } from '../features/tracksSlice';

const AudioList = () => {
  const dispatch = useDispatch();
  const { tracks, status, error } = useSelector((state) => state.tracks);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTracks());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <Typography.Text>Loading...</Typography.Text>;
  }

  if (status === 'failed') {
    return <Typography.Text type="danger">{error}</Typography.Text>;
  }

  return (
    <List
      dataSource={tracks}
      renderItem={(item) => (
        <List.Item>
          <Typography.Text>{item.title}</Typography.Text>
          <audio controls style={{ marginLeft: '10px' }}>
            <source src={process.env.PUBLIC_URL + '/' + item.file} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </List.Item>
      )}
    />
  );
};

export default AudioList;
