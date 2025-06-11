import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import Home from './pages/Home';
import Accomplishments from './pages/Accomplishments';
import PublicFeed from './pages/PublicFeed';
import AlmaMatterCoach from './pages/AlmaMatterCoach';
import { antdTheme } from './config/theme';
import './index.css';

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <AntApp>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/accomplishments" element={<Accomplishments />} />
            <Route path="/public-feed" element={<PublicFeed />} />
            <Route path="/almamatter-coach" element={<AlmaMatterCoach />} />
          </Routes>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;