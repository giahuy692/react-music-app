import React from 'react';
import { Typography, Card } from 'antd';
import AudioList from './components/AudioList';

const App = () => {
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 16px' }}>
      <Typography.Title level={2} style={{ textAlign: 'center' }}>
        Music Streaming App
      </Typography.Title>
      <Card>
        <AudioList />
      </Card>
    </div>
  );
};

export default App;
