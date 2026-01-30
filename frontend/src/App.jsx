import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BoardList from "./components/BoardList";
import BoardDetail from "./components/BoardDetail";
import BoardWrite from "./components/BoardWrite";
import BoardEdit from "./components/BoardEdit";

export default function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BoardList />} />
          <Route path="/boards" element={<BoardList />} />
          <Route path="/boards/write" element={<BoardWrite />} />
          <Route path="/boards/:id/edit" element={<BoardEdit />} />
          <Route path="/boards/:id" element={<BoardDetail />} />
          <Route path="*" element={<Navigate to="/boards" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
